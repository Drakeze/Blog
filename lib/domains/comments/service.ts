import { ObjectId } from 'mongodb';

import { Errors } from '@/lib/errors';
import { blogCollectionNames, getDb } from '@/lib/mongo';

import type { Comment, CreateCommentInput } from './types';

function commentsCol() {
  return getDb().then((db) => db.collection<Comment>(blogCollectionNames.comments));
}

export async function listByPost(postId: string): Promise<Comment[]> {
  const col = await commentsCol();
  return col.find({ postId }).sort({ createdAt: 1 }).toArray();
}

export async function create(input: CreateCommentInput): Promise<Comment> {
  const col = await commentsCol();
  const now = new Date();
  const doc: Comment = {
    postId: input.postId,
    userId: input.userId,
    userDisplayName: input.userDisplayName,
    userImageUrl: input.userImageUrl,
    content: input.content.trim(),
    parentId: input.parentId ?? undefined,
    createdAt: now,
    updatedAt: now,
  };
  const res = await col.insertOne(doc);
  return { ...doc, _id: res.insertedId };
}

/** Owner-or-admin only. Cascades to replies. Throws `AppError` on bad id / missing / forbidden. */
export async function remove(
  id: string,
  actor: { userId: string; isAdmin: boolean }
): Promise<void> {
  if (!ObjectId.isValid(id)) throw Errors.badRequest('Invalid comment id');
  const col = await commentsCol();

  const comment = await col.findOne({ _id: new ObjectId(id) });
  if (!comment) throw Errors.notFound('Comment not found');
  if (comment.userId !== actor.userId && !actor.isAdmin) throw Errors.forbidden();

  await col.deleteOne({ _id: new ObjectId(id) });
  await col.deleteMany({ parentId: id });
}
