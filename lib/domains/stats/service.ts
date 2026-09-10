import { blogCollectionNames, getDb } from '@/lib/mongo';
import type { PostSummary } from '@/models/post';

const C = blogCollectionNames;

export interface DayCount {
  /** `YYYY-MM-DD` (UTC). */
  day: string;
  count: number;
}

export interface AdminOverview {
  posts: { published: number; drafts: number };
  subscribers: { confirmed: number; pending: number };
  engagement: { likes: number; comments: number; likesLast7: number; likesLast30: number };
  /** Newest first, content stripped. */
  recentPosts: PostSummary[];
  /** Subscriber sign-ups per day for the last 30 days, oldest first, gap-filled with zeros. */
  subscriberGrowth: DayCount[];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Aggregate a `createdAt` collection into per-UTC-day counts since `since`, gap-filled to `days` buckets. */
async function dailyCounts(
  collection: string,
  since: Date,
  days: number,
  match: Record<string, unknown> = {}
): Promise<DayCount[]> {
  const db = await getDb();
  const rows = await db
    .collection(collection)
    .aggregate<{ _id: string; count: number }>([
      { $match: { ...match, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' } },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const byDay = new Map(rows.map((r) => [r._id, r.count]));
  const out: DayCount[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = daysAgo(i).toISOString().slice(0, 10);
    out.push({ day, count: byDay.get(day) ?? 0 });
  }
  return out;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const db = await getDb();
  const posts = db.collection(C.posts);
  const subs = db.collection(C.subscribers);
  const likes = db.collection(C.likes);
  const comments = db.collection(C.comments);

  const [
    published,
    drafts,
    confirmed,
    pending,
    likeTotal,
    commentTotal,
    likesLast7,
    likesLast30,
    recentPosts,
    subscriberGrowth,
  ] = await Promise.all([
    posts.countDocuments({ status: 'published' }),
    posts.countDocuments({ status: 'draft' }),
    subs.countDocuments({ confirmed: true }),
    subs.countDocuments({ confirmed: false }),
    likes.estimatedDocumentCount(),
    comments.estimatedDocumentCount(),
    likes.countDocuments({ createdAt: { $gte: daysAgo(7) } }),
    likes.countDocuments({ createdAt: { $gte: daysAgo(30) } }),
    posts
      .find({}, { projection: { content: 0 } })
      .sort({ updatedAt: -1 })
      .limit(6)
      .toArray(),
    dailyCounts(C.subscribers, daysAgo(29), 30),
  ]);

  return {
    posts: { published, drafts },
    subscribers: { confirmed, pending },
    engagement: { likes: likeTotal, comments: commentTotal, likesLast7, likesLast30 },
    recentPosts: recentPosts as unknown as PostSummary[],
    subscriberGrowth,
  };
}
