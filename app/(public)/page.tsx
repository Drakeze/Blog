import { getDb } from "@/lib/mongo"
import type { PostSummary } from "@/models/post"
import { PostCard } from "@/components/post-card"

export const revalidate = 60

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>
}) {
  const { tag, page: pageParam } = await searchParams
  const page = parseInt(pageParam ?? "1")
  const limit = 12

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(tag ? { tag } : {}),
  })

  const db = await getDb()
  const filter: Record<string, unknown> = { status: "published" }
  if (tag) filter.tags = tag

  const [posts, total] = await Promise.all([
    db
      .collection<PostSummary>("posts")
      .find(filter, { projection: { content: 0 } })
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    db.collection("posts").countDocuments(filter),
  ])

  const totalPages = Math.ceil(total / limit)

  // Get all unique tags for filter bar
  const allTags = await db
    .collection("posts")
    .distinct("tags", { status: "published" })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">The Blog</h1>
        <p className="text-muted-foreground text-lg">
          Writing about software, systems, and the craft of building things.
        </p>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <a
            href="/"
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !tag
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:border-foreground/40 text-muted-foreground"
            }`}
          >
            All
          </a>
          {allTags.map((t: string) => (
            <a
              key={t}
              href={`/?tag=${t}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                tag === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-foreground/40 text-muted-foreground"
              }`}
            >
              {t}
            </a>
          ))}
        </div>
      )}

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            {tag ? `No posts tagged "${tag}".` : "No posts published yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={String(post._id)} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <a
              href={`/?${new URLSearchParams({ ...(tag ? { tag } : {}), page: String(page - 1) })}`}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
            >
              ← Previous
            </a>
          )}
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/?${new URLSearchParams({ ...(tag ? { tag } : {}), page: String(page + 1) })}`}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
            >
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
