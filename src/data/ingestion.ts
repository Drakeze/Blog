import type { CreatePostInput, PostSource, PostStatus } from "@/data/posts"
import { addPost } from "@/data/posts"
import { env } from "@/lib/env"

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

function normalizeExternalPost(payload: ExternalPostPayload): CreatePostInput {
  return {
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category ?? "General",
    tags: payload.tags ?? [],
    readTimeMinutes: payload.readTimeMinutes,
    source: payload.source,
    slug: payload.slug,
    heroImage: payload.heroImage,
    externalId: payload.externalId,
    externalUrl: payload.externalUrl,
    status: payload.status,
    createdAt: payload.createdAt,
  }
}

export function ingestExternalPost(payload: ExternalPostPayload) {
  const normalized = normalizeExternalPost(payload)
  return addPost(normalized)
}

export function ingestExternalPosts(payloads: ExternalPostPayload[]) {
  return payloads.map((payload) => ingestExternalPost(payload))
}

export async function fetchPatreonPosts() {
  // TODO: Implement Patreon API integration using env.PATREON_ACCESS_TOKEN and env.PATREON_CAMPAIGN_ID
  void env.PATREON_ACCESS_TOKEN
  void env.PATREON_CAMPAIGN_ID
  return [] as ExternalPostPayload[]
}

export async function fetchRedditPosts() {
  // TODO: Implement Reddit API integration using env.REDDIT_CLIENT_ID/SECRET and env.REDDIT_USER_AGENT
  void env.REDDIT_CLIENT_ID
  void env.REDDIT_CLIENT_SECRET
  void env.REDDIT_USER_AGENT
  return [] as ExternalPostPayload[]
}

export async function fetchLinkedInPosts() {
  // TODO: Implement LinkedIn API integration using env.LINKEDIN_ACCESS_TOKEN
  void env.LINKEDIN_ACCESS_TOKEN
  return [] as ExternalPostPayload[]
}

export async function fetchTwitterPosts() {
  // TODO: Implement Twitter/X API integration using env.TWITTER_BEARER_TOKEN
  void env.TWITTER_BEARER_TOKEN
  return [] as ExternalPostPayload[]
}

export async function syncExternalSources(payloads: ExternalPostPayload[] = []) {
  // Placeholder hook to combine fetched posts from external services.
  const normalizedPayloads = payloads
  return ingestExternalPosts(normalizedPayloads)
}
