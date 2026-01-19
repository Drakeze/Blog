import { Prisma, PostSource as PrismaPostSource, PostStatus as PrismaPostStatus, type Post } from "@prisma/client"
import { z } from "zod"


export type PostSource = PrismaPostSource

export type PostStatus = PrismaPostStatus

export const postSources = Object.values(PrismaPostSource) as PostSource[]
export const postStatuses = Object.values(PrismaPostStatus) as PostStatus[]

export type BlogPost = Omit<Post, "createdAt" | "updatedAt" | "externalId" | "externalUrl" | "heroImage" | "category"> & {
  createdAt: string
  updatedAt: string
  category: string
  externalId?: string | null
  externalUrl?: string | null
  heroImage?: string | null
}

export type BlogPostSummary = Omit<BlogPost, "content">

export class PostValidationError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

const WORDS_PER_MINUTE = 200
const SLUG_INVALID_ERROR = "Slug cannot be empty after normalization."

const createPostSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    excerpt: z.string().trim().min(1, "Excerpt is required."),
    content: z.string().trim().min(1, "Content is required."),
    category: z.string().trim().min(1, "Category is required.").default("General"),
    tags: z.array(z.string().trim().min(1)).default([]),
    readTimeMinutes: z.number().int().positive().optional(),
    source: z.nativeEnum(PrismaPostSource, { errorMap: () => ({ message: "Invalid source." }) }),
    externalUrl: z.string().url().optional(),
    heroImage: z.string().url().optional(),
    slug: z.string().trim().min(1, "Slug is required.").optional(),
    createdAt: z.string().datetime().optional(),
    externalId: z.string().trim().optional(),
    status: z.nativeEnum(PrismaPostStatus, { errorMap: () => ({ message: "Invalid status." }) }).default(
      PrismaPostStatus.draft,
    ),
  })
  .strict()

const updatePostSchema = createPostSchema.partial().strict()

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>

function normalizeSlug(raw: string) {
  const slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")

  if (!slug) {
    throw new PostValidationError(SLUG_INVALID_ERROR)
  }

  return slug
}

function normalizeReadTime(minutes?: number) {
  if (!minutes || Number.isNaN(minutes)) return 5
  return Math.max(1, Math.round(minutes))
}

function buildReadTime(minutes: number) {
  return `${normalizeReadTime(minutes)} min read`
}

