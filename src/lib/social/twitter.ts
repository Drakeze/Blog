import { socialConfig } from "@/lib/env"

export interface TwitterTweet {
  id: string
  text: string
  created_at: string
  author_id: string
  public_metrics?: {
    retweet_count: number
    reply_count: number
    like_count: number
  }
}

export interface TwitterApiResponse {
  data: TwitterTweet[]
  meta?: {
    result_count: number
  }
}

export interface TransformedPost {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTimeMinutes: number
  source: "twitter"
  status: "published"
  externalId: string
  externalUrl: string
  heroImage?: string
}

export async function fetchTwitterPosts(userId: string, limit = 25): Promise<TwitterTweet[]> {
  const config = socialConfig.twitter
  if (!config.enabled) {
    throw new Error(`Twitter integration disabled. Missing: ${config.missingKeys.join(", ")}`)
  }

  const { bearerToken } = config.keys

  const response = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?max_results=${limit}&tweet.fields=created_at,public_metrics`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Twitter fetch failed: ${response.statusText}`)
  }

  const data = (await response.json()) as TwitterApiResponse
  return data.data || []
}

export function transformTwitterPost(tweet: TwitterTweet, username: string): TransformedPost {
  const content = tweet.text
  const title = content.slice(0, 80) + (content.length > 80 ? "..." : "")
  const excerpt = content.slice(0, 160).trim() + (content.length > 160 ? "..." : "")
  const wordCount = content.split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return {
    title,
    excerpt,
    content,
    category: "Twitter",
    tags: ["twitter", "social"],
    readTimeMinutes,
    source: "twitter",
    status: "published",
    externalId: tweet.id,
    externalUrl: `https://twitter.com/${username}/status/${tweet.id}`,
  }
}

export async function syncTwitterPosts(userId: string, username: string, limit = 25): Promise<TransformedPost[]> {
  const tweets = await fetchTwitterPosts(userId, limit)
  return tweets.map((tweet) => transformTwitterPost(tweet, username))
}
