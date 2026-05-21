import { currentUser } from "@clerk/nextjs/server"
import { mkdir, writeFile } from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 })

  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  await mkdir(uploadsDir, { recursive: true })

  const ext = path.extname(file.name).toLowerCase()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