function sanitizeTags(tags?: string[]) {
  return (tags ?? [])
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

function estimateReadTime(content: string, overrideMinutes?: number) {
  if (overrideMinutes && Number.isFinite(overrideMinutes) && overrideMinutes > 0) {
    return normalizeReadTime(overrideMinutes)
  }

  const words = content.trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return 1

  return normalizeReadTime(Math.ceil(words / WORDS_PER_MINUTE))
}

function toBlogPost(post: Post): BlogPost {
  return {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    externalId: post.externalId ?? undefined,
    externalUrl: post.externalUrl ?? undefined,
    heroImage: post.heroImage ?? undefined,
    category: post.category ?? "General",
  }
}

async function ensureUniqueSlug(slug: string, currentId?: string) {
  const existing = await prisma.post.findFirst({
    where: {
      slug,
      NOT: currentId ? { id: currentId } : undefined,
    },
  })

  if (existing) {
    throw new PostValidationError("Slug already exists.", 409)
  }
}

export async function getAllPosts(includeDrafts = false): Promise<BlogPost[]> {
  const posts = await prisma.post.findMany({
    where: includeDrafts
      ? {}
      : {
          status: PrismaPostStatus.published,
        },
    orderBy: { createdAt: "desc" },
  })

  return posts.map(toBlogPost)
}

export async function getPostBySlug(slug: string, includeDrafts = false): Promise<BlogPost | undefined> {
  const normalizedSlug = normalizeSlug(slug)
  const post = await prisma.post.findFirst({
    where: {
      slug: normalizedSlug,
      ...(includeDrafts ? {} : { status: PrismaPostStatus.published }),
    },
  })

  return post ? toBlogPost(post) : undefined
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  const post = await prisma.post.findUnique({
    where: { id },
  })
  return post ? toBlogPost(post) : undefined
}

export async function getPostSummaries(limit?: number, includeDrafts = false): Promise<BlogPostSummary[]> {
  const posts = await prisma.post.findMany({
    where: includeDrafts
      ? {}
      : {
          status: PrismaPostStatus.published,
        },
    orderBy: { createdAt: "desc" },
    take: typeof limit === "number" ? limit : undefined,
  })

  return posts.map((post) => {
    const { content: _content, ...rest } = toBlogPost(post)
    return rest
  })
}

export async function filterPosts(
  filters?: {
    tag?: string
    readTimeMinutes?: number
    createdAt?: string
    source?: PostSource
    status?: PostStatus
  },
  includeDrafts = false,
): Promise<BlogPost[]> {
  const { tag, readTimeMinutes, createdAt, source, status } = filters ?? {}

  const where: Prisma.PostWhereInput = {
    ...(includeDrafts ? {} : { status: PrismaPostStatus.published }),
  }

  if (tag) {
    where.tags = { has: tag }
  }

  if (typeof readTimeMinutes === "number") {
    where.readTimeMinutes = { lte: readTimeMinutes }
  }

  if (createdAt) {
    const start = new Date(createdAt)
    if (!Number.isNaN(start.getTime())) {
      const end = new Date(start)
      end.setDate(end.getDate() + 1)
      where.createdAt = { gte: start, lt: end }
    }
  }

  if (source) {
    where.source = source
  }

  if (status) {
    where.status = status
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return posts.map(toBlogPost)
}

export async function addPost(input: unknown): Promise<BlogPost> {
  const parsed = createPostSchema.parse(input)
  const now = new Date()

  const slug = normalizeSlug(parsed.slug ?? parsed.title)
  await ensureUniqueSlug(slug)

  const readTimeMinutes = estimateReadTime(parsed.content, parsed.readTimeMinutes)
  const tags = sanitizeTags(parsed.tags)
  const externalId = parsed.externalId?.trim() || slug

  const created = await prisma.post.create({
    data: {
      title: parsed.title.trim(),
      excerpt: parsed.excerpt.trim(),
      content: parsed.content.trim(),
      createdAt: parsed.createdAt ? new Date(parsed.createdAt) : now,
      readTimeMinutes,
      readTime: buildReadTime(readTimeMinutes),
      category: parsed.category.trim(),
      source: parsed.source,
      slug,
      tags,
      externalUrl: parsed.externalUrl,
      heroImage: parsed.heroImage,
      externalId,
      status: parsed.status ?? PrismaPostStatus.draft,
    },
  })

  return toBlogPost(created)
}

export async function updatePost(id: string, updates: unknown): Promise<BlogPost | undefined> {
  const existing = await prisma.post.findUnique({ where: { id } })
  if (!existing) return undefined

  const parsed = updatePostSchema.parse(updates ?? {})

  const title = parsed.title?.trim() ?? existing.title
  const excerpt = parsed.excerpt?.trim() ?? existing.excerpt
  const content = parsed.content?.trim() ?? existing.content
  const category = parsed.category?.trim() ?? existing.category ?? "General"
  const tags = parsed.tags ? sanitizeTags(parsed.tags) : existing.tags
  const source = parsed.source ?? existing.source
  const slug = normalizeSlug(parsed.slug ?? existing.slug ?? title)
  await ensureUniqueSlug(slug, id)

  const readTimeMinutes = estimateReadTime(content, parsed.readTimeMinutes ?? existing.readTimeMinutes)

  const updated = await prisma.post.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      category,
      tags,
      source,
      slug,
      readTimeMinutes,
      readTime: buildReadTime(readTimeMinutes),
      externalUrl: parsed.externalUrl ?? existing.externalUrl,
      heroImage: parsed.heroImage ?? existing.heroImage,
      externalId: parsed.externalId ?? existing.externalId ?? slug,
      status: parsed.status ?? existing.status,
    },
  })

  return toBlogPost(updated)
}

export async function removePost(id: string): Promise<boolean> {
  try {
    await prisma.post.delete({ where: { id } })
    return true
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false
    }
    throw error
  }
}

export async function upsertExternalPost(input: unknown): Promise<BlogPost> {
  const parsed = createPostSchema.parse(input)
  const externalId = parsed.externalId?.trim()

  if (!externalId) {
    throw new PostValidationError("External ID is required for external posts.", 422)
  }

  const slug = normalizeSlug(parsed.slug ?? parsed.title)
  const readTimeMinutes = estimateReadTime(parsed.content, parsed.readTimeMinutes)
  const tags = sanitizeTags(parsed.tags)

  const existing = await prisma.post.findUnique({
    where: {
      source_externalId: {
        source: parsed.source,
        externalId,
      },
    },
  })

  await ensureUniqueSlug(slug, existing?.id)

  const post = existing
    ? await prisma.post.update({
        where: { id: existing.id },
        data: {
          title: parsed.title.trim(),
          excerpt: parsed.excerpt.trim(),
          content: parsed.content.trim(),
          category: parsed.category.trim(),
          tags,
          slug,
          readTimeMinutes,
          readTime: buildReadTime(readTimeMinutes),
          externalUrl: parsed.externalUrl ?? existing.externalUrl,
          heroImage: parsed.heroImage ?? existing.heroImage,
          status: parsed.status ?? existing.status,
        },
      })
    : await prisma.post.create({
        data: {
          title: parsed.title.trim(),
          excerpt: parsed.excerpt.trim(),
          content: parsed.content.trim(),
          category: parsed.category.trim(),
          tags,
          slug,
          readTimeMinutes,
          readTime: buildReadTime(readTimeMinutes),
          source: parsed.source,
          externalId,
          externalUrl: parsed.externalUrl,
          heroImage: parsed.heroImage,
          status: parsed.status ?? PrismaPostStatus.published,
          createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
        },
      })

  return toBlogPost(post)
}
