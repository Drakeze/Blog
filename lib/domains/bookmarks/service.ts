import { blogCollectionNames, getDb } from '@/lib/mongo';

import type { Bookmark, BookmarkInput } from './types';

function bookmarksCol() {
  return getDb().then((db) => db.collection<Bookmark>(blogCollectionNames.bookmarks));
}

export async function listByUser(userId: string): Promise<Bookmark[]> {
  const col = await bookmarksCol();
  return col.find({ userId }).sort({ createdAt: -1 }).toArray();
}

/** Idempotent on the unique `{ userId, postSlug }` index. */
export async function add(userId: string, input: BookmarkInput): Promise<Bookmark> {
  const col = await bookmarksCol();

  const existing = await col.findOne({ userId, postSlug: input.postSlug });
  if (existing) return existing;

  const doc: Bookmark = {
    userId,
    postSlug: input.postSlug,
    postTitle: input.postTitle,
    postExcerpt: input.postExcerpt,
    postCoverImage: input.postCoverImage,
    createdAt: new Date(),
  };

  try {
    const res = await col.insertOne(doc);
    return { ...doc, _id: res.insertedId };
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
      const row = await col.findOne({ userId, postSlug: input.postSlug });
      if (row) return row;
    }
    throw err;
  }
}

export async function remove(userId: string, postSlug: string): Promise<void> {
  const col = await bookmarksCol();
  await col.deleteOne({ userId, postSlug });
}
