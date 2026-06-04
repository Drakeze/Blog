import { Resend } from "resend"
import { render } from "@react-email/components"
import { NewsletterEmail } from "@/emails/newsletter"
import { CommentNotificationEmail } from "@/emails/comment-notification"
import { env } from "./env"
import type { Db } from "mongodb"
import { ObjectId } from "mongodb"
import type { Comment } from "@/models/comment"
import type { Post } from "@/models/post"

const resend = new Resend(env.RESEND_API_KEY)

export async function sendNewsletterEmail({
  to,
  subject,
  postTitle,
  postExcerpt,
  postUrl,
  unsubscribeUrl,
  postImage,
  authorName,
  authorImageUrl,
}: {
  to: string
  subject: string
  postTitle: string
  postExcerpt: string
  postUrl: string
  unsubscribeUrl: string
  postImage?: string
  authorName?: string
  authorImageUrl?: string
}) {
  const html = await render(
    NewsletterEmail({
      postTitle,
      postExcerpt,
      postUrl,
      unsubscribeUrl,
      postImage,
      authorName,
      authorImageUrl,
      siteUrl: env.SITE_URL,
    })
  )

  return resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    replyTo: env.RESEND_REPLY_TO_EMAIL,
    to,
    subject,
    html,
  })
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

  return resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    replyTo: env.RESEND_REPLY_TO_EMAIL,
    to,
    subject: `${replierDisplayName} replied to your comment on "${postTitle}"`,
    html,
  })
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
