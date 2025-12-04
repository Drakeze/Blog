import { NextResponse } from "next/server"

import { addPost, filterPosts, type PostStatus } from "@/data/posts"

function parseStatus(value: string | null): PostStatus | undefined {
  if (value === "draft" || value === "published") {
    return value
  }
  return undefined
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get("tag") ?? undefined
  const date = searchParams.get("date") ?? undefined
  const readTimeParam = searchParams.get("readTimeMinutes")
  const readTimeMinutes = readTimeParam ? Number.parseInt(readTimeParam, 10) : undefined
  const status = parseStatus(searchParams.get("status"))

  const filtered = filterPosts({ tag, date, readTimeMinutes, status })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const summaries = filtered.map(({ content, ...summary }) => summary)

  return NextResponse.json(summaries)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newPost = addPost({
    title: body.title ?? "Untitled Post",
    excerpt: body.excerpt ?? "",
    content: body.content ?? "",
    category: body.category ?? "General",
    tags: Array.isArray(body.tags) ? body.tags : [],
    author: body.author ?? "Content Team",
    readTimeMinutes: Number.isFinite(body.readTimeMinutes)
      ? Number(body.readTimeMinutes)
      : Number.parseInt(body.readTimeMinutes ?? "5", 10) || 5,
    date: body.date ?? undefined,
    socialLinks: body.socialLinks,
    status: parseStatus(body.status) ?? "draft",
    slug: body.slug ?? undefined,
    originalUrl: body.originalUrl ?? undefined,
  })

  return NextResponse.json(newPost, { status: 201 })
}
