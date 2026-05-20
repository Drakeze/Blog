"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export function SubscribeForm({ userId }: { userId?: string }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok && res.status !== 200) {
        toast.error(data.error ?? "Failed to subscribe")
        return
      }
      setDone(true)
      toast.success("You're subscribed!")
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
    async function handleClick() {
      setLoading(true)
      try {
        const res = await fetch("/api/subscribers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
        const data = await res.json()
        if (!res.ok && res.status !== 200) { toast.error(data.error ?? "Failed to subscribe"); return }
        setDone(true)
        toast.success("You're subscribed!")
      } catch {
        toast.error("Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    return (
      <Button
        onClick={handleClick}
        disabled={loading}
        size="sm"
      >
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Subscribe to newsletter
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
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
