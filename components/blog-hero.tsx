import Link from "next/link"

import { Button } from "@/components/ui/button"

export function BlogHero() {
  return (
    <section className="border-b border-border/60 bg-muted/40">
      <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-24">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-secondary md:text-6xl">
          Build updates, engineering notes, and product progress
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          Follow new posts from the blog and Reddit in one place, and join the waitlist to get email notifications when new content goes live.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full px-6">
            <Link href="/subscribe">Join waitlist</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full bg-transparent px-6">
            <Link href="/blog">Browse posts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
