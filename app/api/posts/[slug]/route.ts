import { NextResponse } from "next/server"
import { isAdmin, requireAdminApi } from "@/lib/auth"
import { getDb } from "@/lib/mongo"
import type { Post } from "@/models/post"

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const db = await getDb()
    const post = await db.collection<Post>("posts").findOne({ slug })
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (post.status === "draft" && !(await isAdmin())) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

// Only these fields can be updated via the API — never spread the raw body into
// $set (lets a caller set arbitrary/nested Mongo keys).
const UPDATABLE_FIELDS = ["title", "content", "excerpt", "coverImage", "tags", "status"] as const

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const denied = await requireAdminApi()
    if (denied) return denied
    const { slug } = await params
    const db = await getDb()
    const body = await req.json().catch(() => ({}))

    const existing = await db.collection<Post>("posts").findOne({ slug })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const now = new Date()
    const updates: Record<string, unknown> = { updatedAt: now }
    for (const key of UPDATABLE_FIELDS) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    // Set publishedAt when first publishing
    if (body.status === "published" && !existing.publishedAt) {
      updates.publishedAt = now
    }

    await db.collection<Post>("posts").updateOne({ slug }, { $set: updates as Partial<Post> })
    return NextResponse.json({ ...existing, ...updates })
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const denied = await requireAdminApi()
    if (denied) return denied
    const { slug } = await params
    const db = await getDb()
    const result = await db.collection<Post>("posts").deleteOne({ slug })
    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
