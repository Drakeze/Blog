import { type Document, MongoClient } from 'mongodb';

import definitionJson from '../atlas/posts_search.json';

const definition = definitionJson as Document;

interface SearchIndexRow {
  name: string;
  queryable?: boolean;
  status?: string;
}

// Create / update the Atlas Search index on `posts` via the driver - no Atlas
// Admin API keys needed, it rides the normal DATABASE_URL connection. Works on
// M0+ Atlas. If your cluster tier has no Atlas Search, this throws a clear
// error; fall back to a Mongo `$text` index on {title, excerpt, content}.
//   bun run ensure-search-index

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const INDEX = 'posts_search';
const dbName = DATABASE_URL.match(/\/([^/?]+)(\?|$)/)?.[1] ?? '(default)';

async function main() {
  console.log(`Target: ${dbName}.posts  index: ${INDEX}\n`);
  const client = new MongoClient(DATABASE_URL!);
  await client.connect();
  const db = client.db();
  await db.createCollection('posts').catch(() => {}); // Atlas needs the collection to exist
  const posts = db.collection('posts');

  const existing = (await posts.listSearchIndexes().toArray()) as SearchIndexRow[];
  const found = existing.find((i) => i.name === INDEX);

  if (!found) {
    await posts.createSearchIndex({ name: INDEX, definition });
    console.log(`✓ created "${INDEX}" - building…`);
  } else {
    await posts.updateSearchIndex(INDEX, definition);
    console.log(`✓ updated "${INDEX}" - rebuilding…`);
  }

  for (let i = 0; i < 60; i++) {
    const rows = (await posts.listSearchIndexes().toArray()) as SearchIndexRow[];
    const idx = rows.find((x) => x.name === INDEX);
    if (idx?.queryable) {
      console.log(`✓ "${INDEX}" is queryable`);
      await client.close();
      return;
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  console.warn(`⚠ "${INDEX}" still not queryable after 5 min - check the Atlas UI`);
  await client.close();
}

main().catch((err) => {
  console.error('ensure-search-index failed:', err);
  console.error('\nIf this cluster has no Atlas Search, use a $text index instead.');
  process.exit(1);
});
