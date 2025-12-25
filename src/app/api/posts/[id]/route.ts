import { NextResponse } from "next/server"
import { z } from "zod"

import { PostValidationError, removePost, updatePost } from "@/data/posts"

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

type RouteParams = { id: string }

type RouteContext = { params: RouteParams }

function isValidObjectId(id: string) {
  return /^[a-f0-9]{24}$/i.test(id)
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = params
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const updated = await updatePost(id, body)

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return formatError(error)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = params
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 })
  }

  const removed = await removePost(id)

  if (!removed) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
