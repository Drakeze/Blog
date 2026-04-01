import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { addSubscriber, SubscriberError } from "@/data/subscribers"
import { authConfig } from "@/lib/env"
import { rateLimitByIp } from "@/lib/rate-limit"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function POST(request: Request) {
  const limiterResult = await rateLimitByIp({ request, maxRequests: 5, windowSeconds: 60 })
  if (!limiterResult.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again soon." }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const { name, email, source } = body ?? {}

  const providedEmail = typeof email === "string" ? normalizeEmail(email) : ""

  let clerkUserId: string | undefined
  let clerkEmail: string | undefined
  let clerkName: string | undefined

  if (authConfig.clerkEnabled) {
    const { userId } = await auth()
    clerkUserId = userId ?? undefined

    if (clerkUserId) {
      const user = await currentUser()
      const primaryEmail = user?.primaryEmailAddress?.emailAddress
      const fallbackEmail = user?.emailAddresses[0]?.emailAddress
      clerkEmail = (primaryEmail ?? fallbackEmail)?.toLowerCase()
      clerkName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || undefined
    }
  }

  const resolvedEmail = providedEmail || clerkEmail

  if (!resolvedEmail) {
    return NextResponse.json({ error: "Email is required. Sign in or enter an email." }, { status: 400 })
  }

  try {
    const subscriber = await addSubscriber({
      email: resolvedEmail,
      name: typeof name === "string" ? name.trim() || undefined : clerkName,
      source: typeof source === "string" ? source.trim() || undefined : "subscribe-page",
      clerkUserId,
    })

    return NextResponse.json({ success: true, subscriber })
  } catch (error) {
    if (error instanceof SubscriberError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 })
  }
}
