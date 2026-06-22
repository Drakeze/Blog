import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { getPostHogClient } from "@/lib/posthog-server"
import type { Subscriber } from "@/models/subscriber"

// GET: redirect email unsubscribe links to the confirmation page
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 })
  return NextResponse.redirect(new URL(`/unsubscribe?token=${token}`, req.url))
}

// DELETE: perform the actual unsubscribe (called from the confirmation page)
export async function DELETE(req: Request) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 })

    const db = await getDb()
    const subscriber = await db.collection<Subscriber>("subscribers").findOne({ unsubscribeToken: token })

    const result = await db
      .collection<Subscriber>("subscribers")
      .deleteOne({ unsubscribeToken: token })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 })
    }

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: subscriber?.userId ?? subscriber?.email ?? token,
      event: "server_newsletter_unsubscribed",
      properties: { email: subscriber?.email },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
  }
}
