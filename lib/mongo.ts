import { MongoClient, type MongoClientOptions } from 'mongodb';

import { env } from './env';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
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
};

function connect(): Promise<MongoClient> {
  const promise = new MongoClient(env.DATABASE_URL, options).connect();
  promise.catch(() => {
    if (global._mongoClientPromise === promise) global._mongoClientPromise = undefined;
  });
  return promise;
}

/**
 * The database name is taken from the `DATABASE_URL` path — prod points at
 * `blog_db`, local + preview point at `blog_db_dev`. `getDb()` uses
 * `client.db()` with no argument so the URI stays the single source of truth.
 */
export function dbNameFromUri(uri = env.DATABASE_URL): string {
  const match = uri.match(/\/([^/?]+)(\?|$)/);
  return match?.[1] ?? '(default)';
}

export const blogCollectionNames = {
  posts: 'posts',
  subscribers: 'subscribers',
  comments: 'comments',
  likes: 'likes',
  bookmarks: 'bookmarks',
  emailLogs: 'email_logs',
  mcpActionLogs: 'mcp_action_logs',
} as const;

export async function getDb() {
  global._mongoClientPromise ??= connect();
  const client = await global._mongoClientPromise;
  return client.db();
}
