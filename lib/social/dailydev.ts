import { socialConfig } from "@/lib/env"

export interface TransformedPost {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTimeMinutes: number
  publishedAt: Date
  source: "dailydev"
  status: "published"
  externalId: string
  externalUrl: string
  heroImage?: string
}

export async function syncDailyDevPosts(): Promise<TransformedPost[]> {
  const config = socialConfig.dailydev
  if (!config.enabled) {
    return []
  }

  return []
}
