import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { MongoClient } from 'mongodb';

// Presence + live-validity check for every env var the app needs. Run against
// whatever env is loaded (`.env` locally; paste prod values to check Vercel).
//   bun run verify-env
// See docs/ENV.md for what each var is and where it must be set.

const REQUIRED = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'CLERK_ADMIN_EMAILS',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
] as const;

// Not yet wired - warn, don't fail, while these are still being provisioned.
const OPTIONAL = [
  'CLOUDFLARE_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'NEXT_PUBLIC_R2_PUBLIC_URL',
  'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN',
  'NEXT_PUBLIC_POSTHOG_HOST',
  'EMAIL_DELIVERY_MODE',
  'DRAFT_API_SECRET',
  'MCP_SERVICE_SECRET',
] as const;

let failed = false;
const ok = (label: string, detail = '') => console.log(`✅ ${label}${detail ? `  ${detail}` : ''}`);
const bad = (label: string, detail = '') => {
  failed = true;
  console.log(`❌ ${label}${detail ? `  ${detail}` : ''}`);
};
const warn = (label: string, detail = '') =>
  console.log(`⚠️  ${label}${detail ? `  ${detail}` : ''}`);

console.log('── presence (required) ──');
for (const key of REQUIRED) {
  const v = process.env[key];
  if (v && v.trim()) ok(key);
  else bad(key, 'missing/empty');
  if (v && v !== v.trim()) bad(`${key} has leading/trailing whitespace`);
}

console.log('\n── presence (optional / not yet provisioned) ──');
for (const key of OPTIONAL) {
  const v = process.env[key];
  if (v && v.trim()) ok(key);
  else warn(key, 'not set');
}

// --- DB target ------------------------------------------------------------
const dbName = (process.env.DATABASE_URL ?? '').match(/\/([^/?]+)(\?|$)/)?.[1] ?? '(default)';
console.log(`\n── MongoDB (target database: ${dbName}) ──`);
if (dbName === 'blog_db') warn('target is PRODUCTION (blog_db)', 'expected blog_db_dev for local');
try {
  const client = new MongoClient(process.env.DATABASE_URL ?? '', {
    serverSelectionTimeoutMS: 10_000,
  });
  await client.connect();
  await client.db().command({ ping: 1 });
  await client.close();
  ok('DATABASE_URL (ping ok)');
} catch (err) {
  bad('DATABASE_URL', (err as Error).message);
}

// --- Clerk --------------------------------------------------------------
console.log('\n── Clerk ──');
function clerkHost(key: string | undefined) {
  const b64 = key?.replace(/^pk_(live|test)_/, '');
  if (!b64) return '?';
  try {
    return Buffer.from(b64, 'base64').toString('utf8').replace(/\$$/, '');
  } catch {
    return '?';
  }
}
console.log(`   publishable host: ${clerkHost(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)}`);
try {
  const res = await fetch('https://api.clerk.com/v1/users?limit=1', {
    headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ''}` },
  });
  if (res.ok) ok(`CLERK_SECRET_KEY (api.clerk.com → ${res.status})`);
  else
    bad(
      `CLERK_SECRET_KEY (api.clerk.com → ${res.status})`,
      "invalid - the 'secret-key-invalid' handshake failure"
    );
} catch (err) {
  bad('CLERK_SECRET_KEY', `request failed: ${(err as Error).message}`);
}

// --- Resend -----------------------------------------------------------
console.log('\n── Resend ──');
try {
  const res = await fetch('https://api.resend.com/domains', {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY ?? ''}` },
  });
  if (res.ok) ok(`RESEND_API_KEY (api.resend.com → ${res.status})`);
  else bad(`RESEND_API_KEY (api.resend.com → ${res.status})`, 'invalid or revoked');
} catch (err) {
  bad('RESEND_API_KEY', `request failed: ${(err as Error).message}`);
}

// --- R2 (only if configured) --------------------------------------------
console.log('\n── Cloudflare R2 ──');
if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
  try {
    const r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
    });
    await r2.send(new HeadBucketCommand({ Bucket: process.env.R2_BUCKET_NAME ?? '' }));
    ok(`R2 credentials (bucket ${process.env.R2_BUCKET_NAME})`);
  } catch (err) {
    const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
    bad(
      'R2 credentials',
      `${e.name} (HTTP ${e.$metadata?.httpStatusCode ?? '?'}) - wrong/revoked key pair`
    );
  }
} else {
  warn('R2', 'not configured yet - skipping live check');
}

console.log(failed ? '\nFAILED - see ❌ above.\n' : '\nAll required checks passed.\n');
process.exit(failed ? 1 : 0);
