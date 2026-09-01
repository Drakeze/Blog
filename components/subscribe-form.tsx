"use client"

import { useId, useState } from "react"
import posthog from "posthog-js"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

async function subscribe(
  body: Record<string, unknown>,
  method: "email_form" | "one_click",
): Promise<boolean> {
  const res = await fetch("/api/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    toast.error(data.error ?? "Failed to subscribe")
    return false
  }
  if (data.message === "Already subscribed") {
    toast("You’re already on the list.")
    return true
  }
  posthog.capture("newsletter_subscribed", { method })
  toast.success("You're subscribed!")
  return true
}

export function SubscribeForm({ userId }: { userId?: string }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const inputId = useId()

  async function run(body: Record<string, unknown>, method: "email_form" | "one_click") {
    setLoading(true)
    try {
      if (await subscribe(body, method)) setDone(true)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <p className="text-sm text-muted-foreground">
        You&apos;re subscribed. New posts will land in your inbox.
      </p>
    )
  }

  // Signed-in users subscribe with one click (email comes from their account server-side)
  if (userId) {
    return (
      <Button onClick={() => run({}, "one_click")} disabled={loading} size="sm">
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Subscribe to newsletter
      </Button>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        run({ email }, "email_form")
      }}
      className="flex gap-2"
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <Input
        id={inputId}
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="max-w-xs"
      />
      <Button type="submit" disabled={loading} size="sm">
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Subscribe
      </Button>
    </form>
  )
}
