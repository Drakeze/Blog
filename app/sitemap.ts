import type { MetadataRoute } from "next"
import { getDb } from "@/lib/mongo"
import { publicEnv } from "@/lib/env"
import type { Post } from "@/models/post"

// Rendered on request, not at build — needs the DB, and the build must not
// depend on Atlas being reachable.
export const dynamic = "force-dynamic"

const base = (publicEnv.NEXT_PUBLIC_SITE_URL || "https://blog.drakeze.com").replace(/\/$/, "")

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDb()
  const posts = await db
    .collection<Post>("posts")
    .find({ status: "published" }, { projection: { slug: 1, updatedAt: 1, publishedAt: 1 } })
    .toArray()

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt ?? p.publishedAt ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/bookmarks`, changeFrequency: "monthly", priority: 0.3 },
    ...postEntries,
  ]
}
