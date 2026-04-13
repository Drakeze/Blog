import { Collection, Db, ObjectId } from "mongodb"

import { blogCollectionNames, getDb } from "@/lib/mongo"

export interface BlogPostDocument {
  _id?: ObjectId
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTimeMinutes: number
  source: "blog" | "reddit"
  status: "draft" | "published"
  featured: boolean
  slug: string
  externalId?: string | null
  externalUrl?: string | null
  heroImage?: string | null
  createdAt: Date
  updatedAt: Date
}

let cachedCollection: Collection<BlogPostDocument> | null = null

async function ensurePostIndexes(collection: Collection<BlogPostDocument>) {
  const indexes = await collection.indexes()
  const externalIndex = indexes.find((index) => index.name === "externalId_1_source_1")
  const usesPartialExternalIdIndex =
    externalIndex &&
    "partialFilterExpression" in externalIndex &&
    externalIndex.partialFilterExpression?.externalId?.$type === "string"

  if (externalIndex?.name && !usesPartialExternalIdIndex) {
    await collection.dropIndex(externalIndex.name)
  }

  await collection.createIndex({ slug: 1 }, { unique: true })
  await collection.createIndex({ source: 1 })
  await collection.createIndex({ status: 1 })
  await collection.createIndex({ featured: 1 })
  await collection.createIndex({ tags: 1 })
  await collection.createIndex({ createdAt: -1 })
  await collection.createIndex(
    { externalId: 1, source: 1 },
    {
      unique: true,
      partialFilterExpression: {
        externalId: { $type: "string" },
      },
    },
  )
}

export async function getPostsCollection(): Promise<Collection<BlogPostDocument>> {
  if (cachedCollection) {
    return cachedCollection
  }

  const db: Db = await getDb()
  cachedCollection = db.collection<BlogPostDocument>(blogCollectionNames.posts)

  await ensurePostIndexes(cachedCollection)

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
    featured: doc.featured ?? false,
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
