import Link from "next/link"

export const dynamic = "force-dynamic"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Thinking Outside the Box</p>
        <h1 className="text-4xl font-semibold tracking-tight">Page not found.</h1>
        <p className="text-base text-muted-foreground">
          The page you were looking for does not exist or may have moved.
        </p>
      </div>
      <Link
        className="rounded-full border border-border px-5 py-2 text-sm font-medium transition hover:bg-accent"
        href="/"
      >
        Back to home
      </Link>
    </main>
  )
}
