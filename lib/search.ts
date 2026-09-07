import { getDb } from './mongo';

export interface SearchHit {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  publishedAt?: Date;
  score: number;
  /** Atlas Search highlight fragments — `[{ path, texts: [{ value, type }] }]`. */
  highlights: unknown[];
}

/**
 * Full-text search over published posts via the `posts_search` Atlas Search
 * index (see `atlas/posts_search.json`). Fuzzy (`maxEdits: 1`) so typos still
 * land. `status` is filtered post-`$search` with a plain `$match` — the archive
 * is small enough that it doesn't hurt relevance.
 */
export async function searchPosts(q: string, limit = 20): Promise<SearchHit[]> {
  const query = q.trim();
  if (!query) return [];

  const db = await getDb();
  return db
    .collection('posts')
    .aggregate<SearchHit>([
      {
        $search: {
          index: 'posts_search',
          text: {
            query,
            path: ['title', 'excerpt', 'content', 'tags'],
            fuzzy: { maxEdits: 1, prefixLength: 1 },
          },
          highlight: { path: ['title', 'excerpt', 'content'] },
        },
      },
      { $match: { status: 'published' } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          slug: 1,
          title: 1,
          excerpt: 1,
          coverImage: 1,
          tags: 1,
          publishedAt: 1,
          score: { $meta: 'searchScore' },
          highlights: { $meta: 'searchHighlights' },
        },
      },
    ])
    .toArray();
}
