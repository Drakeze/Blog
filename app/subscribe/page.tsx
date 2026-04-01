"use client"

import { SignInButton, SignUpButton, useAuth, useUser } from "@clerk/nextjs"
import { useMutation } from "@tanstack/react-query"
import { CheckCircle2, Github, Linkedin, Loader2, Twitter } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

function SubscribeFormWithClerk() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const { userId } = useAuth()
  const { user } = useUser()

  const primaryEmail = useMemo(() => user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? "", [user])

  useEffect(() => {
    if (!userId) return
    if (primaryEmail) setEmail(primaryEmail)
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ")
    if (fullName) setName(fullName)
  }, [primaryEmail, user?.firstName, user?.lastName, userId])

  return <SubscribeForm name={name} email={email} setName={setName} setEmail={setEmail} userId={userId ?? ""} primaryEmail={primaryEmail} />
}

function SubscribeFormWithoutClerk() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  return <SubscribeForm name={name} email={email} setName={setName} setEmail={setEmail} userId="" primaryEmail="" />
}

function SubscribeForm({
  name,
  email,
  setName,
  setEmail,
  userId,
  primaryEmail,
}: {
  name: string
  email: string
  setName: (value: string) => void
  setEmail: (value: string) => void
  userId: string
  primaryEmail: string
}) {
  const subscribeMutation = useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: userId ? "authenticated-subscribe" : "guest-subscribe" }),
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(data.error ?? "Unable to subscribe")
      return data
    },
    onSuccess: () => {
      if (!userId) {
        setName("")
        setEmail("")
      }
    },
  })

  return (
    <>
      <div className="mb-8 rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-sm md:p-8">
        <h2 className="mb-2 text-2xl font-semibold">One clear flow: account + updates</h2>
        <p className="text-muted-foreground">Create an account to manage your profile, then join the update list with one click.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {clerkEnabled && !userId ? (
            <>
              <SignUpButton mode="modal"><Button className="rounded-full">Create account</Button></SignUpButton>
              <SignInButton mode="modal"><Button variant="outline" className="rounded-full bg-transparent">Sign in</Button></SignInButton>
            </>
          ) : userId ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Signed in as {primaryEmail}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Account sign-in is currently disabled. You can still join with email.</p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-sm md:p-12">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); subscribeMutation.mutate({ name, email }) }}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">Name (optional)</Label>
            <Input id="name" type="text" placeholder="Your name" className="h-12 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required className="h-12 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" size="lg" className="h-12 w-full rounded-xl text-base" disabled={subscribeMutation.isPending}>
            {subscribeMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Joining…</> : "Join waitlist"}
          </Button>
          {subscribeMutation.isSuccess && <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700">You&apos;re on the list. I&apos;ll email you when new posts go live.</p>}
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
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-secondary md:text-6xl">Join the waitlist</h1>
          <p className="text-lg text-muted-foreground text-balance md:text-xl">Subscribe for new posts, product updates, and build-in-public progress.</p>
        </div>

        {clerkEnabled ? <SubscribeFormWithClerk /> : <SubscribeFormWithoutClerk />}

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Clerk handles identity. Waitlist subscriptions are stored in your database for future notifications.</p>
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
