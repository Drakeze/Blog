import { Resend } from "resend"
import { env } from "./env"

const resend = new Resend(env.RESEND_API_KEY)

export async function sendNewsletterEmail({
  to,
  subject,
  postTitle,
  postExcerpt,
  postUrl,
  unsubscribeUrl,
}: {
  to: string
  subject: string
  postTitle: string
  postExcerpt: string
  postUrl: string
  unsubscribeUrl: string
}) {
  return resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    replyTo: env.RESEND_REPLY_TO_EMAIL,
    to,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;color:#0a0a0a;background:#fff;margin:0;padding:0">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <h1 style="font-size:24px;font-weight:700;margin:0 0 8px">${postTitle}</h1>
    <p style="color:#737373;font-size:16px;line-height:1.6;margin:0 0 24px">${postExcerpt}</p>
    <a href="${postUrl}" style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:14px">Read the post →</a>
    <hr style="border:none;border-top:1px solid #e5e5e5;margin:40px 0 24px">
    <p style="color:#a3a3a3;font-size:12px;margin:0">
      You're receiving this because you subscribed to the blog newsletter.
      <a href="${unsubscribeUrl}" style="color:#a3a3a3">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`,
  })
}
