import { ClerkProvider } from "@clerk/nextjs"
import type { ReactNode } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { authConfig, publicEnv } from "@/lib/env"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={publicEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} signInUrl={authConfig.signInUrl}>
      <AdminLayout>{children}</AdminLayout>
    </ClerkProvider>
  )
}
