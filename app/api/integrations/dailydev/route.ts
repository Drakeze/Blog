import { NextResponse } from "next/server"

import { socialConfig } from "@/lib/env"
import { syncDailyDevPosts } from "@/lib/social/dailydev"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  const config = socialConfig.dailydev
  if (!config.enabled) {
    return NextResponse.json({ enabled: false })
  }

  await syncDailyDevPosts()

  return NextResponse.json({
    enabled: true,
    integration: "dailydev",
    synced: 0,
    failed: 0,
    total: 0,
    note: "Daily.dev ingestion is stubbed. Enable when API access is available.",
  })
}

export async function GET() {
  const config = socialConfig.dailydev
  if (!config.enabled) {
    return NextResponse.json({ enabled: false })
  }

  return NextResponse.json({
    integration: "dailydev",
    enabled: true,
    description: "Daily.dev integration is stubbed for future enablement",
  })
}
