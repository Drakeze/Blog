import { MongoServerError } from "mongodb"
import { z } from "zod"

import { getDb } from "@/lib/mongo"

export class SubscriberError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

const subscriberInputSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  name: z.string().trim().max(120).optional(),
  source: z.string().trim().max(80).optional(),
  clerkUserId: z.string().trim().max(120).optional(),
})

export type SubscriberInput = z.input<typeof subscriberInputSchema>

export type SubscriberRecord = {
  id: string
  email: string
  name: string | null
  source: string | null
  clerkUserId: string | null
  createdAt: string
  updatedAt: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeName(name?: string) {
  return name?.trim() || null
}

function normalizeSource(source?: string) {
  return source?.trim() || null
}

function normalizeClerkUserId(clerkUserId?: string) {
  return clerkUserId?.trim() || null
}

function mapSubscriber(document: {
  _id: { toString(): string }
  email: string
  name?: string | null
  source?: string | null
  clerkUserId?: string | null
  createdAt: Date
  updatedAt: Date
}): SubscriberRecord {
  return {
    id: document._id.toString(),
    email: document.email,
    name: document.name ?? null,
    source: document.source ?? null,
    clerkUserId: document.clerkUserId ?? null,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  }
}

export async function addSubscriber(input: SubscriberInput) {
  const parsed = subscriberInputSchema.safeParse(input)
  if (!parsed.success) {
    throw new SubscriberError(parsed.error.errors[0].message, 400)
  }

  const db = await getDb()
  const collection = db.collection("subscribers")
  await collection.createIndex({ email: 1 }, { unique: true })
  await collection.createIndex({ clerkUserId: 1 }, { sparse: true })

  const now = new Date()
  const email = normalizeEmail(parsed.data.email)

  try {
    const result = await collection.insertOne({
      email,
      name: normalizeName(parsed.data.name),
      source: normalizeSource(parsed.data.source),
      clerkUserId: normalizeClerkUserId(parsed.data.clerkUserId),
      createdAt: now,
      updatedAt: now,
    })

    return {
      id: result.insertedId.toString(),
      email,
      name: normalizeName(parsed.data.name),
      source: normalizeSource(parsed.data.source),
      clerkUserId: normalizeClerkUserId(parsed.data.clerkUserId),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new SubscriberError("You are already subscribed.", 409)
    }
    throw error
  }
}

export async function listSubscribers(limit = 200): Promise<SubscriberRecord[]> {
  const db = await getDb()
  const collection = db.collection("subscribers")
  const docs = await collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray()
  return docs.map((doc) => mapSubscriber(doc as never))
}
