"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function BlogHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = stored === "dark" || (!stored && prefersDark) ? "dark" : "light"
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
    setTheme(initialTheme)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
    window.localStorage.setItem("theme", nextTheme)
    setTheme(nextTheme)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-full bg-foreground px-3 py-1 text-sm font-semibold text-background">
            Thoughts
          </Link>
          <p className="hidden text-sm text-muted-foreground sm:block">Ideas, stories, and notes from the studio.</p>
        </div>

        <nav className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
          <Link href="/" className="rounded-full px-3 py-2 transition hover:bg-muted hover:text-foreground">
            Home
          </Link>
          <Link href="/subscribe" className="rounded-full px-3 py-2 transition hover:bg-muted hover:text-foreground">
            Subscribe
          </Link>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? "☀️" : "🌙"}
          </Button>
        </nav>
      </div>
    </header>
  )
}
