import { PrismaClient } from "@prisma/client"

import { env } from "@/lib/env"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prismaClient: PrismaClient | undefined

function createPrismaClient() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to initialize Prisma Client.")
  }

  return new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export function getPrismaClient() {
  if (env.NODE_ENV !== "production") {
    if (!globalThis.prisma) {
      globalThis.prisma = createPrismaClient()
    }
    return globalThis.prisma
  }

  if (!prismaClient) {
    prismaClient = createPrismaClient()
  }

  return prismaClient
}
