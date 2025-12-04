import { NextResponse } from "next/server"

import { addPost, filterPosts, type PostSource, type PostStatus } from "@/data/posts"

function parseStatus(value: string | null): PostStatus | undefined {
  if (value === "draft" || value === "published") {
    return value
  }
  return undefined
}

function parseSource(value: string | null): PostSource | undefined {
  if (value === "blog" || value === "twitter" || value === "linkedin" || value === "reddit" || value === "patreon") {
    return value
  }
  return undefined
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get("tag") ?? undefined
  const status = parseStatus(searchParams.get("status"))
  const source = parseSource(searchParams.get("source"))
  const search = searchParams.get("search") ?? undefined

  const filtered = filterPosts({ tag, status, source, search })
  const summaries = filtered.map(({ content, ...summary }) => summary)

  return NextResponse.json(summaries)
}

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const readTimeMinutes = Number.isFinite(body.readTimeMinutes)
      ? Number(body.readTimeMinutes)
      : Number.parseInt(body.readTimeMinutes ?? "", 10)

    const newPost = addPost({
      title: body.title ?? "Untitled Post",
      excerpt: body.excerpt ?? "",
      content: body.content ?? "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      author: body.author ?? "Content Team",
      readTimeMinutes: Number.isFinite(readTimeMinutes) ? readTimeMinutes : undefined,
      status: parseStatus(body.status) ?? "draft",
      slug: body.slug ?? undefined,
      source: parseSource(body.source) ?? body.source,
      sourceUrl: body.sourceUrl ?? undefined,
      heroImage: body.heroImage ?? undefined,
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create post"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
