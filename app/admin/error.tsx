"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-xl font-semibold">Dashboard error</h1>
      <p className="text-sm text-muted-foreground">{error.message || "Something went wrong."}</p>
      <Button onClick={reset} size="sm">Retry</Button>
    </div>
  )
}
