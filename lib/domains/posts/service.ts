import { Errors } from '@/lib/errors';
import { blogCollectionNames, getDb } from '@/lib/mongo';
import { slugify } from '@/lib/utils';

import { nextSlug } from './slug';
import type {
  ListPostsParams,
  ListPostsResult,
  Post,
  PostInput,
  PostSummary,
  PostUpdateInput,
} from './types';

const C = blogCollectionNames;

function postsCol() {
  return getDb().then((db) => db.collection<Post>(C.posts));
}

export async function listPosts(params: ListPostsParams = {}): Promise<ListPostsResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;

  const filter: Record<string, string> = {};
  if (params.status && params.status !== 'all') filter.status = params.status;
  if (params.tag) filter.tags = params.tag;

  const col = await postsCol();
  const [posts, total] = await Promise.all([
    col
      .find(filter, { projection: { content: 0 } })
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    col.countDocuments(filter),
  ]);

  return { posts: posts as ListPostsResult['posts'], total, page, limit };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const col = await postsCol();
  return col.findOne({ slug });
}

/** Distinct tags across published posts, most-used first — for the homepage tag bar. */
export async function listPublishedTags(): Promise<string[]> {
  const col = await postsCol();
  const rows = await col
    .aggregate<{ _id: string; n: number }>([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', n: { $sum: 1 } } },
      { $sort: { n: -1, _id: 1 } },
    ])
    .toArray();
  return rows.map((r) => r._id);
}

/**
 * Resolve a URL slug to its post, following `slugHistory`. `redirect: true`
 * means the request hit a former slug and should 301 to `post.slug`.
 */
export async function resolveSlug(slug: string): Promise<{ post: Post; redirect: boolean } | null> {
  const col = await postsCol();
  const direct = await col.findOne({ slug });
  if (direct) return { post: direct, redirect: false };

  const historical = await col.findOne({ slugHistory: slug });
  if (historical) return { post: historical, redirect: true };

  return null;
}

/** Up to `limit` published posts sharing the most tags with `slug`, for "Read next". */
export async function getRelatedPosts(
  slug: string,
  tags: string[],
  limit = 3
): Promise<PostSummary[]> {
  if (tags.length === 0) return [];
  const col = await postsCol();
  return col
    .aggregate<PostSummary>([
      { $match: { slug: { $ne: slug }, status: 'published', tags: { $in: tags } } },
      { $addFields: { shared: { $size: { $setIntersection: ['$tags', tags] } } } },
      { $sort: { shared: -1, publishedAt: -1 } },
      { $limit: limit },
      { $project: { content: 0, shared: 0 } },
    ])
    .toArray();
}

export async function createPost(input: PostInput): Promise<Post> {
  const col = await postsCol();
  const slug = slugify(input.slug ?? input.title);
  if (!slug) throw Errors.badRequest('Could not derive a slug from the title');

  if (await col.findOne({ $or: [{ slug }, { slugHistory: slug }] })) {
    throw Errors.conflict('A post with this slug already exists');
  }

  const now = new Date();
  const status = input.status ?? 'draft';
  const doc: Post = {
    title: input.title,
    slug,
    slugHistory: [],
    content: input.content,
    excerpt: input.excerpt,
    coverImage: input.coverImage,
    tags: input.tags ?? [],
    status,
    authorId: input.authorId,
    authorName: input.authorName,
    authorImageUrl: input.authorImageUrl,
    publishedAt: status === 'published' ? now : undefined,
    createdAt: now,
    updatedAt: now,
  };

  const res = await col.insertOne(doc);
  return { ...doc, _id: res.insertedId };
}

const UPDATABLE = [
  'title',
  'content',
  'excerpt',
  'coverImage',
  'tags',
  'authorName',
  'authorImageUrl',
] as const;

export async function updatePost(slug: string, input: PostUpdateInput): Promise<Post | null> {
  const col = await postsCol();
  const existing = await col.findOne({ slug });
  if (!existing) return null;

  const now = new Date();
  const set: Record<string, unknown> = { updatedAt: now };

  for (const key of UPDATABLE) {
    if (input[key] !== undefined) set[key] = input[key];
  }

  if (input.status && input.status !== existing.status) {
    set.status = input.status;
    if (input.status === 'published' && !existing.publishedAt) set.publishedAt = now;
  }

  const slugChange = nextSlug(existing.slug, input.slug, existing.slugHistory ?? []);
  if (slugChange) {
    if (await col.findOne({ slug: slugChange.slug })) {
      throw Errors.conflict('A post with this slug already exists');
    }
    set.slug = slugChange.slug;
    set.slugHistory = slugChange.slugHistory;
  }

  return col.findOneAndUpdate({ slug }, { $set: set }, { returnDocument: 'after' });
}

export async function deletePost(slug: string): Promise<boolean> {
  const db = await getDb();
  const removed = await db.collection<Post>(C.posts).findOneAndDelete({ slug });
  if (!removed) return false;

  // Cascade — comments/likes/bookmarks all key off the slug.
  await Promise.all([
    db.collection(C.comments).deleteMany({ postId: slug }),
    db.collection(C.likes).deleteMany({ postSlug: slug }),
    db.collection(C.bookmarks).deleteMany({ postSlug: slug }),
  ]);

  return true;
}

export async function countPosts(filter: Record<string, unknown> = {}): Promise<number> {
  const col = await postsCol();
  return col.countDocuments(filter);
}

/**
 * Atomically reserve the newsletter-send slot. Returns `false` if the post was
 * already sent (or reserved by a racing request) — the caller 409s. This is the
 * real double-send guard; a plain `post.newsletterSentAt` read is only a fast path.
 *
 * ponytail: on a failed send the slot stays claimed — the admin re-sends with
 * `force` after checking `EmailLog`. Auto-releasing it would risk double
 * delivery when a batch send failed partway.
 */
export async function claimNewsletterSend(slug: string): Promise<boolean> {
  const col = await postsCol();
  const prev = await col.findOneAndUpdate(
    { slug, newsletterSentAt: { $exists: false } },
    { $set: { newsletterSentAt: new Date() } }
  );
  return prev !== null;
}
