"use client"

import { useMutation } from "@tanstack/react-query"
import { Github, Linkedin, Loader2, Twitter } from "lucide-react"
import { useState } from "react"

import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function SubscribeForm() {
  const [email, setEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const subscribeMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json()) as { error?: string; message?: string }
      if (!response.ok) throw new Error(data.error ?? "Unable to subscribe")
      return data
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message ?? "You're subscribed.")
      setEmail("")
    },
  })

  return (
    <>
      <div className="mb-8 rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-sm md:p-8">
        <h2 className="mb-2 text-2xl font-semibold">Email-only subscription</h2>
        <p className="text-muted-foreground">
          No account is required on the public site. Enter your email and you&apos;ll be added to the newsletter list stored in MongoDB.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-sm md:p-12">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            setSuccessMessage(null)
            subscribeMutation.mutate({ email })
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-12 rounded-xl"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="h-12 w-full rounded-xl text-base" disabled={subscribeMutation.isPending}>
            {subscribeMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</> : "Subscribe"}
          </Button>
          {successMessage ? (
            <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p>
          ) : null}
          {subscribeMutation.isError && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{(subscribeMutation.error as Error).message}</p>}
        </form>
      </div>
    </>
  )
}

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="mx-auto max-w-4xl px-4 py-20 md:px-6">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-secondary md:text-6xl">Subscribe to new posts</h1>
          <p className="text-lg text-muted-foreground text-balance md:text-xl">Get blog updates by email without creating an account or seeing a public sign-in flow.</p>
        </div>

        <SubscribeForm />

        <div className="mt-12 rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center shadow-sm md:p-10">
          <h2 className="mb-3 text-2xl font-semibold">Want deeper breakdowns?</h2>
          <p className="mb-6 text-muted-foreground">
            I share more in-depth builds, behind-the-scenes thinking, and full project breakdowns on Patreon.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full px-6">
              <a href="https://www.patreon.com/SorenTech" target="_blank" rel="noopener noreferrer">
                View Patreon
              </a>
            </Button>
            <p className="text-sm text-muted-foreground">
              Free and paid tiers available
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="mb-4 text-muted-foreground">Connect with me:</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent shadow-sm" asChild><a href="https://x.com/SorenIdeas" target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /><span className="sr-only">Twitter/X</span></a></Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent shadow-sm" asChild><a href="https://www.linkedin.com/in/anthonyshead/" target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /><span className="sr-only">LinkedIn</span></a></Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent shadow-sm" asChild><a href="https://github.com/Drakeze" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /><span className="sr-only">GitHub</span></a></Button>
          </div>
        </div>
      </main>
      <BlogFooter />
    </div>
  )
}
