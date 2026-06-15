import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import type { Like } from "@/models/like"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { postSlug, fingerprint } = body ?? {}
  if (!postSlug || !fingerprint) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const db = await getDb()
  await db.collection<Like>("likes").updateOne(
    { fingerprint, postSlug },
    { $setOnInsert: { fingerprint, postSlug, createdAt: new Date() } },
    { upsert: true },
  )
  return NextResponse.json({ liked: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const postSlug = searchParams.get("postSlug")
  const fingerprint = searchParams.get("fingerprint")
  if (!postSlug || !fingerprint) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const db = await getDb()
  await db.collection<Like>("likes").deleteOne({ fingerprint, postSlug })
  return NextResponse.json({ liked: false })
}
