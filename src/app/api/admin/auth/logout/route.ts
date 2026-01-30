import { NextResponse } from "next/server"

import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_PATH } from "@/lib/auth"

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear the admin cookie
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: ADMIN_COOKIE_PATH,
    maxAge: 0,
  })

  return response
}
