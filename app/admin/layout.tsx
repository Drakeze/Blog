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
      <aside className="w-56 shrink-0 border-r border-border bg-background">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="text-sm font-semibold hover:opacity-80 transition-opacity">
            ← Blog
          </Link>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => (
            <AdminNavLink key={item.href} {...item} />
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
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
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}
