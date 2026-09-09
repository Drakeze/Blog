import { currentUser } from '@clerk/nextjs/server';

import { apiError, apiOk } from '@/lib/api';
import { requireUserId } from '@/lib/auth';
import { create, listByPost } from '@/lib/domains/comments/service';
import { createCommentSchema, listCommentsQuerySchema } from '@/lib/domains/comments/validators';
import { sendReplyNotification } from '@/lib/email/notifications';
import { Errors } from '@/lib/errors';
import { captureServerEvent } from '@/lib/posthog-server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { postId } = listCommentsQuerySchema.parse(Object.fromEntries(searchParams));
    return apiOk(await listByPost(postId));
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const user = await currentUser();
    if (!user) throw Errors.unauthorized();

    const { postId, content, parentId } = createCommentSchema.parse(await req.json());

    const comment = await create({
      postId,
      userId,
      userDisplayName: user.fullName ?? user.username ?? 'Anonymous',
      userImageUrl: user.imageUrl,
      content,
      parentId,
    });

    captureServerEvent({
      distinctId: userId,
      event: 'server_comment_posted',
      properties: { post_id: postId, is_reply: !!parentId, content_length: comment.content.length },
    });

    if (parentId) {
      void sendReplyNotification({
        parentCommentId: parentId,
        replyingUserId: userId,
        replierDisplayName: comment.userDisplayName,
        postId,
        replyContent: comment.content,
      });
    }

    return apiOk(comment, 201);
  } catch (err) {
    return apiError(err);
  }
}
