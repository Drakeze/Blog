import { Errors } from '@/lib/errors';
import { blogCollectionNames, getDb } from '@/lib/mongo';

import type { Like, LikeInput } from './types';

/**
 * Anonymous, fingerprint-scoped like. Race-safe via the unique
 * `{ fingerprint, postSlug }` index behind the upsert.
 *
 * ponytail: the count is still inflatable by rotating the client fingerprint -
 * IP+UA rate limiting or signed tokens is the fix, not worth the infra yet.
 */
export async function add({ postSlug, fingerprint }: LikeInput): Promise<void> {
  const db = await getDb();

  const post = await db
    .collection(blogCollectionNames.posts)
    .findOne({ slug: postSlug, status: 'published' }, { projection: { _id: 1 } });
  if (!post) throw Errors.notFound('Post not found');

  await db
    .collection<Like>(blogCollectionNames.likes)
    .updateOne(
      { fingerprint, postSlug },
      { $setOnInsert: { fingerprint, postSlug, createdAt: new Date() } },
      { upsert: true }
    );
}

export async function remove({ postSlug, fingerprint }: LikeInput): Promise<void> {
  const db = await getDb();
  await db.collection<Like>(blogCollectionNames.likes).deleteOne({ fingerprint, postSlug });
}

/** Public like count + whether this fingerprint has liked - the post page's initial state. */
export async function getLikeState(
  postSlug: string,
  fingerprint?: string
): Promise<{ count: number; liked: boolean }> {
  const db = await getDb();
  const likes = db.collection<Like>(blogCollectionNames.likes);
  const [count, mine] = await Promise.all([
    likes.countDocuments({ postSlug }),
    fingerprint ? likes.findOne({ postSlug, fingerprint }, { projection: { _id: 1 } }) : null,
  ]);
  return { count, liked: !!mine };
}
