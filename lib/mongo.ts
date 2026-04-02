import { Db, MongoClient } from "mongodb"

import { databaseConfig } from "@/lib/env"

// Global is used here to prevent creating multiple connections
// during hot reloads in development.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise() {
  if (!databaseConfig.connectionString) {
    throw new Error("DATABASE_URL is required to connect to MongoDB in production.")
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(databaseConfig.connectionString)
      global._mongoClientPromise = client.connect()
    }

    return global._mongoClientPromise
  }

  const client = new MongoClient(databaseConfig.connectionString)
  return client.connect()
}

/**
 * Get a connected MongoDB database instance.
 * No collections, no models, no assumptions.
 */
export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db()
}
