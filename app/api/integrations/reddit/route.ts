import { NextResponse } from "next/server"

import { upsertExternalPost } from "@/data/posts"
import { syncRedditPosts } from "@/lib/social/reddit"

const REDDIT_USERNAME = process.env.REDDIT_USERNAME
const DEFAULT_LIMIT = 25

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { mockMode = false, limit = DEFAULT_LIMIT } = body as {
      mockMode?: boolean
      limit?: number
    }

    if (!REDDIT_USERNAME) {
      return NextResponse.json(
        {
          enabled: false,
          integration: "reddit",
          error: "REDDIT_USERNAME not configured",
        },
        { status: 200 },
      )
    }

    // Mock mode for testing without hitting Reddit API
    if (mockMode) {
      return NextResponse.json({
        success: true,
        message: "Reddit payload validated successfully",
        mockMode: true,
        validated: { username: REDDIT_USERNAME, limit },
      })
    }

    // Fetch and sync Reddit posts
    const posts = await syncRedditPosts(REDDIT_USERNAME, limit)

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
      total: results.length,
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
  return NextResponse.json({
    integration: "reddit",
    enabled: Boolean(REDDIT_USERNAME),
    description: "Server‑configured Reddit ingestion",
    usage: {
      POST: {
        description: "Resync Reddit posts using server configuration",
        optionalBody: {
          limit: "number (optional)",
          mockMode: "boolean (optional)",
        },
      },
    },
  })
}
