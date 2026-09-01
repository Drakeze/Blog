import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongo"
import { requireAdminApi } from "@/lib/auth"
import { captureServerEvent } from "@/lib/posthog-server"
import type { Subscriber } from "@/models/subscriber"
import crypto from "crypto"

// Reasonable upper bound; RFC 5321 caps addresses at 254 chars.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// GET: admin list all subscribers
export async function GET() {
  try {
    const denied = await requireAdminApi()
    if (denied) return denied
    const db = await getDb()
    const subscribers = await db
      .collection<Subscriber>("subscribers")
      .find()
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json(subscribers)
  } catch {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
  }
}

// POST: subscribe (account or email)
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    let email: string | undefined = typeof body.email === "string" ? body.email : undefined
    let userId: string | undefined

    // If user is signed in, use their account email
    const { userId: clerkUserId } = await auth()
    if (clerkUserId) {
      const user = await currentUser()
      email = user?.emailAddresses[0]?.emailAddress ?? email
      userId = clerkUserId
    }

    email = email?.trim().toLowerCase()
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const db = await getDb()
    const existing = await db.collection<Subscriber>("subscribers").findOne({ email })
    if (existing) {
      return NextResponse.json({ message: "Already subscribed" })
    }

    const subscriber: Subscriber = {
      email,
      userId,
      confirmed: true,
      unsubscribeToken: crypto.randomUUID(),
      createdAt: new Date(),
    }

    try {
      await db.collection<Subscriber>("subscribers").insertOne(subscriber)
    } catch (err) {
      // Unique index on email — a racing duplicate submit lands here.
      if (err && typeof err === "object" && "code" in err && err.code === 11000) {
        return NextResponse.json({ message: "Already subscribed" })
      }
      throw err
    }

    captureServerEvent({
      distinctId: userId ?? email,
      event: "server_newsletter_subscribed",
      properties: { email, is_authenticated: !!userId },
    })

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
