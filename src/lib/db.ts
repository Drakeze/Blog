import { PrismaClient } from "@prisma/client"

declare global {
  var prismaGlobal: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL")
}

export const prisma = globalThis.prismaGlobal ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
}

export default prisma
