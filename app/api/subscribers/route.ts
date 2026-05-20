import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongo"
import { requireAdmin } from "@/lib/auth"
import type { Subscriber } from "@/models/subscriber"
import crypto from "crypto"

// GET: admin list all subscribers
export async function GET() {
  try {
    await requireAdmin()
    const db = await getDb()
    const subscribers = await db
      .collection<Subscriber>("subscribers")
      .find()
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json(subscribers)
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
  }
}

// POST: subscribe (account or email)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    let email: string | undefined = body.email
    let userId: string | undefined

    // If user is signed in, use their account email
    const { userId: clerkUserId } = await auth()
    if (clerkUserId) {
      const user = await currentUser()
      email = user?.emailAddresses[0]?.emailAddress ?? email
      userId = clerkUserId
    }

    if (!email || !email.includes("@")) {
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

    await db.collection<Subscriber>("subscribers").insertOne(subscriber)
    return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
