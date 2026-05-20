import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongo"
import type { Bookmark } from "@/models/bookmark"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDb()
    const bookmarks = await db
      .collection<Bookmark>("bookmarks")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(bookmarks)
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { postSlug, postTitle, postExcerpt, postCoverImage } = body

    if (!postSlug || !postTitle) {
      return NextResponse.json({ error: "postSlug and postTitle are required" }, { status: 400 })
    }

    const db = await getDb()
    const existing = await db.collection<Bookmark>("bookmarks").findOne({ userId, postSlug })
    if (existing) return NextResponse.json(existing)

    const bookmark: Bookmark = {
      userId,
      postSlug,
      postTitle,
      postExcerpt,
      postCoverImage,
      createdAt: new Date(),
    }

    const result = await db.collection<Bookmark>("bookmarks").insertOne(bookmark)
    return NextResponse.json({ ...bookmark, _id: result.insertedId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to add bookmark" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const postSlug = searchParams.get("postSlug")
    if (!postSlug) return NextResponse.json({ error: "postSlug is required" }, { status: 400 })

    const db = await getDb()
    await db.collection<Bookmark>("bookmarks").deleteOne({ userId, postSlug })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 })
  }
}
