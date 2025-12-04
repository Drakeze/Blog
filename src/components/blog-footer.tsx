import Link from "next/link"

export function BlogFooter() {
  return (
    <footer className="mt-24 border-t border-border/80 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-sm font-semibold text-background">
              Thoughts
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A collection of ideas, insights, and reflections from across the web.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="flex items-center gap-2 rounded-lg px-2 py-1 text-foreground transition hover:bg-muted">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/subscribe"
                  className="flex items-center gap-2 rounded-lg px-2 py-1 text-foreground transition hover:bg-muted"
                >
                  Subscribe
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center gap-2 rounded-lg px-2 py-1 text-foreground transition hover:bg-muted">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Connect</h4>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-foreground transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                GitHub ↗
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-foreground transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                Twitter ↗
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-foreground transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2025 All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
