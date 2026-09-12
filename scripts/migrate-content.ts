import { MongoClient } from 'mongodb';

// Backfill the fields the rebuilt schema adds, on whatever DATABASE_URL points
// at. Idempotent. Dry-run by default:
//   bun run scripts/migrate-content.ts           # report only
//   bun run scripts/migrate-content.ts --apply   # write

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const APPLY = process.argv.includes('--apply');
const dbName = DATABASE_URL.match(/\/([^/?]+)(\?|$)/)?.[1] ?? '(default)';

async function main() {
  console.log(`Target: ${dbName}   mode: ${APPLY ? 'APPLY' : 'dry-run'}\n`);
  const client = new MongoClient(DATABASE_URL!);
  await client.connect();
  const db = client.db();

  // posts: slugHistory must be an array
  const postsNeedingHistory = await db
    .collection('posts')
    .countDocuments({ slugHistory: { $exists: false } });
  console.log(`posts without slugHistory: ${postsNeedingHistory}`);
  if (APPLY && postsNeedingHistory) {
    const r = await db
      .collection('posts')
      .updateMany({ slugHistory: { $exists: false } }, { $set: { slugHistory: [] } });
    console.log(`  → set slugHistory: [] on ${r.modifiedCount}`);
  }

  // subscribers: confirmed must be boolean; backfill confirmedAt for legacy confirmed rows
  const subsNoConfirmed = await db
    .collection('subscribers')
    .countDocuments({ confirmed: { $exists: false } });
  console.log(`subscribers without confirmed: ${subsNoConfirmed}`);
  if (APPLY && subsNoConfirmed) {
    const r = await db
      .collection('subscribers')
      .updateMany({ confirmed: { $exists: false } }, { $set: { confirmed: false } });
    console.log(`  → set confirmed: false on ${r.modifiedCount}`);
  }

  const confirmedNoDate = await db
    .collection('subscribers')
    .find({ confirmed: true, confirmedAt: { $exists: false } })
    .toArray();
  console.log(`confirmed subscribers without confirmedAt: ${confirmedNoDate.length}`);
  if (APPLY) {
    for (const s of confirmedNoDate) {
      await db
        .collection('subscribers')
        .updateOne({ _id: s._id }, { $set: { confirmedAt: s.createdAt ?? new Date() } });
    }
    if (confirmedNoDate.length)
      console.log(`  → backfilled confirmedAt on ${confirmedNoDate.length}`);
  }

  await client.close();
  console.log(APPLY ? '\nDone.' : '\nDry run - re-run with --apply to write.');
}

main().catch((err) => {
  console.error('migrate-content failed:', err);
  process.exit(1);
});
