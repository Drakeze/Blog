import Link from "next/link"

import { Button } from "@/components/ui/button"

export function BlogHero() {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-4 py-1.5 text-xs font-medium text-primary-foreground/70">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          Building in public
        </div>

        <h1 className="mb-5 font-sans text-5xl font-bold tracking-tight text-primary-foreground md:text-7xl">
          Build updates,{" "}
          <span className="text-primary-foreground/60">engineering notes,</span>
          <br className="hidden sm:block" /> and product progress
        </h1>

        <p className="mb-10 max-w-xl text-base leading-relaxed text-primary-foreground/70 md:text-lg">
          Follow new posts from the blog and Reddit in one place, and subscribe to get email updates when new content goes live.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="h-11 rounded-full bg-primary-foreground px-7 text-sm font-semibold text-primary shadow-sm hover:bg-primary-foreground/90"
          >
            <Link href="/subscribe">Subscribe for free</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full border-primary-foreground/40 bg-transparent px-7 text-sm text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/blog">Browse posts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
