import { Db, MongoClient } from "mongodb"

import { env } from "@/lib/env"

// Support both MONGODB_URI (legacy) and DATABASE_URL (Prisma standard)
const MONGODB_URI = process.env.MONGODB_URI || env.DATABASE_URL

// Global is used here to prevent creating multiple connections
// during hot reloads in development.
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  const client = new MongoClient(MONGODB_URI)
  clientPromise = client.connect()
}

/**
 * Get a connected MongoDB database instance.
 * No collections, no models, no assumptions.
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db()
}
