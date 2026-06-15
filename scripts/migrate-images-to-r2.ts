import { MongoClient, ObjectId } from "mongodb"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import path from "path"

const MONGODB_URI = process.env.DATABASE_URL!
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID!
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY!
const BUCKET = process.env.R2_BUCKET_NAME!
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
})

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; blog-migration/1.0)" },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)

  const contentType = res.headers.get("content-type") ?? "image/jpeg"
  const buffer = Buffer.from(await res.arrayBuffer())

  const extMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
  }
  const baseType = contentType.split(";")[0].trim()
  const ext = extMap[baseType] ?? path.extname(new URL(url).pathname) ?? ".jpg"

  return { buffer, contentType: baseType, ext }
}

async function uploadToR2(buffer: Buffer, contentType: string, ext: string): Promise<string> {
  const key = `migrated-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))
  return `${PUBLIC_URL}/${key}`
}

async function main() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db("blog_db")
  const posts = db.collection("posts")

  const all = await posts.find({ coverImage: { $exists: true, $ne: null, $ne: "" } }).toArray()
  console.log(`Found ${all.length} posts with cover images\n`)

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const post of all) {
    const url: string = post.coverImage
    const title: string = post.title ?? post.slug ?? String(post._id)

    if (url.startsWith(PUBLIC_URL)) {
      console.log(`⏭  Already R2: "${title}"`)
      skipped++
      continue
    }

    process.stdout.write(`⬇  Downloading: "${title}" ... `)
    try {
      const { buffer, contentType, ext } = await downloadImage(url)
      process.stdout.write(`${buffer.length} bytes  `)

      const newUrl = await uploadToR2(buffer, contentType, ext)
      await posts.updateOne({ _id: post._id as ObjectId }, { $set: { coverImage: newUrl, updatedAt: new Date() } })

      console.log(`✅`)
      console.log(`   old: ${url}`)
      console.log(`   new: ${newUrl}\n`)
      migrated++
    } catch (err) {
      console.log(`❌ FAILED`)
      console.log(`   ${(err as Error).message}\n`)
      failed++
    }
  }

  await client.close()

  console.log("─".repeat(50))
  console.log(`Migrated: ${migrated}  |  Skipped: ${skipped}  |  Failed: ${failed}`)
}

main()
