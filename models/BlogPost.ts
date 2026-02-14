import { Collection, Db, ObjectId } from "mongodb"

import { getDb } from "@/lib/mongo"

export interface BlogPostDocument {
  _id?: ObjectId
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTimeMinutes: number
  source: "blog" | "reddit" | "twitter" | "linkedin" | "patreon" | "dailydev"
  status: "draft" | "published"
  slug: string
  externalId?: string | null
  externalUrl?: string | null
  heroImage?: string | null
  createdAt: Date
  updatedAt: Date
}

let cachedCollection: Collection<BlogPostDocument> | null = null

export async function getPostsCollection(): Promise<Collection<BlogPostDocument>> {
  if (cachedCollection) {
    return cachedCollection
  }

  const db: Db = await getDb()
  cachedCollection = db.collection<BlogPostDocument>("posts")

  // Create indexes for better query performance
  await cachedCollection.createIndex({ slug: 1 }, { unique: true })
  await cachedCollection.createIndex({ source: 1 })
  await cachedCollection.createIndex({ status: 1 })
  await cachedCollection.createIndex({ tags: 1 })
  await cachedCollection.createIndex({ createdAt: -1 })
  await cachedCollection.createIndex({ externalId: 1, source: 1 }, { unique: true, sparse: true })

  return cachedCollection
}

export function documentToPost(doc: BlogPostDocument) {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    category: doc.category,
    tags: doc.tags,
    readTimeMinutes: doc.readTimeMinutes,
    readTime: `${doc.readTimeMinutes} min read`,
    source: doc.source,
    status: doc.status,
    slug: doc.slug,
    externalId: doc.externalId || null,
    externalUrl: doc.externalUrl || null,
    heroImage: doc.heroImage || null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  }
}

export function generateSlug(title: string, id?: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return id ? `${baseSlug}-${id.slice(-6)}` : baseSlug
}
