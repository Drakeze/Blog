import { NextResponse } from "next/server"

import { upsertExternalPost } from "@/data/posts"
import { requireAdminRequest } from "@/lib/auth"
import { socialConfig } from "@/lib/env"
import { syncRedditPosts } from "@/lib/social/reddit"

const REDDIT_USERNAME = process.env.REDDIT_USERNAME
const DEFAULT_LIMIT = 25

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const authResult = await requireAdminRequest()
  if (!authResult.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { mockMode = false, limit = DEFAULT_LIMIT, username } = body as {
      mockMode?: boolean
      limit?: number
      username?: string
    }
    const redditUsername = username?.trim() || REDDIT_USERNAME

    if (!socialConfig.reddit.enabled) {
      return NextResponse.json(
        {
          enabled: false,
          integration: "reddit",
          error: `Missing Reddit credentials: ${socialConfig.reddit.missingKeys.join(", ")}`,
        },
        { status: 503 },
      )
    }

    if (!redditUsername) {
      return NextResponse.json(
        {
          enabled: false,
          integration: "reddit",
          error: "Provide a Reddit username or configure REDDIT_USERNAME",
        },
        { status: 400 },
      )
    }

    // Mock mode for testing without hitting Reddit API
    if (mockMode) {
      return NextResponse.json({
        success: true,
        message: "Reddit payload validated successfully",
        mockMode: true,
        validated: { username: redditUsername, limit },
      })
    }

    // Fetch and sync Reddit posts
    const posts = await syncRedditPosts(redditUsername, limit)

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
      failures: results.filter((result) => !result.success).slice(0, 5),
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
    enabled: socialConfig.reddit.enabled,
    description: "Server‑configured Reddit ingestion",
    missingKeys: socialConfig.reddit.missingKeys,
    usage: {
      POST: {
        description: "Resync Reddit posts using a typed username or server configuration",
        optionalBody: {
          limit: "number (optional)",
          mockMode: "boolean (optional)",
          username: "string (optional)",
        },
      },
    },
  })
}
