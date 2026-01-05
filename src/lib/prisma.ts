import { PrismaClient } from "@prisma/client"

import { env } from "@/lib/env"

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function createPrismaClient() {
  if (!env.DATABASE_URL) {
    const message = "DATABASE_URL is required to initialize Prisma Client."
    console.error(`[Prisma] ${message}`)
    throw new Error(message)
  }

  return new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

// Prevent creating new PrismaClient instances during dev hot reloads.
const prisma = globalThis.__prisma ?? createPrismaClient()

if (env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma
}

export function getPrismaClient() {
  return prisma
}

export { prisma }
