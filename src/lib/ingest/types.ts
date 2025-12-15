import type { CreatePostInput, PostSource, PostStatus } from "@/data/posts"

export type ExternalPostPayload = {
  title: string
  excerpt: string
  content: string
  source: PostSource
  category?: string
  tags?: string[]
  slug?: string
  heroImage?: string
  externalId?: string
  externalUrl?: string
  readTimeMinutes?: number
  status?: PostStatus
  createdAt?: string
}

export type PlatformFetchResult = {
  source: PostSource
  enabled: boolean
  missingKeys: string[]
  posts: ExternalPostPayload[]
  message?: string
}

export type PlatformImportReport = {
  source: PostSource
  enabled: boolean
  missingKeys: string[]
  fetched: number
  imported: number
  skipped: number
  message?: string
}

export type NormalizedPostInput = CreatePostInput
