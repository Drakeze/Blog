import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export class SubscriberError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

export type SubscriberInput = {
  email: string
  name?: string
  source?: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function addSubscriber(input: SubscriberInput) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(input.email)) {
    throw new SubscriberError("Please provide a valid email address.", 400)
  }

  const email = normalizeEmail(input.email)

  try {
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name: input.name?.trim() || undefined,
        source: input.source?.trim() || undefined,
      },
    })

    return subscriber
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new SubscriberError("You are already subscribed.", 409)
    }
    throw error
  }
}
