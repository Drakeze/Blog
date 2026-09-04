"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold">Couldn’t load this post</h1>
      <p className="text-sm text-muted-foreground">
        Something went wrong rendering this post. It’s probably temporary.
      </p>
      <div className="flex items-center gap-2">
        <Button onClick={reset} size="sm">Try again</Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Back to all posts</Link>
        </Button>
      </div>
    </div>
  )
}
