import { NextResponse } from "next/server"

import { upsertExternalPost } from "@/data/posts"
import { syncTwitterPosts } from "@/lib/social/twitter"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface SyncRequest {
  userId: string
  username: string
  limit?: number
  mockMode?: boolean
  action?: string
  content?: {
    text: string
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SyncRequest
    const { userId, username, limit = 25, mockMode = false } = body

    // Mock mode for testing without hitting Twitter API
    if (mockMode) {
      return NextResponse.json({
        success: true,
        message: "Twitter payload validated successfully",
        mockMode: true,
        validated: body,
        note: "Twitter integration is disabled due to API costs",
      })
    }

    if (!userId || !username) {
      return NextResponse.json({ error: "userId and username are required" }, { status: 400 })
    }

    // Fetch and sync Twitter posts
    const posts = await syncTwitterPosts(userId, username, limit)

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
      success: true,
      synced: successCount,
      failed: failureCount,
      results,
    })
  } catch (error) {
    console.error("Twitter sync error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync Twitter posts" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    integration: "twitter",
    status: "disabled",
    description: "Twitter integration is disabled due to API costs",
    note: "Enable by providing TWITTER_BEARER_TOKEN in environment variables",
    endpoints: {
      POST: {
        description: "Sync posts from Twitter user",
        body: {
          userId: "string (required)",
          username: "string (required)",
          limit: "number (optional, default: 25)",
          mockMode: "boolean (optional, default: false)",
        },
      },
    },
  })
}
