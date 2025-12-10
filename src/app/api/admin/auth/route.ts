import { NextRequest, NextResponse } from "next/server"

import { ADMIN_COOKIE_NAME, adminCookieConfig, isAdminAuthorized } from "@/lib/auth"
import { env } from "@/lib/env"

export async function GET() {
  const authorized = isAdminAuthorized()
  return NextResponse.json({ authorized })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body ?? {}
  const expectedPassword = env.ADMIN_PASSWORD

  if (!expectedPassword) {
    return NextResponse.json({ error: "Admin password is not configured." }, { status: 500 })
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE_NAME, "true", adminCookieConfig)

  return response
}
