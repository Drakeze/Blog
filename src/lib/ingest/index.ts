import {
  addPost,
  PostValidationError,
  type BlogPost,
  type PostSource,
} from "@/data/posts"

import { fetchLinkedInPosts } from "./linkedin"
import { fetchPatreonPosts } from "./patreon"
import { fetchRedditPosts } from "./reddit"
import { fetchTwitterPosts } from "./twitter"
import { normalizeExternalPost } from "./utils"
import type { PlatformFetchResult, PlatformImportReport } from "./types"

function handleImportForPlatform(result: PlatformFetchResult) {
  if (!result.enabled) {
    return {
      imported: [] as BlogPost[],
      report: {
        source: result.source,
        enabled: false,
        missingKeys: result.missingKeys,
        fetched: 0,
        imported: 0,
        skipped: 0,
        message: result.message,
      } satisfies PlatformImportReport,
    }
  }

  const imported: BlogPost[] = []
  let skipped = 0

  for (const payload of result.posts) {
    try {
      const normalized = normalizeExternalPost(payload)
      const post = addPost(normalized)
      imported.push(post)
    } catch (error) {
      if (error instanceof PostValidationError) {
        skipped += 1
        continue
      }
      throw error
    }
  }

  return {
    imported,
    report: {
      source: result.source,
      enabled: true,
      missingKeys: [],
      fetched: result.posts.length,
      imported: imported.length,
      skipped,
      message: result.message,
    } satisfies PlatformImportReport,
  }
}

export async function importExternalPosts() {
  const fetchers: Array<() => Promise<PlatformFetchResult>> = [
    fetchRedditPosts,
    fetchLinkedInPosts,
    fetchPatreonPosts,
    fetchTwitterPosts,
  ]

  const summary: PlatformImportReport[] = []
  const imported: BlogPost[] = []

  for (const fetcher of fetchers) {
    const result = await fetcher()
    const { imported: platformPosts, report } = handleImportForPlatform(result)
    imported.push(...platformPosts)
    summary.push(report)
  }

  return { imported, summary }
}

export function getSupportedSources(): PostSource[] {
  return ["reddit", "linkedin", "patreon", "twitter"]
}
