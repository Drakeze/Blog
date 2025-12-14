import { NextResponse } from "next/server"

import { fetchRedditPosts } from "@/lib/ingest/reddit"
import { normalizeExternalPost } from "@/lib/ingest/utils"

export async function GET() {
  const result = await fetchRedditPosts()
  const posts = result.posts.map(normalizeExternalPost)

  return NextResponse.json({
    source: result.source,
    enabled: result.enabled,
    missingKeys: result.missingKeys,
    message: result.message,
    posts,
  })
}
