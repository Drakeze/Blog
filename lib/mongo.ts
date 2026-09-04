import { MongoClient, type MongoClientOptions } from "mongodb"
import { env } from "./env"

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// ponytail: shared-tier Atlas briefly loses its primary / throttles under load.
// The driver already retries reads — the real bug was a module-scope
// `connect()` whose rejection became an unhandledRejection and poisoned the
// whole lambda (every later getDb() then inherited the rejected promise). So:
// connect lazily on first use, cache the promise on `global` (survives warm
// invocations and dev HMR alike), and drop the cache if the connect fails so
// the next request retries with a fresh attempt.
const options: MongoClientOptions = {
  maxPoolSize: 10, // serverless: many short-lived instances — keep each pool small
  serverSelectionTimeoutMS: 10_000, // fail within the function budget, don't hang ~30s
  connectTimeoutMS: 10_000,
}

function connect(): Promise<MongoClient> {
  const promise = new MongoClient(env.DATABASE_URL, options).connect()
  // Handle rejection here too (no unhandledRejection) and clear the cache so a
  // transient outage doesn't stick for the life of the instance.
  promise.catch(() => {
    if (global._mongoClientPromise === promise) global._mongoClientPromise = undefined
  })
  return promise
}

export const BLOG_DB_NAME = "blog_db"

export const blogCollectionNames = {
  posts: "posts",
  subscribers: "subscribers",
} as const

export async function getDb() {
  global._mongoClientPromise ??= connect()
  const client = await global._mongoClientPromise
  return client.db()
}
