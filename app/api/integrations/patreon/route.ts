import { NextResponse } from "next/server"

import { upsertExternalPost } from "@/data/posts"
import { socialConfig } from "@/lib/env"
import { syncPatreonPosts } from "@/lib/social/patreon"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const config = socialConfig.patreon
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
    // Fetch and sync Patreon posts
    const posts = await syncPatreonPosts(limit)

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
      integration: "patreon",
      synced: successCount,
      failed: failureCount,
      total: posts.length,
      results,
    })
  } catch (error) {
    console.error("Patreon sync error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync Patreon posts" },
      { status: 500 },
    )
  }
}

export async function GET() {
  const config = socialConfig.patreon
  if (!config.enabled) {
    return NextResponse.json({ enabled: false })
  }

  return NextResponse.json({
    integration: "patreon",
    enabled: true,
    description: "Sync Patreon posts to the blog database",
  })
}
