"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function BlogHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
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
            <Link href="/blog" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Blog
            </Link>
            <Link href="/subscribe" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Subscribe
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
