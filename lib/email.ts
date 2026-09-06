import { Resend } from "resend"
import crypto from "crypto"
import { render } from "@react-email/components"
import { NewsletterEmail } from "@/emails/newsletter"
import { CommentNotificationEmail } from "@/emails/comment-notification"
import { env } from "./env"
import type { Db } from "mongodb"
import { ObjectId } from "mongodb"
import type { Comment } from "@/models/comment"
import type { Post } from "@/models/post"
import type { Subscriber } from "@/models/subscriber"

// Lazy so `next build` doesn't construct it at module load — `new Resend("")`
// throws "Missing API key", which broke CI (no RESEND_API_KEY there). Send paths
// are already guarded by emailConfig.resendEnabled in their callers.
let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(env.RESEND_API_KEY || "re_missing")
  return _resend
}

const CHUNK = 100 // Resend batch limit

/**
 * Email a published post to every confirmed subscriber. Renders a per-recipient
 * unsubscribe link, backfills any missing `unsubscribeToken`, and sends in
 * batches of 100 to stay under Resend's rate limit / avoid a per-email loop.
 * Idempotent-ish: sets `post.newsletterSentAt`; callers should check it first.
 *
 * ponytail: a real job queue is the ceiling for very large lists; batch send
 * covers the current subscriber count fine.
 */
export async function sendNewsletterToConfirmedSubscribers(
  post: Post,
  db: Db,
): Promise<{ sent: number; failed: number; total: number }> {
  const subscribers = await db
    .collection<Subscriber>("subscribers")
    .find({ confirmed: true })
    .toArray()

  const postUrl = `${env.SITE_URL}/blog/${post.slug}`
  let sent = 0
  let failed = 0

  for (let i = 0; i < subscribers.length; i += CHUNK) {
    const batch = subscribers.slice(i, i + CHUNK)
    const payloads = await Promise.all(
      batch.map(async (sub) => {
        let token = sub.unsubscribeToken
        if (!token) {
          token = crypto.randomUUID()
          await db
            .collection<Subscriber>("subscribers")
            .updateOne({ _id: sub._id }, { $set: { unsubscribeToken: token } })
        }
        return {
          from: env.RESEND_FROM_EMAIL,
          replyTo: env.RESEND_REPLY_TO_EMAIL,
          to: sub.email,
          subject: post.title,
          html: await render(
            NewsletterEmail({
              postTitle: post.title,
              postExcerpt: post.excerpt,
              postUrl,
              unsubscribeUrl: `${env.SITE_URL}/api/subscribers/unsubscribe?token=${token}`,
              postImage: post.coverImage,
              authorName: post.authorName,
              authorImageUrl: post.authorImageUrl,
              siteUrl: env.SITE_URL,
            }),
          ),
        }
      }),
    )

    try {
      const { error } = await getResend().batch.send(payloads)
      if (error) {
        failed += batch.length
        console.error("Newsletter batch failed:", error.message)
      } else {
        sent += batch.length
      }
    } catch (err) {
      failed += batch.length
      console.error("Newsletter batch threw:", err)
    }
  }

  if (post._id) {
    await db
      .collection<Post>("posts")
      .updateOne({ _id: post._id }, { $set: { newsletterSentAt: new Date() } })
  }

  return { sent, failed, total: subscribers.length }
}

export async function sendCommentNotificationEmail({
  to,
  replierDisplayName,
  postTitle,
  postUrl,
  replyContent,
  originalContent,
  commentId,
}: {
  to: string
  replierDisplayName: string
  postTitle: string
  postUrl: string
  replyContent: string
  originalContent: string
  commentId: string
}) {
  const html = await render(
    CommentNotificationEmail({
      replierDisplayName,
      postTitle,
      postUrl,
      replyContent,
      originalContent,
      commentId,
    })
  )

  const { error } = await getResend().emails.send({
    from: env.RESEND_FROM_EMAIL,
    replyTo: env.RESEND_REPLY_TO_EMAIL,
    to,
    subject: `${replierDisplayName} replied to your comment on "${postTitle}"`,
    html,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
}

export async function sendSubscriptionConfirmationEmail(email: string) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { status: "skipped" as const, message: "Email not configured." }
  }

  try {
    const { error } = await getResend().emails.send({
      from: env.RESEND_FROM_EMAIL,
      replyTo: env.RESEND_REPLY_TO_EMAIL,
      to: email,
      subject: "You're subscribed!",
      html: `<p>Thanks for subscribing. You'll receive new posts straight to your inbox.</p>`,
    })
    if (error) return { status: "error" as const, message: error.message }
    return { status: "sent" as const }
  } catch {
    return { status: "error" as const, message: "Failed to send confirmation email." }
  }
}

export async function sendReplyNotification({
  db,
  parentCommentId,
  replyingUserId,
  replierDisplayName,
  postId,
  postUrl,
  replyContent,
}: {
  db: Db
  parentCommentId: string
  replyingUserId: string
  replierDisplayName: string
  postId: string
  postUrl: string
  replyContent: string
}) {
  try {
    const parentComment = await db
      .collection<Comment>("comments")
      .findOne({ _id: new ObjectId(parentCommentId) })
    if (!parentComment) return

    // Don't notify if replying to yourself
    if (parentComment.userId === replyingUserId) return

    // Get parent comment author's email from Clerk
    const { clerkClient } = await import("@clerk/nextjs/server")
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(parentComment.userId)
    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) return

    // Get post title for the email subject
    const post = await db.collection<Post>("posts").findOne({ slug: postId })
    const postTitle = post?.title ?? postId

    await sendCommentNotificationEmail({
      to: email,
      replierDisplayName,
      postTitle,
      postUrl,
      replyContent,
      originalContent: parentComment.content,
      commentId: parentCommentId,
    })
  } catch {
    // Fire-and-forget: swallow errors so the comment POST doesn't fail
  }
}
