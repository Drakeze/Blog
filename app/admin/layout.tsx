import type { ReactNode } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { AdminProviders } from "@/components/admin/AdminProviders"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProviders>
      <AdminLayout>{children}</AdminLayout>
    </AdminProviders>
  )
}
