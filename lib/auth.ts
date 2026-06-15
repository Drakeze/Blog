import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import { authConfig } from "./env"

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  if (authConfig.adminUserIds.includes(userId)) return true

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress.toLowerCase()
  return !!email && authConfig.adminEmails.includes(email)
}

export async function requireAdmin(redirectPath?: string) {
  const admin = await isAdmin()
  if (!admin) {
    const url = redirectPath
      ? `/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`
      : "/sign-in"
    redirect(url)
  }
}

export async function requireAdminRequest(): Promise<{ authorized: boolean }> {
  const admin = await isAdmin()
  return { authorized: admin }
}
