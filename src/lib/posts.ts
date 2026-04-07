import { prisma } from "@/src/lib/db"

export type CreatePostInput = {
  title: string
  slug: string
  content: string
  published?: boolean
}

export type BlogPostRecord = {
  title: string
  slug: string
  content: string
  published: boolean
  createdAt: Date
}

function requireValue(value: string, fieldName: "title" | "slug" | "content") {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new Error(`Missing required field: ${fieldName}`)
  }

  return normalizedValue
}

function toBlogPostRecord(post: {
  title: string
  slug: string
  content: string
  status: string
  createdAt: Date
}): BlogPostRecord {
  return {
    title: post.title,
    slug: post.slug,
    content: post.content,
    published: post.status === "published",
    createdAt: post.createdAt,
  }
}

export async function createPost(input: CreatePostInput): Promise<BlogPostRecord> {
  const title = requireValue(input.title, "title")
  const slug = requireValue(input.slug, "slug")
  const content = requireValue(input.content, "content")

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      status: input.published ? "published" : "draft",
    },
    select: {
      title: true,
      slug: true,
      content: true,
      status: true,
      createdAt: true,
    },
  })

  return toBlogPostRecord(post)
}

export async function fetchPosts(): Promise<BlogPostRecord[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
      slug: true,
      content: true,
      status: true,
      createdAt: true,
    },
  })

  return posts.map(toBlogPostRecord)
}

export async function fetchPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  const normalizedSlug = slug.trim()

  if (!normalizedSlug) {
    return null
  }

  const post = await prisma.post.findUnique({
    where: { slug: normalizedSlug },
    select: {
      title: true,
      slug: true,
      content: true,
      status: true,
      createdAt: true,
    },
  })

  return post ? toBlogPostRecord(post) : null
}
