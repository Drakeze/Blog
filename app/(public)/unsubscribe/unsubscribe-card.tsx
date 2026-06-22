"use client"

import { useState } from "react"
import posthog from "posthog-js"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2, MailX, CheckCircle, AlertCircle } from "lucide-react"

type State = "confirm" | "loading" | "success" | "error"

interface Props {
  token?: string
}

export function UnsubscribeCard({ token }: Props) {
  const [state, setState] = useState<State>("confirm")
  const [errorMessage, setErrorMessage] = useState("")

  if (!token) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Invalid unsubscribe link</h1>
        <p className="text-sm text-muted-foreground">
          This link appears to be broken or expired.
        </p>
        <Button variant="outline" asChild>
          <Link href="/">Back to blog</Link>
        </Button>
      </div>
    )
  }

  async function handleConfirm() {
    setState("loading")
    try {
      const res = await fetch("/api/subscribers/unsubscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      if (res.ok) {
        setState("success")
        posthog.capture("newsletter_unsubscribed")
      } else {
        const data = await res.json()
        setErrorMessage(data.error ?? "Something went wrong")
        setState("error")
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
      setState("error")
    }
  }

  if (state === "success") {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
        <h1 className="text-xl font-semibold">You&apos;ve been unsubscribed</h1>
        <p className="text-sm text-muted-foreground">
          You&apos;ll no longer receive newsletter emails. You can re-subscribe any time from any post page.
        </p>
        <Button variant="outline" asChild>
          <Link href="/">Back to blog</Link>
        </Button>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="text-xl font-semibold">Unsubscribe failed</h1>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => setState("confirm")}>
            Try again
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Back to blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md text-center space-y-4">
      <MailX className="mx-auto h-10 w-10 text-muted-foreground" />
      <h1 className="text-xl font-semibold">Unsubscribe from newsletter</h1>
      <p className="text-sm text-muted-foreground">
        You&apos;ll stop receiving new post notifications. You can re-subscribe any time from any post page.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Button
          variant="destructive"
          onClick={handleConfirm}
          disabled={state === "loading"}
        >
          {state === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Yes, unsubscribe me
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Keep me subscribed</Link>
        </Button>
      </div>
    </div>
  )
}
