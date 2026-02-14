import { NextResponse } from "next/server"

import { upsertExternalPost } from "@/data/posts"
import { syncPatreonPosts } from "@/lib/social/patreon"

const PATREON_ACCESS_TOKEN = process.env.PATREON_ACCESS_TOKEN
const PATREON_CAMPAIGN_ID = process.env.PATREON_CAMPAIGN_ID
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

    if (!PATREON_ACCESS_TOKEN || !PATREON_CAMPAIGN_ID) {
      return NextResponse.json(
        {
          enabled: false,
          integration: "patreon",
          error: "Patreon credentials not configured",
        },
        { status: 200 },
      )
    }

    // Mock mode for testing without hitting Patreon API
    if (mockMode) {
      return NextResponse.json({
        success: true,
        message: "Patreon payload validated successfully",
        mockMode: true,
        validated: { campaignId: PATREON_CAMPAIGN_ID, limit },
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
      enabled: true,
      integration: "patreon",
      synced: successCount,
      failed: failureCount,
      total: results.length,
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
    enabled: Boolean(PATREON_ACCESS_TOKEN && PATREON_CAMPAIGN_ID),
    description: "Server‑configured Patreon ingestion",
    usage: {
      POST: {
        description: "Resync Patreon posts using server configuration",
        optionalBody: {
          limit: "number (optional)",
          mockMode: "boolean (optional)",
        },
      },
    },
  })
}
