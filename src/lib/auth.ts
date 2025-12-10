import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const ADMIN_COOKIE_NAME = "admin-auth"
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 6
export const ADMIN_COOKIE_PATH = "/admin"

export const adminCookieConfig = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: ADMIN_COOKIE_PATH,
  maxAge: ADMIN_COOKIE_MAX_AGE,
}

export function isAdminAuthorized() {
  return cookies().get(ADMIN_COOKIE_NAME)?.value === "true"
}

export function requireAdmin() {
  if (!isAdminAuthorized()) {
    redirect("/")
  }

  return true
}
