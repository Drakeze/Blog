import { NextResponse } from "next/server"

import { upsertExternalPost } from "@/data/posts"
import { socialConfig } from "@/lib/env"
import { syncRedditPosts } from "@/lib/social/reddit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const config = socialConfig.reddit
  if (!config.enabled) {
    return NextResponse.json({ enabled: false })
  }

  let limit = 25
  try {
    const body = (await request.json()) as { limit?: number }
    if (typeof body.limit === "number") {
      limit = body.limit
    }
  } catch {
    limit = 25
  }

  try {
    // Fetch and sync Reddit posts
    const posts = await syncRedditPosts(limit)

    const results = []
    for (const post of posts) {
      try {
        const upserted = await upsertExternalPost(post)
        results.push({ success: true, postId: upserted.id, externalId: post.externalId })
      } catch (error) {
        results.push({
          success: false,
          externalId: post.externalId,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    return NextResponse.json({
      enabled: true,
      integration: "reddit",
      synced: successCount,
      failed: failureCount,
      total: posts.length,
      results,
    })
  } catch (error) {
    console.error("Reddit sync error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync Reddit posts" },
      { status: 500 },
    )
  }
}

export async function GET() {
  const config = socialConfig.reddit
  if (!config.enabled) {
    return NextResponse.json({ enabled: false })
  }

  return NextResponse.json({
    integration: "reddit",
    enabled: true,
    description: "Sync Reddit posts to the blog database",
  })
}
