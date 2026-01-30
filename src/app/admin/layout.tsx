import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { isAdminAuthorized } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  const authorized = await isAdminAuthorized()
  
  if (!authorized) {
    redirect("/admin/login")
  }
  
  return <AdminLayout>{children}</AdminLayout>
}
