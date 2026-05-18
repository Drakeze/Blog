import { Db, MongoClient } from "mongodb"

import { databaseConfig } from "@/lib/env"

export const BLOG_DB_NAME = "blog_db"
export const blogCollectionNames = {
  posts: "blog_post",
  subscribers: "blog_subscribers",
} as const

// Global is used here to prevent creating multiple connections
// during hot reloads in development.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise() {
  if (!databaseConfig.connectionString) {
    throw new Error("DATABASE_URL is required to connect to MongoDB in production.")
  }

  // Cache the client promise globally so serverless functions reuse the same
  // connection instead of opening a new TCP connection on every request.
  if (!global._mongoClientPromise) {
    const client = new MongoClient(databaseConfig.connectionString, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })
    global._mongoClientPromise = client.connect()
  }

  return global._mongoClientPromise
}

/**
 * Get a connected MongoDB database instance.
 * No collections, no models, no assumptions.
 */
export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(BLOG_DB_NAME)
}
