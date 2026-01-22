import { ObjectId } from "mongodb"
import { z } from "zod"

import {
  type BlogPostDocument,
  documentToPost,
  generateSlug,
  getPostsCollection,
} from "@/models/BlogPost"

export type PostSource = "blog" | "reddit" | "twitter" | "linkedin" | "patreon"
export type PostStatus = "draft" | "published"

export const postSources: PostSource[] = ["blog", "reddit", "twitter", "linkedin", "patreon"]
export const postStatuses: PostStatus[] = ["draft", "published"]

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTimeMinutes: number
  readTime: string
  source: PostSource
  status: PostStatus
  slug: string
  createdAt: string
  updatedAt: string
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

const postInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().default("General"),
  tags: z.array(z.string()).default([]),
  readTimeMinutes: z.number().int().positive().default(5),
  source: z.enum(["blog", "reddit", "twitter", "linkedin", "patreon"]).default("blog"),
  status: z.enum(["draft", "published"]).default("draft"),
  slug: z.string().optional(),
  externalId: z.string().optional(),
  externalUrl: z.string().url().optional(),
  heroImage: z.string().url().optional(),
})

const postUpdateSchema = postInputSchema.partial()

export async function getAllPosts(includeDrafts = false): Promise<BlogPost[]> {
  const collection = await getPostsCollection()
  const filter = includeDrafts ? {} : { status: "published" }
  const docs = await collection.find(filter).sort({ createdAt: -1 }).toArray()
  return docs.map(documentToPost)
}

export async function getPostBySlug(slug: string, includeDrafts = false): Promise<BlogPost | undefined> {
  const collection = await getPostsCollection()
  const filter = includeDrafts ? { slug } : { slug, status: "published" }
  const doc = await collection.findOne(filter)
  return doc ? documentToPost(doc) : undefined
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  if (!ObjectId.isValid(id)) {
    return undefined
  }
  const collection = await getPostsCollection()
  const doc = await collection.findOne({ _id: new ObjectId(id) })
  return doc ? documentToPost(doc) : undefined
}

export async function getPostSummaries(limit?: number, includeDrafts = false): Promise<BlogPostSummary[]> {
  const collection = await getPostsCollection()
  const filter = includeDrafts ? {} : { status: "published" }
  const projection = { content: 0 }
  let query = collection.find(filter, { projection }).sort({ createdAt: -1 })
  if (limit) {
    query = query.limit(limit)
  }
  const docs = await query.toArray()
  return docs.map((doc) => {
    const { content, ...post } = documentToPost(doc as unknown as BlogPostDocument)
    return post
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
  const collection = await getPostsCollection()
  const query: Record<string, unknown> = {}

  if (!includeDrafts && !filters?.status) {
    query.status = "published"
  }

  if (filters?.status) {
    query.status = filters.status
  }

  if (filters?.tag) {
    query.tags = filters.tag
  }

  if (filters?.readTimeMinutes) {
    query.readTimeMinutes = filters.readTimeMinutes
  }

  if (filters?.source) {
    query.source = filters.source
  }

  if (filters?.createdAt) {
    query.createdAt = { $gte: new Date(filters.createdAt) }
  }

  const docs = await collection.find(query).sort({ createdAt: -1 }).toArray()
  return docs.map(documentToPost)
}

export async function addPost(input: unknown): Promise<BlogPost> {
  const parsed = postInputSchema.safeParse(input)
  if (!parsed.success) {
    throw new PostValidationError(parsed.error.errors[0].message, 400)
  }

  const data = parsed.data
  const collection = await getPostsCollection()
  const now = new Date()

  const doc: BlogPostDocument = {
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    tags: data.tags,
    readTimeMinutes: data.readTimeMinutes,
    source: data.source,
    status: data.status,
    slug: data.slug || generateSlug(data.title),
    externalId: data.externalId || null,
    externalUrl: data.externalUrl || null,
    heroImage: data.heroImage || null,
    createdAt: now,
    updatedAt: now,
  }

  try {
    const result = await collection.insertOne(doc)
    const inserted = await collection.findOne({ _id: result.insertedId })
    if (!inserted) {
      throw new PostValidationError("Failed to retrieve created post", 500)
    }
    return documentToPost(inserted)
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      throw new PostValidationError("A post with this slug already exists", 409)
    }
    throw error
  }
}

export async function updatePost(id: string, updates: unknown): Promise<BlogPost | undefined> {
  if (!ObjectId.isValid(id)) {
    return undefined
  }

  const parsed = postUpdateSchema.safeParse(updates)
  if (!parsed.success) {
    throw new PostValidationError(parsed.error.errors[0].message, 400)
  }

  const data = parsed.data
  const collection = await getPostsCollection()
  const updateDoc: Partial<BlogPostDocument> = {
    ...data,
    updatedAt: new Date(),
  }

  try {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: "after" },
    )

    return result ? documentToPost(result) : undefined
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      throw new PostValidationError("A post with this slug already exists", 409)
    }
    throw error
  }
}

export async function removePost(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false
  }
  const collection = await getPostsCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

export async function upsertExternalPost(input: unknown): Promise<BlogPost> {
  const parsed = postInputSchema.safeParse(input)
  if (!parsed.success) {
    throw new PostValidationError(parsed.error.errors[0].message, 400)
  }

  const data = parsed.data
  if (!data.externalId || !data.source || data.source === "blog") {
    throw new PostValidationError("externalId and valid source are required for external posts", 400)
  }

  const collection = await getPostsCollection()
  const now = new Date()

  const doc: BlogPostDocument = {
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    tags: data.tags,
    readTimeMinutes: data.readTimeMinutes,
    source: data.source,
    status: data.status,
    slug: data.slug || generateSlug(data.title, data.externalId),
    externalId: data.externalId,
    externalUrl: data.externalUrl || null,
    heroImage: data.heroImage || null,
    createdAt: now,
    updatedAt: now,
  }

  const result = await collection.findOneAndUpdate(
    { externalId: data.externalId, source: data.source },
    { $set: { ...doc, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true, returnDocument: "after" },
  )

  if (!result) {
    throw new PostValidationError("Failed to upsert external post", 500)
  }

  return documentToPost(result)
}
