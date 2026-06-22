import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getDb } from "@/lib/mongo"
import { sendNewsletterEmail } from "@/lib/email"
import { getPostHogClient } from "@/lib/posthog-server"
import { env } from "@/lib/env"
import type { Post } from "@/models/post"
import type { Subscriber } from "@/models/subscriber"

// Manual newsletter send for a given post slug
export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { slug } = await req.json()
    if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 })

    const db = await getDb()
    const post = await db.collection<Post>("posts").findOne({ slug, status: "published" })
    if (!post) return NextResponse.json({ error: "Published post not found" }, { status: 404 })

    const subscribers = await db
      .collection<Subscriber>("subscribers")
      .find({ confirmed: true })
      .toArray()

    let sent = 0
    let failed = 0

    for (const sub of subscribers) {
      try {
        await sendNewsletterEmail({
          to: sub.email,
          subject: post.title,
          postTitle: post.title,
          postExcerpt: post.excerpt,
          postUrl: `${env.SITE_URL}/blog/${post.slug}`,
          unsubscribeUrl: `${env.SITE_URL}/api/subscribers/unsubscribe?token=${sub.unsubscribeToken}`,
          postImage: post.coverImage,
          authorName: post.authorName,
          authorImageUrl: post.authorImageUrl,
        })
        sent++
      } catch {
        failed++
      }
    }

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: "admin",
      event: "server_newsletter_sent",
      properties: {
        post_slug: post.slug,
        post_title: post.title,
        total_subscribers: subscribers.length,
        sent,
        failed,
      },
    })

    return NextResponse.json({ sent, failed, total: subscribers.length })
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 })
  }
}
