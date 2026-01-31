import type { ReactNode } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
