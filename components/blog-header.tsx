"use client"

import { useAuth } from "@clerk/nextjs"
import { Moon, Sun } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useMemo, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

function AuthNavigation() {
  const { isLoaded, userId } = useAuth()

  if (!isLoaded) {
    return null
  }

  return userId ? (
    <Button asChild size="sm" className="rounded-full px-4">
      <Link href="/admin">Admin</Link>
    </Button>
  ) : (
    <Button asChild variant="outline" size="sm" className="rounded-full px-4">
      <Link href="/sign-in">Sign in</Link>
    </Button>
  )
}

export function BlogHeader() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )
  const pathname = usePathname()

  const navItems = useMemo(
    () => [
      { href: "/blog", label: "Blog" },
      { href: "/subscribe", label: "Subscribe" },
    ],
    [],
  )

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 rounded-full px-3 py-1 transition-colors hover:bg-accent">
            <span className="text-lg font-serif font-bold tracking-tight">Thinking Outside The Box</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-3 md:gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1 font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "bg-accent text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            {clerkEnabled ? <AuthNavigation /> : null}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
                className="h-9 w-9 rounded-full border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-border"
              >
                {resolvedTheme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
