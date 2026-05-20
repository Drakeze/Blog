import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import type { Subscriber } from "@/models/subscriber"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 })

    const db = await getDb()
    const result = await db
      .collection<Subscriber>("subscribers")
      .deleteOne({ unsubscribeToken: token })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 })
    }

    return NextResponse.redirect(
      new URL("/?unsubscribed=true", req.url)
    )
  } catch {
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
  }
}
