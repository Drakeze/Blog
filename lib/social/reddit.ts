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
  source: "reddit"
  status: "published"
  externalId: string
  externalUrl: string
  heroImage?: string
}

export class RedditIntegrationError extends Error {
  status: number
  code: "missing_credentials" | "invalid_username" | "auth_failed" | "fetch_failed" | "invalid_response"
  troubleshooting: string[]

  constructor({
    message,
    status,
    code,
    troubleshooting,
  }: {
    message: string
    status: number
    code: RedditIntegrationError["code"]
    troubleshooting: string[]
  }) {
    super(message)
    this.status = status
    this.code = code
    this.troubleshooting = troubleshooting
  }
}

export async function fetchRedditPosts(username: string, limit = 25): Promise<RedditPost[]> {
  const config = socialConfig.reddit
  if (!config.enabled) {
    throw new RedditIntegrationError({
      message: `Reddit integration disabled. Missing: ${config.missingKeys.join(", ")}`,
      status: 503,
      code: "missing_credentials",
      troubleshooting: [
        "Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, and REDDIT_USER_AGENT in your environment.",
        "Redeploy after updating the variables in Vercel.",
      ],
    })
  }

  const normalizedUsername = username.replace(/^u\//i, "").trim()
  if (!normalizedUsername) {
    throw new RedditIntegrationError({
      message: "Provide a Reddit username before starting a sync.",
      status: 400,
      code: "invalid_username",
      troubleshooting: [
        "Enter a Reddit username in the admin sync form, or set REDDIT_USERNAME in your environment.",
      ],
    })
  }

  const { clientId, clientSecret, userAgent } = config.keys
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
    const errorBody = await tokenResponse.text()
    throw new RedditIntegrationError({
      message: `Reddit auth failed (${tokenResponse.status}): ${errorBody || tokenResponse.statusText}`,
      status: tokenResponse.status,
      code: "auth_failed",
      troubleshooting: [
        "Open your Reddit app settings and verify the client ID and client secret are current.",
        "If you recently rotated the secret, update REDDIT_CLIENT_SECRET in Vercel and redeploy.",
        "Confirm REDDIT_USER_AGENT is present and identifies your app in Reddit's expected format.",
      ],
    })
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string }
  if (!tokenData?.access_token) {
    throw new RedditIntegrationError({
      message: "Reddit auth succeeded without returning an access token.",
      status: 502,
      code: "invalid_response",
      troubleshooting: [
        "Inspect the raw token response from Reddit.",
        "Verify the app still has OAuth access enabled in Reddit developer settings.",
      ],
    })
  }

  // Fetch user posts
  const postsResponse = await fetch(
    `https://oauth.reddit.com/user/${normalizedUsername}/submitted?limit=${limit}&sort=new`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": userAgent!,
      },
    },
  )

  if (!postsResponse.ok) {
    const errorBody = await postsResponse.text()
    throw new RedditIntegrationError({
      message: `Reddit fetch failed (${postsResponse.status}): ${errorBody || postsResponse.statusText}`,
      status: postsResponse.status,
      code: "fetch_failed",
      troubleshooting: [
        "Confirm the Reddit username exists and is spelled correctly.",
        "Check whether the app still has permission to read public Reddit content.",
        "Retry the request after verifying the OAuth credentials and user agent.",
      ],
    })
  }

  const data = (await postsResponse.json()) as RedditApiResponse
  if (!Array.isArray(data?.data?.children)) {
    throw new RedditIntegrationError({
      message: "Reddit returned an unexpected payload shape.",
      status: 502,
      code: "invalid_response",
      troubleshooting: [
        "Inspect the Reddit API response body and verify the endpoint still returns listing data.",
        "Update the transformer if Reddit's response format changed.",
      ],
    })
  }

  return data?.data?.children?.map((child) => child.data) ?? []
}

export function transformRedditPost(post: RedditPost): TransformedPost {
  const content = post.selftext || `[Link post](${post.url})`
  const excerpt = `${content.slice(0, 160).trim()}${content.length > 160 ? "..." : ""}`.trim()
  const wordCount = content.split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return {
    title: post.title,
    excerpt,
    content,
    category: "Reddit",
    tags: [post.subreddit, "reddit"],
    readTimeMinutes,
    source: "reddit",
    status: "published",
    externalId: post.id,
    externalUrl: `https://reddit.com${post.permalink}`,
  }
}

export async function syncRedditPosts(username: string, limit = 25): Promise<TransformedPost[]> {
  const posts = await fetchRedditPosts(username, limit)
  return posts.map(transformRedditPost)
}
