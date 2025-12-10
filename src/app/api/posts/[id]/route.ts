import { NextResponse } from "next/server"

import { PostValidationError, removePost, updatePost } from "@/data/posts"

function formatError(error: unknown) {
  if (error instanceof PostValidationError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
}

type RouteParams = { id: string }

type RouteContext = { params: RouteParams }

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = params
  const postId = Number(id)

  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const updated = updatePost(postId, body)

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
  const postId = Number(id)

  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 })
  }

  const removed = removePost(postId)

  if (!removed) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
