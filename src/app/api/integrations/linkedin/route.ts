import { NextResponse } from "next/server"

import { upsertExternalPost } from "@/data/posts"
import { syncLinkedInPosts } from "@/lib/social/linkedin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface SyncRequest {
  limit?: number
  mockMode?: boolean
  action?: string
  content?: {
    title: string
    description: string
    url: string
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SyncRequest
    const { limit = 25, mockMode = false } = body

    // Mock mode for testing without hitting LinkedIn API
    if (mockMode) {
      return NextResponse.json({
        success: true,
        message: "LinkedIn payload validated successfully",
        mockMode: true,
        validated: body,
      })
    }

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
      success: true,
      synced: successCount,
      failed: failureCount,
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
  return NextResponse.json({
    integration: "linkedin",
    status: "active",
    description: "Sync LinkedIn posts to the blog database",
    endpoints: {
      POST: {
        description: "Sync posts from LinkedIn profile",
        body: {
          limit: "number (optional, default: 25)",
          mockMode: "boolean (optional, default: false)",
        },
      },
    },
  })
}
