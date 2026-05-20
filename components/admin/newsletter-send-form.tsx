"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Send, Loader2 } from "lucide-react"

interface Props {
  posts: { slug: string; title: string; _id: string }[]
}

export function NewsletterSendForm({ posts }: Props) {
  const [selectedSlug, setSelectedSlug] = useState("")
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null)

  async function handleSend() {
    if (!selectedSlug) { toast.error("Select a post first"); return }
    setSending(true)
    setResult(null)
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedSlug }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? "Failed to send"); return }
      setResult(data)
      toast.success(`Sent to ${data.sent} subscribers`)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-border p-6">
      <div className="space-y-1.5">
        <Label htmlFor="post-select">Select Post</Label>
        <select
          id="post-select"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">— choose a published post —</option>
          {posts.map((p) => (
            <option key={p._id} value={p.slug}>{p.title}</option>
          ))}
        </select>
      </div>

      <Button onClick={handleSend} disabled={sending || !selectedSlug} className="w-full">
        {sending
          ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending…</>
          : <><Send className="h-4 w-4 mr-2" />Send Newsletter</>
        }
      </Button>

      {result && (
        <div className="rounded-md bg-muted p-4 text-sm space-y-1">
          <p><span className="font-medium">{result.sent}</span> sent successfully</p>
          {result.failed > 0 && <p className="text-destructive"><span className="font-medium">{result.failed}</span> failed</p>}
          <p className="text-muted-foreground">{result.total} total subscribers</p>
        </div>
      )}

      {posts.length === 0 && (
        <p className="text-sm text-muted-foreground">No published posts yet.</p>
      )}
    </div>
  )
}
