export type RedditBlogPost = {
  id: string
  title: string
  content: string
  createdAt: string
  permalink: string
  subreddit: string
  thumbnail?: string
  externalUrl: string
}

type RedditListingChild = {
  data?: {
    id?: string
    title?: string
    selftext?: string
    created_utc?: number
    permalink?: string
    subreddit?: string
    thumbnail?: string
    url?: string
  }
}

type RedditListingResponse = {
  data?: {
    children?: RedditListingChild[]
  }
}

const REDDIT_USER_SUBMITTED_URL = "https://www.reddit.com/user/Putrid-Economy1639/submitted.json"
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

function isValidThumbnail(value: string | undefined): value is string {
  if (!value) return false
  return value.startsWith("http://") || value.startsWith("https://")
}

export function transformRedditListingChild(child: RedditListingChild): RedditBlogPost | null {
  const post = child?.data
  if (!post?.id || !post?.title || !post?.permalink || !post?.subreddit) {
    return null
  }

  const createdAt = typeof post.created_utc === "number" ? new Date(post.created_utc * 1000).toISOString() : new Date(0).toISOString()
  const permalink = post.permalink.startsWith("/") ? `https://www.reddit.com${post.permalink}` : post.permalink

  return {
    id: post.id,
    title: post.title,
    content: post.selftext?.trim() || "",
    createdAt,
    permalink,
    subreddit: post.subreddit,
    thumbnail: isValidThumbnail(post.thumbnail) ? post.thumbnail : undefined,
    externalUrl: post.url || permalink,
  }
}

export async function fetchRedditBlogPosts(options?: {
  limit?: number
  newestFirst?: boolean
  signal?: AbortSignal
}): Promise<RedditBlogPost[]> {
  const requestedLimit = options?.limit ?? DEFAULT_LIMIT
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), MAX_LIMIT) : DEFAULT_LIMIT
  const newestFirst = options?.newestFirst ?? true

  try {
    const response = await fetch(`${REDDIT_USER_SUBMITTED_URL}?limit=${limit}`, {
      headers: {
        "User-Agent": process.env.REDDIT_USER_AGENT || "NextBlogRedditIntegration/1.0 (contact: admin@example.com)",
      },
      signal: options?.signal,
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      console.error(`Reddit fetch failed with status ${response.status}`)
      return []
    }

    const json = (await response.json()) as RedditListingResponse
    const children = Array.isArray(json?.data?.children) ? json.data.children : []
    const transformed = children.map(transformRedditListingChild).filter((post): post is RedditBlogPost => Boolean(post))

    if (!newestFirst) {
      transformed.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else {
      transformed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return transformed
  } catch (error) {
    console.error("Failed to fetch Reddit blog posts", error)
    return []
  }
}
