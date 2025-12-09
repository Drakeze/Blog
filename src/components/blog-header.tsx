"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"

export function BlogHeader() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const navItems = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/blog", label: "Blog" },
      { href: "/subscribe", label: "Subscribe" },
    ],
    [],
  )

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
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
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
                className="h-9 w-9 rounded-full border border-border/70 bg-background shadow-sm transition-all hover:-translate-y-0.5 hover:border-border"
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
