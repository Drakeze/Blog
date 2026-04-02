import Link from "next/link"

import { Button } from "@/components/ui/button"

type AdminUnauthorizedPageProps = {
  searchParams: Promise<{ reason?: string }>
}

const contentByReason = {
  forbidden: {
    title: "Admin access denied",
    description:
      "You're signed in, but this account is not on the admin allowlist. Add the email to CLERK_ADMIN_EMAILS or the user ID to CLERK_ADMIN_USER_IDS to grant access.",
  },
  "not-configured": {
    title: "Admin setup incomplete",
    description:
      "Clerk is not fully configured for admin access yet. Set Clerk keys and an explicit admin allowlist before using /admin.",
  },
}

export default async function AdminUnauthorizedPage({ searchParams }: AdminUnauthorizedPageProps) {
  const { reason } = await searchParams
  const content =
    contentByReason[reason as keyof typeof contentByReason] ?? contentByReason["not-configured"]

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
      <h1 className="mb-4 text-4xl font-serif font-bold tracking-tight">{content.title}</h1>
      <p className="mb-8 text-muted-foreground">{content.description}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full bg-transparent">
          <Link href="/sign-in">Open sign-in</Link>
        </Button>
      </div>
    </div>
  )
}
