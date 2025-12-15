import { socialConfig } from "@/lib/env"

import { formatMissingKeyMessage } from "./utils"
import type { PlatformFetchResult } from "./types"

export async function fetchLinkedInPosts(): Promise<PlatformFetchResult> {
  const config = socialConfig.linkedin

  if (!config.enabled) {
    return {
      source: "linkedin",
      enabled: false,
      missingKeys: config.missingKeys,
      posts: [],
      message: formatMissingKeyMessage(config.missingKeys, "LinkedIn"),
    }
  }

  const posts = [
    {
      title: "LinkedIn Pulse: Building Sustainable Engineering Teams",
      excerpt: "Thoughts on mentorship, onboarding, and the rituals that keep teams aligned.",
      content:
        "In this edition of LinkedIn Pulse we outline the frameworks we use to mentor new engineers and maintain healthy delivery rhythms.",
      source: "linkedin" as const,
      category: "Leadership",
      tags: ["linkedin", "leadership", "culture"],
      externalId: "linkedin-sustainable-teams",
      externalUrl: "https://www.linkedin.com/pulse/example",
      createdAt: new Date().toISOString(),
      readTimeMinutes: 6,
    },
  ]

  return {
    source: "linkedin",
    enabled: true,
    missingKeys: [],
    posts,
    message: "LinkedIn integration is active.",
  }
}
