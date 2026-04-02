import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"

import { addSubscriber, SubscriberError } from "@/data/subscribers"
import { authConfig } from "@/lib/env"
import { sendSubscriptionConfirmationEmail } from "@/lib/email"
import { rateLimitByIp } from "@/lib/rate-limit"

const subscribeRequestSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
})

export async function POST(request: Request) {
  const limiterResult = await rateLimitByIp({ request, maxRequests: 5, windowSeconds: 60 })
  if (!limiterResult.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again soon." }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const parsedBody = subscribeRequestSchema.safeParse(body)
  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error.errors[0].message }, { status: 400 })
  }

  let clerkUserId: string | undefined

  if (authConfig.clerkEnabled) {
    const { userId } = await auth()
    clerkUserId = userId ?? undefined
  }

  try {
    const { created, subscriber } = await addSubscriber({
      email: parsedBody.data.email,
      clerkUserId,
    })

    const emailDelivery = created
      ? await sendSubscriptionConfirmationEmail(subscriber.email)
      : {
          status: "skipped" as const,
          message: "Confirmation email skipped because the address is already subscribed.",
        }

    const message = created
      ? emailDelivery.status === "sent"
        ? "You're subscribed. Check your inbox for a confirmation email."
        : "You're subscribed. We could not send a confirmation email right now, but your address is saved."
      : "You're already subscribed. We kept your subscription active."

    return NextResponse.json({
      success: true,
      alreadySubscribed: !created,
      message,
      subscriber,
      emailDelivery,
    })
  } catch (error) {
    if (error instanceof SubscriberError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 })
  }
}
