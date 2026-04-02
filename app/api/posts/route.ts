import { NextResponse } from "next/server"
import { z } from "zod"

import { addPost, filterPosts, type PostSource, type PostStatus, PostValidationError } from "@/data/posts"
import { emailConfig } from "@/lib/env"
import { sendPostEmailToSubscribers } from "@/lib/email"
import { requireAdminRequest } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const querySchema = z
  .object({
    tag: z.string().trim().optional(),
    createdAt: z.string().trim().optional(),
    readTimeMinutes: z.coerce.number().int().positive().optional(),
    source: z.enum(["blog", "reddit"]).optional(),
    status: z.enum(["draft", "published", "all"]).optional(),
  })
  .strict()

function formatError(error: unknown) {
  if (error instanceof PostValidationError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof z.ZodError) {
    const message = error.errors.map((issue) => issue.message).join(" ")
    return NextResponse.json({ error: message }, { status: 400 })
  }

  return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
}

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries())
  const parsed = querySchema.safeParse(params)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  const { status, source, ...filters } = parsed.data
  const includeDrafts = status === "all" || status === "draft"

  if (includeDrafts) {
    const authResult = await requireAdminRequest()
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const filtered = await filterPosts(
    {
      ...filters,
      source: source as PostSource | undefined,
      status: status && status !== "all" ? (status as PostStatus) : undefined,
    },
    includeDrafts,
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const summaries = filtered.map(({ content, ...summary }) => summary)

  return NextResponse.json(summaries)
}

export async function POST(request: Request) {
  const authResult = await requireAdminRequest()
  if (!authResult.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const newPost = await addPost(body)
    const shouldNotifySubscribers =
      (typeof body?.notifySubscribers === "boolean"
        ? body.notifySubscribers
        : emailConfig.autoSendPostEmails) &&
      newPost.status === "published" &&
      newPost.source === "blog"

    const newsletterDelivery = shouldNotifySubscribers
      ? await sendPostEmailToSubscribers(newPost)
      : {
          status: "skipped" as const,
          message: "Subscriber email delivery was not requested for this post.",
          totalSubscribers: 0,
          sentCount: 0,
          failedCount: 0,
          failures: [],
        }

    return NextResponse.json({ post: newPost, newsletterDelivery }, { status: 201 })
  } catch (error) {
    return formatError(error)
  }
}
