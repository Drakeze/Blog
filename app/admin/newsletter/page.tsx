import { getDb } from "@/lib/mongo"
import type { Post } from "@/models/post"
import { NewsletterSendForm } from "@/components/admin/newsletter-send-form"

export const metadata = { title: "Newsletter" }

export default async function NewsletterPage() {
  const db = await getDb()
  const posts = await db
    .collection<Post>("posts")
    .find({ status: "published" }, { projection: { content: 0 } })
    .sort({ publishedAt: -1 })
    .toArray()

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Newsletter</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manually send a post to all confirmed subscribers.
        </p>
      </div>
      <NewsletterSendForm posts={posts.map((p) => ({ slug: p.slug, title: p.title, _id: String(p._id) }))} />
    </div>
  )
}
