import { NextResponse } from "next/server"

import { isAdminAuthorized } from "@/lib/auth"
import { importExternalPosts } from "@/lib/ingest"

export async function POST() {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await importExternalPosts()
  return NextResponse.json(result)
}
