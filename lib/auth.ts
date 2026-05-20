import { auth, currentUser } from "@clerk/nextjs/server"
import { env } from "./env"

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  if (env.CLERK_ADMIN_USER_IDS.includes(userId)) return true

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress
  return !!email && env.CLERK_ADMIN_EMAILS.includes(email)
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) throw new Error("Unauthorized")
}
