import { render } from '@react-email/components';
import { ObjectId } from 'mongodb';

import { CommentNotificationEmail } from '@/emails/comment-notification';
import { ConfirmSubscriptionEmail } from '@/emails/confirm-subscription';
import { env } from '@/lib/env';
import { blogCollectionNames, getDb } from '@/lib/mongo';
import type { Comment } from '@/models/comment';
import type { Post } from '@/models/post';

import { sendEmail } from './send';

/** Double opt-in step 1's email - the link that makes `confirmed` real. */
export async function sendSubscriptionConfirmation(
  email: string,
  confirmToken: string
): Promise<void> {
  const html = await render(
    ConfirmSubscriptionEmail({
      confirmUrl: `${env.SITE_URL}/confirm?token=${confirmToken}`,
      siteUrl: env.SITE_URL,
    })
  );
  await sendEmail({
    to: email,
    subject: 'Confirm your subscription to Thinking Out Loud',
    html,
    template: 'confirm-subscription',
  });
}

/**
 * Notify a parent commenter that someone replied. Fire-and-forget - every error
 * is swallowed so a failed notification never fails the comment POST.
 */
export async function sendReplyNotification({
  parentCommentId,
  replyingUserId,
  replierDisplayName,
  postId,
  replyContent,
}: {
  parentCommentId: string;
  replyingUserId: string;
  replierDisplayName: string;
  postId: string;
  replyContent: string;
}): Promise<void> {
  try {
    if (!ObjectId.isValid(parentCommentId)) return;
    const db = await getDb();

    const parent = await db
      .collection<Comment>(blogCollectionNames.comments)
      .findOne({ _id: new ObjectId(parentCommentId) });
    if (!parent || parent.userId === replyingUserId) return;

    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(parent.userId);
    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) return;

    const post = await db
      .collection<Post>(blogCollectionNames.posts)
      .findOne({ slug: postId }, { projection: { title: 1 } });
    const postTitle = post?.title ?? postId;

    const html = await render(
      CommentNotificationEmail({
        replierDisplayName,
        postTitle,
        postUrl: `${env.SITE_URL}/${postId}`,
        replyContent,
        originalContent: parent.content,
        commentId: parentCommentId,
      })
    );

    await sendEmail({
      to: email,
      subject: `${replierDisplayName} replied to your comment on "${postTitle}"`,
      html,
      template: 'comment-notification',
      meta: { postSlug: postId },
    });
  } catch {
    // fire-and-forget
  }
}
