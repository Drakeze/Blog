import { NextResponse } from "next/server"

import { requireAdminRequest } from "@/lib/auth"

const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
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
    const { mockMode = false, limit = DEFAULT_LIMIT } = body as {
      mockMode?: boolean
      limit?: number
    }

    if (!LINKEDIN_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          enabled: false,
          integration: "linkedin",
          error: "LinkedIn integration not enabled (access token missing)",
        },
        { status: 200 },
      )
    }

    // Mock mode for testing without hitting LinkedIn API
    if (mockMode) {
      return NextResponse.json({
        success: true,
        message: "LinkedIn payload validated successfully",
        mockMode: true,
        validated: { limit },
      })
    }

    return NextResponse.json({
      enabled: true,
      integration: "linkedin",
      synced: 0,
      failed: 0,
      total: 0,
      note: "LinkedIn ingestion is stubbed. Enable when API access is available.",
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
    enabled: Boolean(LINKEDIN_ACCESS_TOKEN),
    description: "Server‑configured LinkedIn ingestion",
    usage: {
      POST: {
        description: "Resync LinkedIn posts using server configuration",
        optionalBody: {
          limit: "number (optional)",
          mockMode: "boolean (optional)",
        },
      },
    },
  })
}
