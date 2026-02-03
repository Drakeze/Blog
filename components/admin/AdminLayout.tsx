import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/admin/LogoutButton"

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/admin" className="font-serif text-xl font-semibold tracking-tight">
            Admin
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Button asChild variant="ghost" size="sm" className="rounded-full px-3">
              <Link href="/admin">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full px-3">
              <Link href="/admin/posts">Posts</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full px-3">
              <Link href="/admin/create">New Post</Link>
            </Button>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">{children}</main>

      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted-foreground md:px-6">
          Admin tools for the blog platform.
        </div>
      </footer>
    </div>
  )
}
