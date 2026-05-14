import { Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons/social"
import { Button } from "@/components/ui/button"

export function AuthorBio() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-border shadow-sm md:h-32 md:w-32">
            <Image
              src="/Minecraft Pfp 1.png"
              alt="Anthony Shead"
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">About the author</p>
            <h2 className="mb-3 text-2xl font-serif font-bold tracking-tight">Anthony Shead</h2>
            <p className="mb-6 max-w-xl text-muted-foreground leading-relaxed">
              Builder and thinker. I write about software, ideas, and building in public — these are the bigger updates
              for my portfolio work and projects. Thinking out loud, one post at a time.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Button asChild variant="outline" size="sm" className="rounded-full gap-2 bg-transparent">
                <a href="https://github.com/Drakeze" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full gap-2 bg-transparent">
                <a href="https://x.com/SorenIdeas" target="_blank" rel="noopener noreferrer">
                  <XIcon className="h-4 w-4" />
                  Twitter
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full gap-2 bg-transparent">
                <a href="https://www.linkedin.com/in/anthonyshead/" target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full gap-2 bg-transparent">
                <a href="https://drakeze.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                  Portfolio
                </a>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/subscribe">Subscribe</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
