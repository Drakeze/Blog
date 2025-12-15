import { socialConfig } from "@/lib/env"

import { formatMissingKeyMessage } from "./utils"
import type { PlatformFetchResult } from "./types"

export async function fetchRedditPosts(): Promise<PlatformFetchResult> {
  const config = socialConfig.reddit

  if (!config.enabled) {
    return {
      source: "reddit",
      enabled: false,
      missingKeys: config.missingKeys,
      posts: [],
      message: formatMissingKeyMessage(config.missingKeys, "Reddit"),
    }
  }

  const posts = [
    {
      title: "Reddit AMA Highlights for Engineers",
      excerpt: "Key takeaways from our latest AMA on building community-first products.",
      content:
        "We hosted an AMA focused on engineering practices and community moderation. Here are the highlights and questions that resonated most.",
      source: "reddit" as const,
      category: "Community",
      tags: ["reddit", "community", "ama"],
      externalId: "reddit-ama-highlights",
      externalUrl: "https://www.reddit.com/r/example",
      createdAt: new Date().toISOString(),
      readTimeMinutes: 4,
    },
  ]

  return {
    source: "reddit",
    enabled: true,
    missingKeys: [],
    posts,
    message: "Reddit integration is active.",
  }
}
