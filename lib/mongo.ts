import { MongoClient } from "mongodb"
import { env } from "./env"

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(env.DATABASE_URL).connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = new MongoClient(env.DATABASE_URL).connect()
}

export default clientPromise

export async function getDb() {
  const client = await clientPromise
  return client.db()
}
