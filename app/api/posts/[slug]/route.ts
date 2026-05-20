import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getDb } from "@/lib/mongo"
import type { Post } from "@/models/post"

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const db = await getDb()
    const post = await db.collection<Post>("posts").findOne({ slug })
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (post.status === "draft") {
      try {
        await requireAdmin()
      } catch {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
    }
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdmin()
    const { slug } = await params
    const db = await getDb()
    const body = await req.json()

    const existing = await db.collection<Post>("posts").findOne({ slug })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const now = new Date()
    const updates: Partial<Post> = { ...body, updatedAt: now }

    // Set publishedAt when first publishing
    if (body.status === "published" && !existing.publishedAt) {
      updates.publishedAt = now
    }

    delete updates._id
    await db.collection<Post>("posts").updateOne({ slug }, { $set: updates })
    return NextResponse.json({ ...existing, ...updates })
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdmin()
    const { slug } = await params
    const db = await getDb()
    const result = await db.collection<Post>("posts").deleteOne({ slug })
    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
