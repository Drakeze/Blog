import type { ReactNode } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  await requireAdmin()
  return <AdminLayout>{children}</AdminLayout>
}
