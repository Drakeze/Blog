import { NextResponse } from "next/server"

import { addSubscriber, SubscriberError } from "@/data/subscribers"
import { rateLimitByIp } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const limiterResult = await rateLimitByIp({ request, maxRequests: 5, windowSeconds: 60 })
  if (!limiterResult.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again soon." }, { status: 429 })
  }

  const body = await request.json()
  const { name, email, source } = body ?? {}

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  const trimmedEmail = email.trim().toLowerCase()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(trimmedEmail)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
  }

  try {
    const subscriber = await addSubscriber({
      email: trimmedEmail,
      name: typeof name === "string" ? name.trim() : undefined,
      source: typeof source === "string" ? source.trim() : undefined,
    })

    return NextResponse.json({ success: true, subscriber })
  } catch (error) {
    if (error instanceof SubscriberError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 })
  }
}
