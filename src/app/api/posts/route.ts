import { NextResponse } from "next/server"
import { z } from "zod"

import { addPost, filterPosts, PostValidationError, type PostStatus } from "@/data/posts"
import { requireAdminRequest } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const querySchema = z
  .object({
    tag: z.string().trim().optional(),
    createdAt: z.string().trim().optional(),
    readTimeMinutes: z.coerce.number().int().positive().optional(),
    source: z.string().trim().optional(),
    status: z.string().trim().optional(),
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

  const { status, ...filters } = parsed.data
  const includeDrafts = status === "all" || status === "draft"
  const filtered = await filterPosts(
    {
      ...filters,
      status: status && status !== "all" ? (status as PostStatus) : undefined,
    },
    includeDrafts,
  )
  const summaries = filtered.map(({ content, ...summary }) => summary)

  return NextResponse.json(summaries)
}

export async function POST(request: Request) {
  const authResult = await requireAdminRequest(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const newPost = await addPost(body)
    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return formatError(error)
  }
}
