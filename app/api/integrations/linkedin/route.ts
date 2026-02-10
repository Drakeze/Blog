import { NextResponse } from "next/server"

import { upsertExternalPost } from "@/data/posts"
import { socialConfig } from "@/lib/env"
import { syncLinkedInPosts } from "@/lib/social/linkedin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const config = socialConfig.linkedin
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
    // Fetch and sync LinkedIn posts
    const posts = await syncLinkedInPosts(limit)

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
      integration: "linkedin",
      synced: successCount,
      failed: failureCount,
      total: posts.length,
      results,
    })
  } catch (error) {
    console.error("LinkedIn sync error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync LinkedIn posts" },
      { status: 500 },
    )
  }
}

export async function GET() {
  const config = socialConfig.linkedin
  if (!config.enabled) {
    return NextResponse.json({ enabled: false })
  }

  return NextResponse.json({
    integration: "linkedin",
    enabled: true,
    description: "Sync LinkedIn posts to the blog database",
  })
}
