import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { storageConfig } from "@/lib/env"

// Extension is derived from the validated MIME type, never from file.name —
// a crafted filename would otherwise flow into the stored key and the markdown.
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
}
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${storageConfig.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: storageConfig.accessKeyId,
      secretAccessKey: storageConfig.secretAccessKey,
    },
    // R2 doesn't support the AWS SDK v3 default request checksum trailer —
    // leaving it on makes every PUT fail with SignatureDoesNotMatch.
    requestChecksumCalculation: "WHEN_REQUIRED",
  })
}

export async function POST(req: NextRequest) {
  const admin = await isAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!storageConfig.configured) {
    return NextResponse.json(
      { error: "Image storage not configured. Set R2 environment variables." },
      { status: 503 },
    )
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  const ext = EXT_BY_TYPE[file.type]
  if (!ext)
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 })

  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  try {
    const client = getR2Client()
    await client.send(
      new PutObjectCommand({
        Bucket: storageConfig.bucketName,
        Key: filename,
        Body: Buffer.from(bytes),
        ContentType: file.type,
      }),
    )
  } catch (err) {
    // Most common cause: the R2 key pair in this environment is wrong/revoked
    // (R2 returns 403 SignatureDoesNotMatch). Surface it instead of a bare 500.
    console.error("R2 upload failed", err)
    return NextResponse.json(
      { error: "Upload to storage failed. Check R2 credentials." },
      { status: 502 },
    )
  }

  return NextResponse.json({ url: `${storageConfig.publicUrl}/${filename}` })
}
