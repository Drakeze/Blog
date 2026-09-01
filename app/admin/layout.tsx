import { redirect } from "next/navigation"
import Link from "next/link"
import { isAdmin } from "@/lib/auth"
import { LayoutDashboard, FileText, Users, Send } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/newsletter", label: "Newsletter", icon: Send },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin()
  if (!admin) redirect("/")

  return (
    <div className="flex min-h-screen">
      <aside className="w-14 md:w-56 shrink-0 border-r border-border bg-background">
        <div className="flex h-14 items-center justify-center md:justify-start border-b border-border px-2 md:px-4">
          <Link href="/" className="text-sm font-semibold hover:opacity-80 transition-opacity" aria-label="Back to blog">
            <span aria-hidden>←</span>
            <span className="hidden md:inline"> Blog</span>
          </Link>
        </div>
        <nav className="p-2 md:p-3 space-y-0.5">
          {navItems.map((item) => (
            <AdminNavLink key={item.href} {...item} />
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}

function AdminNavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
}) {
  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2 md:px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors justify-center md:justify-start"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  )
}
