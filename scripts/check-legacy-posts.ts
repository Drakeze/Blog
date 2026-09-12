import { MongoClient } from 'mongodb';

// Read-only report on whatever DATABASE_URL points at: post count, every
// title/slug/status, and a status breakdown. Used to verify whether legacy
// posts are actually present before doing any migration work.
//   bun run scripts/check-legacy-posts.ts

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const dbName = DATABASE_URL.match(/\/([^/?]+)(\?|$)/)?.[1] ?? '(default)';

async function main() {
  console.log(`Target: ${dbName}\n`);
  const client = new MongoClient(DATABASE_URL!);
  await client.connect();
  const db = client.db();

  const posts = await db
    .collection('posts')
    .find({})
    .project({ title: 1, slug: 1, status: 1, publishedAt: 1 })
    .sort({ publishedAt: 1 })
    .toArray();

  console.log(`total posts: ${posts.length}\n`);
  for (const p of posts) {
    console.log(`  [${p.status}] ${p.slug} — ${p.title}`);
  }

  const byStatus = posts.reduce<Record<string, number>>((acc, p) => {
    const key = String(p.status);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  console.log('\nstatus breakdown:', byStatus);

  await client.close();
}

main().catch((err) => {
  console.error('check-legacy-posts failed:', err);
  process.exit(1);
});
