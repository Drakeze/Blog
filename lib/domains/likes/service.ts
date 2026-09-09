import { Errors } from '@/lib/errors';
import { blogCollectionNames, getDb } from '@/lib/mongo';

import type { Like, LikeInput } from './types';

/**
 * Anonymous, fingerprint-scoped like. Race-safe via the unique
 * `{ fingerprint, postSlug }` index behind the upsert.
 *
 * ponytail: the count is still inflatable by rotating the client fingerprint —
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
