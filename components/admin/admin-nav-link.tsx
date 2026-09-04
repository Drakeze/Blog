"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AdminNavLink({
  href,
  label,
  icon,
  exact,
}: {
  href: string
  label: string
  icon: React.ReactNode
  exact?: boolean
}) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2 md:px-3 py-2 text-sm transition-colors justify-center md:justify-start",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Link>
  )
}
