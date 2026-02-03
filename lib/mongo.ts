// src/lib/mongo.ts
import { Db, MongoClient } from "mongodb"

// Support both MONGODB_URI (legacy) and DATABASE_URL (Prisma standard)
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI or DATABASE_URL environment variable")
}

// Global is used here to prevent creating multiple connections
// during hot reloads in development.
declare global {
   
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

/**
 * Get a connected MongoDB database instance.
 * No collections, no models, no assumptions.
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}
