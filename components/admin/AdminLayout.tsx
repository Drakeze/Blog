import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/admin/LogoutButton"
import { authConfig } from "@/lib/env"

const isDevBypass = process.env.NODE_ENV === "development" && !authConfig.clerkEnabled

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {isDevBypass && (
        <div className="border-b border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-950/30">
          <div className="mx-auto max-w-6xl px-4 py-2 md:px-6">
            <p className="text-xs font-medium text-yellow-800 dark:text-yellow-400">
              Dev mode — admin is open because Clerk is not configured. Set Clerk keys before deploying to production.
            </p>
          </div>
        </div>
      )}
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
              <Link href="/admin/subscribers">Subscribers</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full px-3">
              <Link href="/admin/create">New Post</Link>
            </Button>
            {authConfig.clerkEnabled ? <LogoutButton /> : null}
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
