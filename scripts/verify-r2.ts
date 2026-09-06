import {
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"

// Exercises the exact R2 client config used by app/api/upload/route.ts against
// whatever R2 credentials the current env resolves to. Run when uploads fail
// with SignatureDoesNotMatch to tell "bad credentials" from "bad request".
//   bun run scripts/verify-r2.ts

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? ""
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? ""
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? ""
const bucket = process.env.R2_BUCKET_NAME ?? ""

if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
  console.error("Missing R2 env vars (CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME)")
  process.exit(1)
}

console.log(`account  ${accountId}`)
console.log(`key id   ${accessKeyId}`)
console.log(`bucket   ${bucket}\n`)

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
  requestChecksumCalculation: "WHEN_REQUIRED",
})

const key = `_verify-${Date.now()}.txt`

try {
  await client.send(new HeadBucketCommand({ Bucket: bucket }))
  console.log("✅ HeadBucket — credentials accepted")

  await client.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: Buffer.from("ok"), ContentType: "text/plain" }),
  )
  console.log("✅ PutObject — upload path works")

  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  console.log("✅ DeleteObject — cleaned up test object\n")
  console.log("R2 credentials are live.")
} catch (err) {
  const e = err as { name?: string; $metadata?: { httpStatusCode?: number }; message?: string }
  console.error(`\n❌ ${e.name ?? "Error"} (HTTP ${e.$metadata?.httpStatusCode ?? "?"}): ${e.message ?? err}`)
  console.error("\nSignatureDoesNotMatch / 403 here means this key pair is wrong or revoked.")
  process.exit(1)
}
