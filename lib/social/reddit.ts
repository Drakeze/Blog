import { socialConfig } from "@/lib/env"

export interface RedditPost {
  id: string
  title: string
  selftext: string
  url: string
  subreddit: string
  created_utc: number
  score: number
  num_comments: number
  permalink: string
}

export interface RedditApiResponse {
  data: {
    children: Array<{
      data: RedditPost
    }>
  }
}

export interface TransformedPost {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTimeMinutes: number
  publishedAt: Date
  source: "reddit"
  status: "published"
  externalId: string
  externalUrl: string
  heroImage?: string
}

export async function fetchRedditPosts(limit = 25): Promise<RedditPost[]> {
  const config = socialConfig.reddit
  if (!config.enabled) {
    return []
  }

  const { clientId, clientSecret, userAgent, username } = config.keys
  if (!username) {
    return []
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  // Get access token
  const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent!,
    },
    body: "grant_type=client_credentials",
  })

  if (!tokenResponse.ok) {
    throw new Error(`Reddit auth failed: ${tokenResponse.statusText}`)
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string }

  // Fetch user posts
  const postsResponse = await fetch(
    `https://oauth.reddit.com/user/${username}/submitted?limit=${limit}&sort=new`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": userAgent!,
      },
    },
  )

  if (!postsResponse.ok) {
    throw new Error(`Reddit fetch failed: ${postsResponse.statusText}`)
  }

  const data = (await postsResponse.json()) as RedditApiResponse
  return data.data.children.map((child) => child.data)
}

export function transformRedditPost(post: RedditPost): TransformedPost {
  const content = post.selftext || `[Link post](${post.url})`
  const excerpt = content.slice(0, 160).trim() + (content.length > 160 ? "..." : "")
  const wordCount = content.split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return {
    title: post.title,
    excerpt,
    content,
    category: "Reddit",
    tags: [post.subreddit, "reddit"],
    readTimeMinutes,
    publishedAt: new Date(post.created_utc * 1000),
    source: "reddit",
    status: "published",
    externalId: post.id,
    externalUrl: `https://reddit.com${post.permalink}`,
  }
}

export async function syncRedditPosts(limit = 25): Promise<TransformedPost[]> {
  const posts = await fetchRedditPosts(limit)
  return posts.map(transformRedditPost)
}
