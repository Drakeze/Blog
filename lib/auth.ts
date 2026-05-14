import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { authConfig } from "@/lib/env"

type AdminAuthorizationReason = "authorized" | "unauthenticated" | "forbidden" | "not-configured"

type AdminAuthorizationResult = {
  authorized: boolean
  reason: AdminAuthorizationReason
  userId: string | null
}

function buildSignInUrl(redirectUrl?: string) {
  if (!redirectUrl) {
    return authConfig.signInUrl
  }

  const separator = authConfig.signInUrl.includes("?") ? "&" : "?"
  return `${authConfig.signInUrl}${separator}redirect_url=${encodeURIComponent(redirectUrl)}`
}

async function userMatchesAdminAllowlist(userId: string) {
  if (authConfig.adminUserIds.includes(userId)) {
    return true
  }

  if (!authConfig.adminEmails.length) {
    return false
  }

  const user = await currentUser()
  const emailAddresses =
    user?.emailAddresses.map((emailAddress) => emailAddress.emailAddress.toLowerCase()) ?? []

  return emailAddresses.some((email) => authConfig.adminEmails.includes(email))
}

async function getAdminAuthorization(): Promise<AdminAuthorizationResult> {
  // Dev bypass: allow admin without Clerk when running locally
  if (process.env.NODE_ENV === "development" && !authConfig.clerkEnabled) {
    return { authorized: true, reason: "authorized", userId: "dev" }
  }

  if (!authConfig.clerkEnabled || !authConfig.hasAdminAllowlist) {
    return { authorized: false, reason: "not-configured", userId: null }
  }

  const { userId } = await auth()
  if (!userId) {
    return { authorized: false, reason: "unauthenticated", userId: null }
  }

  const authorized = await userMatchesAdminAllowlist(userId)
  return {
    authorized,
    reason: authorized ? "authorized" : "forbidden",
    userId,
  }
}

export async function isAdminAuthorized() {
  const authorization = await getAdminAuthorization()
  return authorization.authorized
}

export async function requireAdmin(redirectUrl?: string) {
  const authorization = await getAdminAuthorization()

  if (authorization.reason === "unauthenticated") {
    redirect(buildSignInUrl(redirectUrl))
  }

  if (authorization.reason === "not-configured") {
    redirect("/admin/unauthorized?reason=not-configured")
  }

  if (!authorization.authorized) {
    redirect("/admin/unauthorized?reason=forbidden")
  }

  return authorization
}

export async function requireAdminRequest() {
  return getAdminAuthorization()
}
