import { socialConfig } from "@/lib/env"

export interface PatreonPost {
  id: string
  attributes: {
    title: string
    content: string
    published_at: string
    url: string
    teaser_text?: string
    image?: {
      url: string
    }
  }
}

export interface PatreonApiResponse {
  data: PatreonPost[]
}

export interface TransformedPost {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTimeMinutes: number
  publishedAt: Date | undefined
  source: "patreon"
  status: "published"
  externalId: string
  externalUrl: string
  heroImage?: string
}

export async function fetchPatreonPosts(limit = 25): Promise<PatreonPost[]> {
  const config = socialConfig.patreon
  if (!config.enabled) {
    return []
  }

  const { accessToken, campaignId } = config.keys

  const response = await fetch(
    `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/posts?fields[post]=title,content,published_at,url,teaser_text,image&page[count]=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Patreon fetch failed: ${response.statusText}`)
  }

  const data = (await response.json()) as PatreonApiResponse
  return data.data || []
}

export function transformPatreonPost(post: PatreonPost): TransformedPost {
  const content = post.attributes.content || ""
  const excerpt =
    post.attributes.teaser_text || content.slice(0, 160).trim() + (content.length > 160 ? "..." : "")
  const wordCount = content.split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return {
    title: post.attributes.title,
    excerpt,
    content,
    category: "Patreon",
    tags: ["patreon", "exclusive"],
    readTimeMinutes,
    publishedAt: post.attributes.published_at
      ? new Date(post.attributes.published_at)
      : undefined,
    source: "patreon",
    status: "published",
    externalId: post.id,
    externalUrl: post.attributes.url,
    heroImage: post.attributes.image?.url,
  }
}

export async function syncPatreonPosts(limit = 25): Promise<TransformedPost[]> {
  const posts = await fetchPatreonPosts(limit)
  return posts.map(transformPatreonPost)
}
