import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getDb } from "@/lib/mongo"
import { slugify } from "@/lib/utils"
import type { Post } from "@/models/post"
import { sendNewsletterEmail } from "@/lib/email"
import { env } from "@/lib/env"
import crypto from "crypto"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tag = searchParams.get("tag")
    const status = searchParams.get("status") // admin only
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "12")
    const skip = (page - 1) * limit

    const db = await getDb()
    const filter: Record<string, unknown> = {}

    // Non-admins only see published posts
    if (status === "all") {
      try {
        await requireAdmin()
      } catch {
        filter.status = "published"
      }
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
    await requireAdmin()
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

    // Send newsletter if published and auto-send is on
    if (status === "published" && env.AUTO_SEND_POST_EMAILS) {
      void sendNewsletter(post, db)
    }

    return NextResponse.json({ ...post, _id: result.insertedId }, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}

async function sendNewsletter(post: Post, db: import("mongodb").Db) {
  const subscribers = await db
    .collection("subscribers")
    .find({ confirmed: true })
    .toArray()

  for (const sub of subscribers) {
    const token = sub.unsubscribeToken as string ?? crypto.randomUUID()
    const postUrl = `${env.SITE_URL}/blog/${post.slug}`
    const unsubUrl = `${env.SITE_URL}/api/subscribers/unsubscribe?token=${token}`
    await sendNewsletterEmail({
      to: sub.email as string,
      subject: post.title,
      postTitle: post.title,
      postExcerpt: post.excerpt,
      postUrl,
      unsubscribeUrl: unsubUrl,
    })
  }
}
