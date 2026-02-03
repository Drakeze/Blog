import { Github, Heart,Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

export function BlogFooter() {
  return (
    <footer className="border-t border-border bg-muted/40 mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Thoughts</h3>
            <p className="text-sm text-muted-foreground">
              A collection of ideas, insights, and reflections from across the web.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground hover:scale-105 transition-transform">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-muted-foreground hover:text-foreground hover:scale-105 transition-transform">
                  Subscribe
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground hover:scale-105 transition-transform">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/Drakeze"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-105 transition-transform"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://github.com/DrakezeWind"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-105 transition-transform"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://x.com/SorenIdeas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-105 transition-transform"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://www.linkedin.com/in/anthonyshead/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-105 transition-transform"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://www.patreon.com/SorenTech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-105 transition-transform"
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Patreon</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
