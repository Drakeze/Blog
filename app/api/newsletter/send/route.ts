import { NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/auth"
import { getDb } from "@/lib/mongo"
import { sendNewsletterToConfirmedSubscribers } from "@/lib/email"
import { captureServerEvent } from "@/lib/posthog-server"
import type { Post } from "@/models/post"

// Manual newsletter send for a given post slug
export async function POST(req: Request) {
  try {
    const denied = await requireAdminApi()
    if (denied) return denied

    const body = await req.json().catch(() => null)
    const slug = body?.slug
    const force = body?.force === true
    if (typeof slug !== "string") {
      return NextResponse.json({ error: "slug is required" }, { status: 400 })
    }

    const db = await getDb()
    const post = await db.collection<Post>("posts").findOne({ slug, status: "published" })
    if (!post) return NextResponse.json({ error: "Published post not found" }, { status: 404 })

    if (post.newsletterSentAt && !force) {
      return NextResponse.json(
        {
          error: "Newsletter already sent for this post",
          sentAt: post.newsletterSentAt,
          hint: "Pass { force: true } to send again.",
        },
        { status: 409 },
      )
    }

    const result = await sendNewsletterToConfirmedSubscribers(post, db)

    captureServerEvent({
      distinctId: "admin",
      event: "server_newsletter_sent",
      properties: {
        post_slug: post.slug,
        post_title: post.title,
        total_subscribers: result.total,
        sent: result.sent,
        failed: result.failed,
      },
    })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 })
  }
}
