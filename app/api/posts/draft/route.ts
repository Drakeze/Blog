import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { env } from "@/lib/env"
import type { Post } from "@/models/post"

function getBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization")
  if (!header?.startsWith("Bearer ")) return null
  return header.slice(7)
}

export async function POST(req: Request) {
  const token = getBearerToken(req)
  if (!env.DRAFT_API_SECRET || token !== env.DRAFT_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { title, slug, content, series } = body as Record<string, unknown>

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 })
  }
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "slug is required" }, { status: 400 })
  }
  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "content is required" }, { status: 400 })
  }

  const db = await getDb()

  const existing = await db.collection<Post>("posts").findOne({ slug })
  if (existing) {
    return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
  }

  const excerpt = content.replace(/[#*`[\]]/g, "").slice(0, 160).trim()
  const now = new Date()

  const post: Post = {
    title,
    slug,
    content,
    excerpt,
    tags: [],
    status: "draft",
    authorId: "",
    authorName: "",
    ...(series && typeof series === "string" ? { series } : {}),
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Post>("posts").insertOne(post)

  return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 })
}
