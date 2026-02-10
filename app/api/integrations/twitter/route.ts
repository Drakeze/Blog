import { NextResponse } from "next/server"

import { socialConfig } from "@/lib/env"
import { syncTwitterPosts } from "@/lib/social/twitter"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const config = socialConfig.twitter
  if (!config.enabled) {
    return NextResponse.json({ enabled: false })
  }

  let limit = 25
  try {
    const body = (await request.json()) as { limit?: number }
    if (typeof body.limit === "number") {
      limit = body.limit
    }
  } catch {
    limit = 25
  }

  await syncTwitterPosts()

  return NextResponse.json({
    enabled: true,
    integration: "twitter",
    synced: 0,
    failed: 0,
    total: 0,
    note: "Twitter/X ingestion is stubbed. Enable when API access is available.",
    limit,
  })
}

export async function GET() {
  const config = socialConfig.twitter
  if (!config.enabled) {
    return NextResponse.json({ enabled: false })
  }

  return NextResponse.json({
    integration: "twitter",
    enabled: true,
    description: "Twitter/X integration is stubbed for future enablement",
  })
}
