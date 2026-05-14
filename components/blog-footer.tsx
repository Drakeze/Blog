import Link from "next/link"

import { GitHubIcon, LinkedInIcon, PatreonIcon } from "@/components/icons/social"

export function BlogFooter() {
  return (
    <footer className="border-t border-border bg-muted/40 mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Thinking Outside The Box</h3>
            <p className="text-sm text-muted-foreground">
              Ideas, insights, and build updates from the blog and Reddit.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-muted-foreground hover:text-foreground transition-colors">
                  Subscribe
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/anthonyshead/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <LinkedInIcon className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://github.com/Drakeze"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitHubIcon className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.patreon.com/Drakeze"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <PatreonIcon className="h-5 w-5" />
                <span className="sr-only">Patreon</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Anthony Shead. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
