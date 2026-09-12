import { MongoClient } from 'mongodb';

// Strip em dashes (—) from post title/excerpt/content, replacing with a plain
// hyphen. Idempotent. Dry-run by default:
//   bun run scripts/strip-em-dashes.ts           # report only
//   bun run scripts/strip-em-dashes.ts --apply   # write

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const APPLY = process.argv.includes('--apply');
const dbName = DATABASE_URL.match(/\/([^/?]+)(\?|$)/)?.[1] ?? '(default)';
const FIELDS = ['title', 'excerpt', 'content'] as const;

async function main() {
  console.log(`Target: ${dbName}   mode: ${APPLY ? 'APPLY' : 'dry-run'}\n`);
  const client = new MongoClient(DATABASE_URL!);
  await client.connect();
  const db = client.db();

  const matches = await db
    .collection('posts')
    .find({ $or: FIELDS.map((f) => ({ [f]: { $regex: '—' } })) })
    .project({ title: 1, slug: 1, ...Object.fromEntries(FIELDS.map((f) => [f, 1])) })
    .toArray();

  console.log(`posts containing an em dash: ${matches.length}`);
  for (const post of matches) {
    const hitFields = FIELDS.filter((f) => typeof post[f] === 'string' && post[f].includes('—'));
    console.log(`  ${post.slug} — fields: ${hitFields.join(', ')}`);

    if (APPLY) {
      const update: Record<string, string> = {};
      for (const f of hitFields) update[f] = (post[f] as string).replaceAll('—', '-');
      await db.collection('posts').updateOne({ _id: post._id }, { $set: update });
    }
  }

  await client.close();
  console.log(APPLY ? '\nDone.' : '\nDry run — re-run with --apply to write.');
}

main().catch((err) => {
  console.error('strip-em-dashes failed:', err);
  process.exit(1);
});
