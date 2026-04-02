import { NextResponse } from "next/server"
import { z } from "zod"

import { upsertExternalPost } from "@/data/posts"
import { requireAdminRequest } from "@/lib/auth"
import { socialConfig } from "@/lib/env"
import { RedditIntegrationError, syncRedditPosts } from "@/lib/social/reddit"

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
    const parsedBody = z
      .object({
        mockMode: z.boolean().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(DEFAULT_LIMIT),
        username: z.string().trim().optional(),
      })
      .safeParse(body)

    if (!parsedBody.success) {
      return NextResponse.json({ error: parsedBody.error.errors[0].message }, { status: 400 })
    }

    const { mockMode = false, limit, username } = parsedBody.data
    const redditUsername = username?.trim() || socialConfig.reddit.keys.username

    if (!socialConfig.reddit.enabled) {
      return NextResponse.json(
        {
          enabled: false,
          integration: "reddit",
          error: `Missing Reddit credentials: ${socialConfig.reddit.missingKeys.join(", ")}`,
          troubleshooting: [
            "Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, and REDDIT_USER_AGENT.",
            "Redeploy the app after updating the environment variables.",
          ],
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
          troubleshooting: [
            "Enter a Reddit username in the admin sync form.",
            "Or set REDDIT_USERNAME as the default account to sync.",
          ],
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
      username: redditUsername,
      synced: successCount,
      failed: failureCount,
      total: results.length,
      failures: results.filter((result) => !result.success).slice(0, 5),
    })
  } catch (error) {
    console.error("Reddit sync error:", error)

    if (error instanceof RedditIntegrationError) {
      return NextResponse.json(
        {
          integration: "reddit",
          enabled: socialConfig.reddit.enabled,
          error: error.message,
          code: error.code,
          troubleshooting: error.troubleshooting,
        },
        { status: error.status },
      )
    }

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
    description: "Server-configured Reddit ingestion",
    missingKeys: socialConfig.reddit.missingKeys,
    defaultUsername: socialConfig.reddit.keys.username ?? null,
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
