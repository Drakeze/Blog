import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3"
import { MongoClient } from "mongodb"

// Presence + live-validity check for every env var the app needs. Run against
// whatever env is loaded (`.env.local` locally; paste prod values to check
// Vercel). Catches the drift that took prod auth + uploads down in Sept 2026.
//   bun run verify-env
// See docs/ENV.md for what each var is and where it must be set.

const REQUIRED = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_ADMIN_EMAILS",
  "CLOUDFLARE_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "NEXT_PUBLIC_R2_PUBLIC_URL",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "DRAFT_API_SECRET",
  "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN",
  "NEXT_PUBLIC_POSTHOG_HOST",
] as const

let failed = false
const note = (ok: boolean, label: string, detail = "") => {
  if (!ok) failed = true
  console.log(`${ok ? "✅" : "❌"} ${label}${detail ? `  ${detail}` : ""}`)
}

// --- presence ---------------------------------------------------------------
console.log("── presence ──")
for (const key of REQUIRED) {
  const v = process.env[key]
  note(Boolean(v && v.trim()), key, v ? "" : "missing/empty")
  if (v && v !== v.trim()) note(false, `${key} has leading/trailing whitespace`)
}

// --- Clerk -----------------------------------------------------------------
console.log("\n── Clerk ──")
function clerkHost(key: string | undefined) {
  // pk_live_<base64("<frontend-api-host>$")> / sk keys aren't decodable, only pk
  const b64 = key?.replace(/^pk_(live|test)_/, "")
  if (!b64) return "?"
  try {
    return Buffer.from(b64, "base64").toString("utf8").replace(/\$$/, "")
  } catch {
    return "?"
  }
}
console.log(`   publishable host: ${clerkHost(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)}`)
try {
  const res = await fetch("https://api.clerk.com/v1/users?limit=1", {
    headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY ?? ""}` },
  })
  note(res.ok, `CLERK_SECRET_KEY (api.clerk.com → ${res.status})`,
    res.ok ? "" : "invalid — this is the 'secret-key-invalid' handshake failure")
} catch (err) {
  note(false, "CLERK_SECRET_KEY", `request failed: ${(err as Error).message}`)
}

// --- R2 ------------------------------------------------------------------
console.log("\n── Cloudflare R2 ──")
try {
  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
  })
  await r2.send(new HeadBucketCommand({ Bucket: process.env.R2_BUCKET_NAME ?? "" }))
  note(true, `R2 credentials (bucket ${process.env.R2_BUCKET_NAME})`)
} catch (err) {
  const e = err as { name?: string; $metadata?: { httpStatusCode?: number } }
  note(false, "R2 credentials", `${e.name} (HTTP ${e.$metadata?.httpStatusCode ?? "?"}) — wrong/revoked key pair`)
}

// --- Mongo ----------------------------------------------------------------
console.log("\n── MongoDB ──")
try {
  const client = new MongoClient(process.env.DATABASE_URL ?? "", { serverSelectionTimeoutMS: 10_000 })
  await client.connect()
  await client.db().command({ ping: 1 })
  await client.close()
  note(true, "DATABASE_URL (ping ok)")
} catch (err) {
  note(false, "DATABASE_URL", (err as Error).message)
}

console.log(failed ? "\nFAILED — see ❌ above.\n" : "\nAll checks passed.\n")
process.exit(failed ? 1 : 0)
