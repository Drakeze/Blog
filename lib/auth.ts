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

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) throw new Error("Unauthorized")
}
