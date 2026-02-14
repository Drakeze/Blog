import { MongoServerError } from "mongodb"

import { getDb } from "@/lib/mongo"

export class SubscriberError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

export type SubscriberInput = {
  email: string
  name?: string
  source?: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function addSubscriber(input: SubscriberInput) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(input.email)) {
    throw new SubscriberError("Please provide a valid email address.", 400)
  }

  const db = await getDb()
  const collection = db.collection("subscribers")
  await collection.createIndex({ email: 1 }, { unique: true })

  const now = new Date()
  const email = normalizeEmail(input.email)

  try {
    const result = await collection.insertOne({
      email,
      name: input.name?.trim() || null,
      source: input.source?.trim() || null,
      createdAt: now,
      updatedAt: now,
    })

    return {
      id: result.insertedId.toString(),
      email,
      name: input.name?.trim() || null,
      source: input.source?.trim() || null,
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
