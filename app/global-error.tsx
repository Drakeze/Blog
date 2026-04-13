"use client"

export const dynamic = "force-dynamic"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-6 px-6 py-16">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Thinking Outside the Box</p>
            <h1 className="text-4xl font-semibold tracking-tight">Something went wrong.</h1>
            <p className="text-base text-muted-foreground">
              The page hit an unexpected error. You can try the request again.
            </p>
          </div>
          <button
            className="rounded-full border border-border px-5 py-2 text-sm font-medium transition hover:bg-accent"
            onClick={() => reset()}
            type="button"
          >
            Try again
          </button>
          {error.digest ? <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p> : null}
        </main>
      </body>
    </html>
  )
}
