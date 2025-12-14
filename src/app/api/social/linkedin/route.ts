import { NextResponse } from "next/server"

import { fetchLinkedInPosts } from "@/lib/ingest/linkedin"
import { normalizeExternalPost } from "@/lib/ingest/utils"

export async function GET() {
  const result = await fetchLinkedInPosts()
  const posts = result.posts.map(normalizeExternalPost)

  return NextResponse.json({
    source: result.source,
    enabled: result.enabled,
    missingKeys: result.missingKeys,
    message: result.message,
    posts,
  })
}
