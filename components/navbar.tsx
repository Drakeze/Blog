import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { isAdmin } from "@/lib/auth"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"

export async function Navbar() {
  const { userId } = await auth()
  const admin = await isAdmin()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight hover:opacity-80 transition-opacity">
          Drakeze Blog
        </Link>

        <nav className="flex items-center gap-1">
          {admin && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">Admin</Link>
            </Button>
          )}
          <ThemeToggle />
          {userId ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">Sign in</Button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  )
}
