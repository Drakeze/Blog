import { NextResponse } from "next/server"
import { syncPatreonPosts } from "@/lib/social/patreon"
import { upsertExternalPost } from "@/data/posts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface SyncRequest {
  limit?: number
  mockMode?: boolean
  action?: string
  content?: {
    title: string
    body: string
    tier: string
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SyncRequest
    const { limit = 25, mockMode = false } = body

    // Mock mode for testing without hitting Patreon API
    if (mockMode) {
      return NextResponse.json({
        success: true,
        message: "Patreon payload validated successfully",
        mockMode: true,
        validated: body,
      })
    }

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
      success: true,
      synced: successCount,
      failed: failureCount,
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
  return NextResponse.json({
    integration: "patreon",
    status: "active",
    description: "Sync Patreon posts to the blog database",
    endpoints: {
      POST: {
        description: "Sync posts from Patreon campaign",
        body: {
          limit: "number (optional, default: 25)",
          mockMode: "boolean (optional, default: false)",
        },
      },
    },
  })
}
