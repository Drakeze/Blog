import Link from "next/link"

import { Button } from "@/components/ui/button"

export function BlogHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background">
      <div className="pointer-events-none absolute right-0 top-0 h-120 w-120 rounded-full bg-primary/6 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-16 left-0 h-95 w-95 rounded-full bg-secondary/6 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center md:px-6 md:py-32">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Building in public
        </div>

        <h1 className="mb-5 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
          Build updates,{" "}
          <span className="text-secondary">engineering notes,</span>
          <br className="hidden sm:block" /> and product progress
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Follow new posts from the blog and Reddit in one place, and subscribe to get email updates when new content goes live.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 rounded-full px-7 text-sm font-semibold shadow-sm">
            <Link href="/subscribe">Subscribe for free</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full bg-transparent px-7 text-sm">
            <Link href="/blog">Browse posts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
