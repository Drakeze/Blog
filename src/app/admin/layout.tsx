import type { ReactNode } from "react"

import { requireAdmin } from "@/lib/auth"

export default function AdminLayout({ children }: { children: ReactNode }) {
  requireAdmin()
  return children
}
