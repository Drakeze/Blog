import { type CreateIndexesOptions, type IndexSpecification, MongoClient } from 'mongodb';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const dbName = DATABASE_URL.match(/\/([^/?]+)(\?|$)/)?.[1] ?? '(default)';

/**
 * Create the indexes the app assumes. Safe to re-run. Unique indexes are the
 * race-safety guarantee behind the like / subscribe upserts - a MongoDB upsert
 * without one can double-insert under concurrency.
 */
async function ensureIndexes() {
  console.log(`Target database: ${dbName}\n`);
  const client = new MongoClient(DATABASE_URL!);
  await client.connect();
  const db = client.db();

  // Backfill missing unsubscribe tokens before the unique index trips on
  // multiple nulls / before a newsletter goes out with dead links.
  let backfilled = 0;
  const missing = db
    .collection('subscribers')
    .find({ $or: [{ unsubscribeToken: { $exists: false } }, { unsubscribeToken: null }] });
  for await (const sub of missing) {
    await db
      .collection('subscribers')
      .updateOne({ _id: sub._id }, { $set: { unsubscribeToken: crypto.randomUUID() } });
    backfilled++;
  }
  if (backfilled) console.log(`✓ Backfilled unsubscribeToken on ${backfilled} subscriber(s)`);

  const specs: Array<[string, IndexSpecification, CreateIndexesOptions]> = [
    ['posts', { slug: 1 }, { unique: true }],
    ['posts', { slugHistory: 1 }, {}],
    ['posts', { status: 1, publishedAt: -1 }, {}],
    ['posts', { tags: 1 }, {}],
    ['subscribers', { email: 1 }, { unique: true }],
    ['subscribers', { confirmToken: 1 }, { sparse: true }],
    ['subscribers', { unsubscribeToken: 1 }, { unique: true }],
    // Newsletter send scans { confirmed: true } - Review A flagged it unindexed.
    [
      'subscribers',
      { confirmed: 1 },
      { partialFilterExpression: { confirmed: true } },
    ],
    ['likes', { fingerprint: 1, postSlug: 1 }, { unique: true }],
    ['likes', { createdAt: -1 }, {}],
    ['comments', { postId: 1, createdAt: -1 }, {}],
    ['comments', { parentId: 1 }, {}],
    ['bookmarks', { userId: 1, postSlug: 1 }, { unique: true }],
    ['email_logs', { createdAt: -1 }, {}],
    ['mcp_action_logs', { createdAt: -1 }, {}],
  ];

  for (const [collection, keys, options] of specs) {
    try {
      const name = await db.collection(collection).createIndex(keys, options);
      console.log(`✓ ${collection}: ${name}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`✗ ${collection} ${JSON.stringify(keys)}: ${msg}`);
      if (msg.includes('E11000') || msg.toLowerCase().includes('duplicate')) {
        console.error(`  → dedupe ${collection} on ${JSON.stringify(keys)} first, then re-run`);
      }
    }
  }

  await client.close();
}

ensureIndexes().catch((err) => {
  console.error('ensure-indexes failed:', err);
  process.exit(1);
});
