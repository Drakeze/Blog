"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

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
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-serif font-bold">Thoughts</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Home
            </Link>
            <Link href="/subscribe" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Subscribe
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-sm transition hover:bg-muted"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? "☀️" : "🌙"}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
