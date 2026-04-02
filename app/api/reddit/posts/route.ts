import { NextResponse } from "next/server"

import { fetchRedditBlogPosts } from "@/lib/social/reddit-blog"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DEFAULT_LIMIT = 10

function parseLimit(value: string | null): number {
  if (!value) return DEFAULT_LIMIT

  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT

  return Math.min(Math.max(parsed, 1), 100)
}

function parseNewestFirst(value: string | null): boolean {
  if (!value) return true
  return value.toLowerCase() !== "false"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseLimit(searchParams.get("limit"))
  const newestFirst = parseNewestFirst(searchParams.get("newestFirst"))

  try {
    const posts = await fetchRedditBlogPosts({ limit, newestFirst })

    return NextResponse.json({
      ok: true,
      source: "reddit",
      username: "Putrid-Economy1639",
      limit,
      newestFirst,
      count: posts.length,
      posts,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to fetch Reddit posts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
