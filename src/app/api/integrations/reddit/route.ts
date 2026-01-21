import { NextResponse } from "next/server"
import { syncRedditPosts } from "@/lib/social/reddit"
import { upsertExternalPost } from "@/data/posts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface SyncRequest {
  username: string
  limit?: number
  mockMode?: boolean
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SyncRequest
    const { username, limit = 25, mockMode = false } = body

    if (!username) {
      return NextResponse.json({ error: "username is required" }, { status: 400 })
    }

    // Mock mode for testing without hitting Reddit API
    if (mockMode) {
      return NextResponse.json({
        success: true,
        message: "Reddit payload validated successfully",
        mockMode: true,
        validated: { username, limit },
      })
    }

    // Fetch and sync Reddit posts
    const posts = await syncRedditPosts(username, limit)

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
    status: "active",
    description: "Sync Reddit posts to the blog database",
    endpoints: {
      POST: {
        description: "Sync posts from a Reddit user",
        body: {
          username: "string (required)",
          limit: "number (optional, default: 25)",
          mockMode: "boolean (optional, default: false)",
        },
      },
    },
  })
}
