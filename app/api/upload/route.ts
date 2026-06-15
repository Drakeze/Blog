import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { isAdmin } from "@/lib/auth"
import { storageConfig } from "@/lib/env"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${storageConfig.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: storageConfig.accessKeyId,
      secretAccessKey: storageConfig.secretAccessKey,
    },
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

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 })

  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const ext = path.extname(file.name).toLowerCase()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  const client = getR2Client()
  await client.send(
    new PutObjectCommand({
      Bucket: storageConfig.bucketName,
      Key: filename,
      Body: Buffer.from(bytes),
      ContentType: file.type,
    }),
  )

  return NextResponse.json({ url: `${storageConfig.publicUrl}/${filename}` })
}
