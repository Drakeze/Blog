import type { ExternalPostPayload, NormalizedPostInput } from "./types"

export function normalizeExternalPost(payload: ExternalPostPayload): NormalizedPostInput {
  const now = new Date().toISOString()

  return {
    title: payload.title.trim(),
    excerpt: payload.excerpt.trim(),
    content: payload.content.trim(),
    category: payload.category?.trim() || "General",
    tags: payload.tags ?? [],
    readTimeMinutes: payload.readTimeMinutes ?? 5,
    source: payload.source,
    slug: payload.slug?.trim(),
    heroImage: payload.heroImage,
    externalId: payload.externalId,
    externalUrl: payload.externalUrl,
    status: payload.status ?? "published",
    createdAt: payload.createdAt ?? now,
  }
}

export function formatMissingKeyMessage(missingKeys: string[], platform: string) {
  if (missingKeys.length === 0) return `${platform} integration is enabled.`
  const keyList = missingKeys.join(", ")
  return `${platform} integration is disabled. Missing keys: ${keyList}.`
}
