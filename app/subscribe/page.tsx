"use client"

import { Github, Linkedin, Twitter } from "lucide-react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SubscribePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const subscribeMutation = useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Unable to subscribe")
      }

      return response.json()
    },
    onSuccess: () => {
      setName("")
      setEmail("")
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="mx-auto max-w-4xl px-4 py-20 md:px-6">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-secondary md:text-6xl">Subscribe for updates</h1>
          <p className="text-lg text-muted-foreground text-balance md:text-xl">
            Get notified when I publish new content across my platforms
          </p>
        </div>

        <div className="mb-10 rounded-2xl border border-border bg-card/60 p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">About</h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          I&apos;m Zen, documenting my journey building Soren Tech, Earth Plus, and mastering full-stack engineering. This blog collects my posts from Twitter, Reddit, LinkedIn, Patreon, and my personal writing into one place. If you want more behind-the-scenes updates or want to support the work, Patreon is where everything connects.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-sm md:p-12">
          <form className="space-y-7" onSubmit={(e) => {
            e.preventDefault()
            subscribeMutation.mutate({ name, email })
          }}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Name (optional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                className="h-12 rounded-xl border-border bg-background/70 text-base"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                className="h-12 rounded-xl border-border bg-background/70 text-base"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <Button type="submit" size="lg" className="h-12 w-full rounded-xl text-base" disabled={subscribeMutation.isPending}>
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              I respect your privacy. Unsubscribe at any time.
            </p>

            {subscribeMutation.isSuccess && (
              <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700">
                Thanks for subscribing!
              </p>
            )}
            {subscribeMutation.isError && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {(subscribeMutation.error as Error).message}
              </p>
            )}
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground">You&apos;ll receive updates from:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="rounded-full border border-border bg-muted/60 px-4 py-2 text-sm">Personal Blog</div>
            <div className="rounded-full border border-border/60 bg-[#FF4500]/10 px-4 py-2 text-sm text-[#FF4500]">Reddit</div>
            <div className="rounded-full border border-border/60 bg-[#1DA1F2]/10 px-4 py-2 text-sm text-[#1DA1F2]">Twitter/X</div>
            <div className="rounded-full border border-border/60 bg-[#0A66C2]/10 px-4 py-2 text-sm text-[#0A66C2]">LinkedIn</div>
            <div className="rounded-full border border-border/60 bg-[#FF424D]/10 px-4 py-2 text-sm text-[#FF424D]">Patreon</div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="mb-4 text-muted-foreground">Connect with me:</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent shadow-sm" asChild>
              <a href="https://x.com/SorenIdeas" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter/X</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent shadow-sm" asChild>
              <a href="https://www.linkedin.com/in/anthonyshead/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent shadow-sm" asChild>
              <a href="https://www.reddit.com/user/Putrid-Economy1639/" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
                <span className="sr-only">Reddit</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent shadow-sm" asChild>
              <a href="https://www.patreon.com/SorenTech" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003" />
                </svg>
                <span className="sr-only">Patreon</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent shadow-sm" asChild>
              <a href="https://github.com/Drakeze" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-primary/10 bg-primary/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Want more?{" "}
            <a href="https://www.patreon.com/SorenTech" className="text-primary hover:underline font-medium">
              Join the Patreon community
            </a>{" "}
            for deeper insights and exclusive updates.
          </p>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
