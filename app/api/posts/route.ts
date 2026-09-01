import { after, NextResponse } from "next/server"
import { isAdmin, requireAdminApi } from "@/lib/auth"
import { getDb } from "@/lib/mongo"
import { slugify, toPositiveInt } from "@/lib/utils"
import { captureServerEvent } from "@/lib/posthog-server"
import type { Post } from "@/models/post"
import { sendNewsletterToConfirmedSubscribers } from "@/lib/email"
import { env } from "@/lib/env"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tag = searchParams.get("tag")
    const status = searchParams.get("status") // admin only
    const page = toPositiveInt(searchParams.get("page"), 1)
    const limit = toPositiveInt(searchParams.get("limit"), 12, 50)
    const skip = (page - 1) * limit

    const db = await getDb()
    const filter: Record<string, unknown> = {}

    // Non-admins only see published posts
    if (status === "all") {
      if (!(await isAdmin())) filter.status = "published"
    } else {
      filter.status = status ?? "published"
    }

    if (tag) filter.tags = tag

    const [posts, total] = await Promise.all([
      db
        .collection<Post>("posts")
        .find(filter, { projection: { content: 0 } })
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection<Post>("posts").countDocuments(filter),
    ])

    return NextResponse.json({ posts, total, page, limit })
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const denied = await requireAdminApi()
    if (denied) return denied
    const db = await getDb()
    const body = await req.json()

    const { title, content, excerpt, coverImage, tags, status, authorId, authorName, authorImageUrl } = body

    if (!title || !content || !excerpt) {
      return NextResponse.json({ error: "title, content, and excerpt are required" }, { status: 400 })
    }

    const slug = slugify(title)
    const existing = await db.collection<Post>("posts").findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: "A post with this title already exists" }, { status: 409 })
    }

    const now = new Date()
    const post: Post = {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      tags: tags ?? [],
      status: status ?? "draft",
      authorId,
      authorName,
      authorImageUrl,
      publishedAt: status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection<Post>("posts").insertOne(post)

    if (status === "published") {
      captureServerEvent({
        distinctId: authorId ?? "admin",
        event: "server_post_published",
        properties: {
          post_slug: post.slug,
          post_title: post.title,
          tags: post.tags,
          author_name: post.authorName,
        },
      })
    }

    // Send newsletter if published and auto-send is on. Runs after the response
    // so a slow/failing send doesn't block post creation, but stays observable.
    if (status === "published" && env.AUTO_SEND_POST_EMAILS) {
      const created: Post = { ...post, _id: result.insertedId }
      after(async () => {
        try {
          const res = await sendNewsletterToConfirmedSubscribers(created, db)
          console.info("Auto-send newsletter:", res)
        } catch (err) {
          console.error("Auto-send newsletter failed:", err)
        }
      })
    }

    return NextResponse.json({ ...post, _id: result.insertedId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
