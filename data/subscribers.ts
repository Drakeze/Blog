import { z } from "zod"

import { blogCollectionNames, getDb } from "@/lib/mongo"

export class SubscriberError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

const subscriberInputSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  clerkUserId: z.string().trim().max(120).optional(),
})

export type SubscriberInput = z.input<typeof subscriberInputSchema>

export type SubscriberRecord = {
  id: string
  email: string
  clerkUserId: string | null
  createdAt: string
  updatedAt: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeClerkUserId(clerkUserId?: string) {
  return clerkUserId?.trim() || null
}

function mapSubscriber(document: {
  _id: { toString(): string }
  email: string
  clerkUserId?: string | null
  createdAt: Date
  updatedAt: Date
}): SubscriberRecord {
  return {
    id: document._id.toString(),
    email: document.email,
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
  const collection = db.collection(blogCollectionNames.subscribers)
  await collection.createIndex({ email: 1 }, { unique: true })
  await collection.createIndex({ clerkUserId: 1 }, { sparse: true })

  const now = new Date()
  const email = normalizeEmail(parsed.data.email)
  const clerkUserId = normalizeClerkUserId(parsed.data.clerkUserId)

  const existing = await collection.findOne({ email })

  if (existing) {
    const nextClerkUserId = existing.clerkUserId ?? clerkUserId

    if (nextClerkUserId !== (existing.clerkUserId ?? null)) {
      await collection.updateOne(
        { _id: existing._id },
        {
          $set: {
            clerkUserId: nextClerkUserId,
            updatedAt: now,
          },
        },
      )
    }

    const freshExisting = await collection.findOne({ _id: existing._id })
    if (!freshExisting) {
      throw new SubscriberError("Unable to load your subscription.", 500)
    }

    return {
      created: false,
      subscriber: mapSubscriber(freshExisting as never),
    }
  }

  const result = await collection.insertOne({
    email,
    clerkUserId,
    createdAt: now,
    updatedAt: now,
  })

  return {
    created: true,
    subscriber: {
      id: result.insertedId.toString(),
      email,
      clerkUserId,
      createdAt: now,
      updatedAt: now,
    },
  }
}

export async function listSubscribers(limit = 200): Promise<SubscriberRecord[]> {
  const db = await getDb()
  const collection = db.collection(blogCollectionNames.subscribers)
  const docs = await collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray()
  return docs.map((doc) => mapSubscriber(doc as never))
}

export async function countSubscribers() {
  const db = await getDb()
  const collection = db.collection(blogCollectionNames.subscribers)
  return collection.countDocuments({})
}

export async function listSubscriberEmails() {
  const db = await getDb()
  const collection = db.collection(blogCollectionNames.subscribers)
  const docs = await collection
    .find({}, { projection: { email: 1 } })
    .sort({ createdAt: -1 })
    .toArray()

  return docs
    .map((doc) => {
      const email = doc.email
      return typeof email === "string" ? email : null
    })
    .filter((email): email is string => Boolean(email))
}
