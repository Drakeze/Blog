import { NextResponse } from "next/server"

import { addPost, filterPosts, type PostSource, type PostStatus } from "@/data/posts"

function parseSource(value: string | null): PostSource | undefined {
  if (value === "blog" || value === "reddit" || value === "twitter" || value === "linkedin" || value === "patreon") {
    return value
  }
  return undefined
}

function parseStatus(value: string | null): PostStatus | undefined {
  if (value === "draft" || value === "published") {
    return value
  }
  return undefined
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get("tag") ?? undefined
  const createdAt = searchParams.get("createdAt") ?? undefined
  const readTimeParam = searchParams.get("readTimeMinutes")
  const readTimeMinutes = readTimeParam ? Number.parseInt(readTimeParam, 10) : undefined
  const source = parseSource(searchParams.get("source"))
  const statusParam = searchParams.get("status")
  const status = parseStatus(statusParam)
  const includeDrafts = statusParam === "all" || status === "draft"

  const filtered = filterPosts({ tag, createdAt, readTimeMinutes, source, status }, includeDrafts)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const summaries = filtered.map(({ content, ...summary }) => summary)

  return NextResponse.json(summaries)
}

export async function POST(request: Request) {
  const body = await request.json()
  const status = parseStatus(body.status) ?? 'draft'

  const newPost = addPost({
    title: body.title ?? "Untitled Post",
    excerpt: body.excerpt ?? "",
    content: body.content ?? "",
    category: body.category ?? "General",
    tags: Array.isArray(body.tags) ? body.tags : [],
    readTimeMinutes: Number.isFinite(body.readTimeMinutes)
      ? Number(body.readTimeMinutes)
      : Number.parseInt(body.readTimeMinutes ?? "5", 10) || 5,
    createdAt: body.createdAt ?? undefined,
    slug: body.slug ?? undefined,
    source: parseSource(body.source) ?? "blog",
    sourceURL: body.sourceURL ?? undefined,
    heroImage: body.heroImage ?? undefined,
    externalID: body.externalID ?? undefined,
    status,
  })

  return NextResponse.json(newPost, { status: 201 })
}
