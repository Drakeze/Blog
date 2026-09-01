import { MongoClient, type IndexSpecification, type CreateIndexesOptions } from "mongodb"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set")

/**
 * Create the indexes the app assumes but never declared. Safe to re-run.
 * Unique indexes are the race-safety guarantee behind the like / subscribe
 * upserts — MongoDB upsert without one can double-insert under concurrency.
 */
async function ensureIndexes() {
  const client = new MongoClient(DATABASE_URL!)
  await client.connect()
  const db = client.db()

  // Backfill missing unsubscribe tokens before the unique index would trip on
  // multiple nulls / before newsletters go out with dead links.
  const missingToken = db.collection("subscribers").find({
    $or: [{ unsubscribeToken: { $exists: false } }, { unsubscribeToken: null }],
  })
  let backfilled = 0
  for await (const sub of missingToken) {
    await db
      .collection("subscribers")
      .updateOne({ _id: sub._id }, { $set: { unsubscribeToken: crypto.randomUUID() } })
    backfilled++
  }
  if (backfilled) console.log(`✓ Backfilled unsubscribeToken on ${backfilled} subscriber(s)`)

  const specs: Array<[string, IndexSpecification, CreateIndexesOptions]> = [
    ["subscribers", { email: 1 }, { unique: true }],
    ["subscribers", { unsubscribeToken: 1 }, { unique: true }],
    ["likes", { fingerprint: 1, postSlug: 1 }, { unique: true }],
    ["likes", { createdAt: -1 }, {}],
    ["posts", { slug: 1 }, { unique: true }],
    ["comments", { postId: 1, createdAt: -1 }, {}],
    ["comments", { parentId: 1 }, {}],
    ["bookmarks", { userId: 1, postSlug: 1 }, { unique: true }],
  ]

  for (const [collection, keys, options] of specs) {
    try {
      const name = await db.collection(collection).createIndex(keys, options)
      console.log(`✓ ${collection}: ${name}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`✗ ${collection} ${JSON.stringify(keys)}: ${msg}`)
      if (msg.includes("E11000") || msg.toLowerCase().includes("duplicate")) {
        console.error(`  → dedupe ${collection} on ${JSON.stringify(keys)} first, then re-run`)
      }
    }
  }

  await client.close()
}

ensureIndexes().catch((err) => {
  console.error("ensure-indexes failed:", err)
  process.exit(1)
})
