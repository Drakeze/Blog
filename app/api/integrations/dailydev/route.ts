import { NextResponse } from "next/server"

import { requireAdminRequest } from "@/lib/auth"
import { syncDailyDevPosts } from "@/lib/social/dailydev"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const authResult = await requireAdminRequest(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await syncDailyDevPosts()

  if (result.missingKeys.length) {
    return NextResponse.json(
      {
        error: `Daily.dev integration disabled. Missing: ${result.missingKeys.join(", ")}`,
        ...result,
      },
      { status: 503 },
    )
  }

  return NextResponse.json(result, { status: 202 })
}
