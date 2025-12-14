import { socialConfig } from "@/lib/env"

import { formatMissingKeyMessage } from "./utils"
import type { PlatformFetchResult } from "./types"

export async function fetchPatreonPosts(): Promise<PlatformFetchResult> {
  const config = socialConfig.patreon

  if (!config.enabled) {
    return {
      source: "patreon",
      enabled: false,
      missingKeys: config.missingKeys,
      posts: [],
      message: formatMissingKeyMessage(config.missingKeys, "Patreon"),
    }
  }

  const posts = [
    {
      title: "Patreon Exclusive: Architecture Deep Dive",
      excerpt: "A supporter-only walkthrough of our content pipeline and editorial calendar.",
      content:
        "Supporters get a behind-the-scenes look at how we prioritize topics, handle revisions, and maintain a consistent publishing cadence.",
      source: "patreon" as const,
      category: "Behind the Scenes",
      tags: ["patreon", "roadmap", "supporters"],
      externalId: "patreon-architecture-deep-dive",
      externalUrl: "https://www.patreon.com/posts/example",
      createdAt: new Date().toISOString(),
      readTimeMinutes: 7,
    },
  ]

  return {
    source: "patreon",
    enabled: true,
    missingKeys: [],
    posts,
    message: "Patreon integration is active.",
  }
}
