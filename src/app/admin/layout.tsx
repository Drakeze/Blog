import type { ReactNode } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { requireAdmin } from "@/lib/auth"

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  requireAdmin()
  return <AdminLayout>{children}</AdminLayout>
}
