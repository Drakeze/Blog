import { socialConfig } from "@/lib/env"

import type { PlatformFetchResult } from "./types"

export async function fetchTwitterPosts(): Promise<PlatformFetchResult> {
  const config = socialConfig.twitter

  return {
    source: "twitter",
    enabled: false,
    missingKeys: config.missingKeys,
    posts: [],
    message: "Twitter/X integration is a placeholder and is currently disabled.",
  }
}
