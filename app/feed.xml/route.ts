import { getDb } from "@/lib/mongo"
import { publicEnv } from "@/lib/env"
import type { Post } from "@/models/post"

export const revalidate = 3600

const base = (publicEnv.NEXT_PUBLIC_SITE_URL || "https://blog.drakeze.com").replace(/\/$/, "")

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!)
}

export async function GET() {
  const db = await getDb()
  const posts = await db
    .collection<Post>("posts")
    .find({ status: "published" }, { projection: { content: 0 } })
    .sort({ publishedAt: -1 })
    .limit(50)
    .toArray()

  const items = posts
    .map((p) => {
      const url = `${base}/blog/${p.slug}`
      const date = (p.publishedAt ?? p.createdAt ?? new Date()).toUTCString()
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Drakeze Blog</title>
    <link>${base}</link>
    <description>Writing about software, systems, and the craft of building things.</description>
    <language>en</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
