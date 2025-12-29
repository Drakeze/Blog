import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { env } from "@/lib/env"

export const ADMIN_COOKIE_NAME = "admin-auth"
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 6
export const ADMIN_COOKIE_PATH = "/admin"

export const adminCookieConfig = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  path: ADMIN_COOKIE_PATH,
  maxAge: ADMIN_COOKIE_MAX_AGE,
}

export async function isAdminAuthorized() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === "true"
}
export async function requireAdmin() {
  if (!(await isAdminAuthorized())) {
    redirect("/")
  }

  return true
}

export async function requireAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? ""
  const isAuthorized = cookieHeader
    .split(/;\s*/)
    .map((part) => part.split("="))
    .some(([name, value]) => name === ADMIN_COOKIE_NAME && value === "true")

  return { authorized: isAuthorized }
}
