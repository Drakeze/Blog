import { socialConfig } from "@/lib/env"

export interface LinkedInPost {
  id: string
  text: {
    text: string
  }
  created: {
    time: number
  }
  permalink: string
}

export interface LinkedInApiResponse {
  elements: LinkedInPost[]
}

export interface TransformedPost {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTimeMinutes: number
  source: "linkedin"
  status: "published"
  externalId: string
  externalUrl: string
  heroImage?: string
}

export async function fetchLinkedInPosts(limit = 25): Promise<LinkedInPost[]> {
  const config = socialConfig.linkedin
  if (!config.enabled) {
    throw new Error(`LinkedIn integration disabled. Missing: ${config.missingKeys.join(", ")}`)
  }

  const { accessToken } = config.keys

  // Note: LinkedIn API v2 requires specific permissions and setup
  // This is a simplified example - actual implementation may vary
  const response = await fetch(
    `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:person:AUTHOR_ID)&count=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202304",
      },
    },
  )

  if (!response.ok) {
    throw new Error(`LinkedIn fetch failed: ${response.statusText}`)
  }

  const data = (await response.json()) as LinkedInApiResponse
  return data.elements || []
}

export function transformLinkedInPost(post: LinkedInPost): TransformedPost {
  const content = post.text.text
  const title = content.split("\n")[0].slice(0, 100) || "LinkedIn Post"
  const excerpt = content.slice(0, 160).trim() + (content.length > 160 ? "..." : "")
  const wordCount = content.split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return {
    title,
    excerpt,
    content,
    category: "LinkedIn",
    tags: ["linkedin", "professional"],
    readTimeMinutes,
    source: "linkedin",
    status: "published",
    externalId: post.id,
    externalUrl: post.permalink || `https://linkedin.com/feed/update/${post.id}`,
  }
}

export async function syncLinkedInPosts(limit = 25): Promise<TransformedPost[]> {
  const posts = await fetchLinkedInPosts(limit)
  return posts.map(transformLinkedInPost)
}
