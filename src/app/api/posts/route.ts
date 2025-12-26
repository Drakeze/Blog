import { NextResponse } from "next/server"
import { z } from "zod"

import { Prisma } from "@prisma/client"

import { addPost, filterPosts, PostValidationError, type PostStatus } from "@/data/posts"

const querySchema = z
  .object({
    tag: z.string().trim().optional(),
    createdAt: z.string().trim().optional(),
    readTimeMinutes: z.coerce.number().int().positive().optional(),
    source: z.nativeEnum(Prisma.PostSource).optional(),
    status: z.union([z.nativeEnum(Prisma.PostStatus), z.literal("all")]).optional(),
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
  const includeDrafts = status === "all" || status === Prisma.PostStatus.draft
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
  try {
    const body = await request.json()
    const newPost = await addPost(body)
    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return formatError(error)
  }
}
