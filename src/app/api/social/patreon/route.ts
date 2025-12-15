import { NextResponse } from "next/server"

import { fetchPatreonPosts } from "@/lib/ingest/patreon"
import { normalizeExternalPost } from "@/lib/ingest/utils"

export async function GET() {
  const result = await fetchPatreonPosts()
  const posts = result.posts.map(normalizeExternalPost)

  return NextResponse.json({
    source: result.source,
    enabled: result.enabled,
    missingKeys: result.missingKeys,
    message: result.message,
    posts,
  })
}
