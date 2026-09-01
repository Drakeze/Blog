import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import type { Like } from "@/models/like"
import type { Post } from "@/models/post"

// Reject non-string values — an object like {"$ne":null} would otherwise flow
// straight into the Mongo filter (operator injection).
function readPair(postSlug: unknown, fingerprint: unknown): { postSlug: string; fingerprint: string } | null {
  if (typeof postSlug !== "string" || typeof fingerprint !== "string") return null
  if (!postSlug || !fingerprint || fingerprint.length > 100) return null
  return { postSlug, fingerprint }
}

async function postExists(postSlug: string): Promise<boolean> {
  const db = await getDb()
  const post = await db
    .collection<Post>("posts")
    .findOne({ slug: postSlug, status: "published" }, { projection: { _id: 1 } })
  return !!post
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const pair = readPair(body?.postSlug, body?.fingerprint)
  if (!pair) return NextResponse.json({ error: "Invalid fields" }, { status: 400 })
  if (!(await postExists(pair.postSlug))) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const db = await getDb()
  // Requires the unique { fingerprint, postSlug } index (scripts/ensure-indexes)
  // to be race-safe.
  // ponytail: like count is still inflatable by rotating the client-side
  // fingerprint — real fix is IP+UA rate limiting or signed tokens, not worth
  // the infra yet.
  await db.collection<Like>("likes").updateOne(
    { fingerprint: pair.fingerprint, postSlug: pair.postSlug },
    { $setOnInsert: { fingerprint: pair.fingerprint, postSlug: pair.postSlug, createdAt: new Date() } },
    { upsert: true },
  )
  return NextResponse.json({ liked: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const pair = readPair(searchParams.get("postSlug"), searchParams.get("fingerprint"))
  if (!pair) return NextResponse.json({ error: "Invalid fields" }, { status: 400 })

  const db = await getDb()
  await db.collection<Like>("likes").deleteOne({ fingerprint: pair.fingerprint, postSlug: pair.postSlug })
  return NextResponse.json({ liked: false })
}
