import { NextResponse } from "next/server"

import { listSubscribers } from "@/data/subscribers"
import { requireAdminRequest } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const authResult = await requireAdminRequest()
  if (!authResult.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const search = new URL(request.url).searchParams
  const limitRaw = Number(search.get("limit") ?? "200")
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 500) : 200

  const subscribers = await listSubscribers(limit)
  return NextResponse.json({ subscribers, count: subscribers.length })
}
