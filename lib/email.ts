import type { BlogPost } from "@/data/posts"
import { listSubscriberEmails } from "@/data/subscribers"
import { emailConfig, publicEnv } from "@/lib/env"

type BaseEmailResult = {
  status: "sent" | "skipped" | "failed"
  message: string
  error?: string
  id?: string
}

export type PostEmailDeliveryResult = {
  status: "sent" | "skipped" | "partial" | "failed"
  message: string
  totalSubscribers: number
  sentCount: number
  failedCount: number
  failures: Array<{ email: string; error: string }>
}

type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
}

const RESEND_API_URL = "https://api.resend.com/emails"
const EMAIL_CONCURRENCY = 5

function buildSubscriptionConfirmationEmail(email: string) {
  const blogUrl = `${publicEnv.NEXT_PUBLIC_SITE_URL}/blog`

  return {
    subject: "You’ve successfully subscribed",
    text: `You're subscribed to new posts and newsletter updates for ${publicEnv.NEXT_PUBLIC_SITE_URL}. Read the latest posts at ${blogUrl}.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; padding: 24px;">
        <h1 style="margin: 0 0 16px; font-size: 24px;">You’ve successfully subscribed</h1>
        <p style="margin: 0 0 16px;">${email} is now subscribed to receive new posts and newsletter updates.</p>
        <p style="margin: 0 0 24px;">You can read the latest articles any time on the blog.</p>
        <a href="${blogUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #111827; color: #ffffff; text-decoration: none;">Read the blog</a>
      </div>
    `,
  }
}

function buildPostAnnouncementEmail(post: BlogPost) {
  const postUrl = `${publicEnv.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`

  return {
    subject: `New post: ${post.title}`,
    text: `${post.title}\n\n${post.excerpt}\n\nRead the full post: ${postUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; padding: 24px;">
        <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7280;">New post</p>
        <h1 style="margin: 0 0 16px; font-size: 28px;">${post.title}</h1>
        <p style="margin: 0 0 24px;">${post.excerpt}</p>
        <a href="${postUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #111827; color: #ffffff; text-decoration: none;">Read the full post</a>
      </div>
    `,
  }
}

async function sendResendEmail({ to, subject, html, text }: SendEmailInput): Promise<BaseEmailResult> {
  if (!emailConfig.resendEnabled || !emailConfig.fromEmail) {
    return {
      status: "skipped",
      message: `Email delivery skipped. Missing: ${emailConfig.resendMissingKeys.join(", ")}`,
    }
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailConfig.fromEmail,
        to: [to],
        subject,
        html,
        text,
        reply_to: emailConfig.replyToEmail ?? undefined,
      }),
    })

    const payload = (await response.json().catch(() => null)) as
      | { id?: string; message?: string; name?: string }
      | null

    if (!response.ok) {
      const errorMessage =
        (payload && "message" in payload && payload.message) ||
        (payload && "name" in payload && payload.name) ||
        "Resend rejected the email request."

      return {
        status: "failed",
        message: "Email delivery failed.",
        error: errorMessage,
      }
    }

    return {
      status: "sent",
      message: "Email sent.",
      id: payload?.id,
    }
  } catch (error) {
    return {
      status: "failed",
      message: "Email delivery failed.",
      error: error instanceof Error ? error.message : "Unknown email error",
    }
  }
}

export async function sendSubscriptionConfirmationEmail(email: string) {
  const template = buildSubscriptionConfirmationEmail(email)
  return sendResendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}

async function runInBatches<T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  limit = EMAIL_CONCURRENCY,
) {
  for (let index = 0; index < items.length; index += limit) {
    const batch = items.slice(index, index + limit)
    await Promise.all(batch.map(worker))
  }
}

export async function sendPostEmailToSubscribers(post: BlogPost): Promise<PostEmailDeliveryResult> {
  if (!emailConfig.resendEnabled) {
    return {
      status: "skipped",
      message: `Subscriber email delivery skipped. Missing: ${emailConfig.resendMissingKeys.join(", ")}`,
      totalSubscribers: 0,
      sentCount: 0,
      failedCount: 0,
      failures: [],
    }
  }

  if (post.status !== "published" || post.source !== "blog") {
    return {
      status: "skipped",
      message: "Only published blog posts are eligible for subscriber email delivery.",
      totalSubscribers: 0,
      sentCount: 0,
      failedCount: 0,
      failures: [],
    }
  }

  const subscribers = await listSubscriberEmails()
  if (subscribers.length === 0) {
    return {
      status: "skipped",
      message: "No subscribers are currently stored in MongoDB.",
      totalSubscribers: 0,
      sentCount: 0,
      failedCount: 0,
      failures: [],
    }
  }

  const template = buildPostAnnouncementEmail(post)
  const failures: Array<{ email: string; error: string }> = []
  let sentCount = 0

  await runInBatches(subscribers, async (subscriberEmail) => {
    const result = await sendResendEmail({
      to: subscriberEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (result.status === "sent") {
      sentCount += 1
      return
    }

    failures.push({
      email: subscriberEmail,
      error: result.error ?? result.message,
    })
  })

  const failedCount = failures.length
  if (sentCount === 0) {
    return {
      status: "failed",
      message: "Failed to send the post email to subscribers.",
      totalSubscribers: subscribers.length,
      sentCount,
      failedCount,
      failures,
    }
  }

  if (failedCount > 0) {
    return {
      status: "partial",
      message: "Sent the post email to some subscribers, but some deliveries failed.",
      totalSubscribers: subscribers.length,
      sentCount,
      failedCount,
      failures,
    }
  }

  return {
    status: "sent",
    message: "Sent the post email to all subscribers.",
    totalSubscribers: subscribers.length,
    sentCount,
    failedCount: 0,
    failures: [],
  }
}
