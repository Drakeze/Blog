import { Navbar } from "@/components/navbar"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8 mt-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Blog. Built with Next.js.
        </div>
      </footer>
    </div>
  )
}
