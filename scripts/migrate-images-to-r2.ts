import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MongoClient, type ObjectId } from 'mongodb';
import path from 'path';

// Pull every external image referenced by a post - the `coverImage` and any
// inline `![](url)` in the markdown - into the R2 bucket, and rewrite the doc.
// Idempotent: URLs already on NEXT_PUBLIC_R2_PUBLIC_URL are skipped.
// Dry-run by default:
//   bun run scripts/migrate-images-to-r2.ts            # report only
//   bun run scripts/migrate-images-to-r2.ts --apply    # download + upload + write

const MONGODB_URI = process.env.DATABASE_URL;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

for (const [k, v] of Object.entries({
  DATABASE_URL: MONGODB_URI,
  CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID,
  R2_ACCESS_KEY_ID: ACCESS_KEY,
  R2_SECRET_ACCESS_KEY: SECRET_KEY,
  R2_BUCKET_NAME: BUCKET,
  NEXT_PUBLIC_R2_PUBLIC_URL: PUBLIC_URL,
})) {
  if (!v) throw new Error(`${k} is not set`);
}

const APPLY = process.argv.includes('--apply');

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY!, secretAccessKey: SECRET_KEY! },
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

const EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

async function rehost(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'blog-migration/1.0' } });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  const type = (res.headers.get('content-type') ?? 'image/jpeg').split(';')[0].trim();
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = (EXT[type] ?? path.extname(new URL(url).pathname)) || '.jpg';
  const key = `migrated-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  if (APPLY) {
    await r2.send(
      new PutObjectCommand({ Bucket: BUCKET!, Key: key, Body: buf, ContentType: type })
    );
  }
  return `${PUBLIC_URL}/${key}`;
}

const INLINE_IMG = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;

async function main() {
  console.log(`mode: ${APPLY ? 'APPLY' : 'dry-run'}\n`);
  const client = new MongoClient(MONGODB_URI!);
  await client.connect();
  const posts = client.db().collection('posts');
  const all = await posts.find({}).toArray();

  let touched = 0;
  let images = 0;
  let failed = 0;

  for (const post of all) {
    const title: string = post.title ?? post.slug ?? String(post._id);
    const patch: Record<string, unknown> = {};

    // cover image
    if (post.coverImage && !String(post.coverImage).startsWith(PUBLIC_URL!)) {
      try {
        patch.coverImage = await rehost(post.coverImage);
        images++;
        console.log(`  cover  "${title}"\n    ${post.coverImage}\n → ${patch.coverImage}`);
      } catch (e) {
        failed++;
        console.log(`  ✗ cover "${title}": ${(e as Error).message}`);
      }
    }

    // inline images in the markdown body
    if (typeof post.content === 'string' && post.content.includes('![')) {
      const seen = new Map<string, string>();
      const matches = [...post.content.matchAll(INLINE_IMG)];
      for (const m of matches) {
        const src = m[1];
        if (src.startsWith(PUBLIC_URL!) || seen.has(src)) continue;
        try {
          seen.set(src, await rehost(src));
          images++;
        } catch (e) {
          failed++;
          console.log(`  ✗ inline "${title}": ${(e as Error).message}`);
        }
      }
      if (seen.size) {
        let content = post.content as string;
        for (const [from, to] of seen) content = content.split(from).join(to);
        patch.content = content;
        console.log(`  inline "${title}": ${seen.size} image(s)`);
      }
    }

    if (Object.keys(patch).length) {
      touched++;
      if (APPLY) {
        await posts.updateOne(
          { _id: post._id as ObjectId },
          { $set: { ...patch, updatedAt: new Date() } }
        );
      }
    }
  }

  await client.close();
  console.log(`\nposts touched: ${touched}   images: ${images}   failed: ${failed}`);
  if (!APPLY) console.log('Dry run - re-run with --apply to write.');
}

main().catch((err) => {
  console.error('migrate-images-to-r2 failed:', err);
  process.exit(1);
});
