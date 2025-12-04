import { BlogCard } from "@/components/blog-card"
import type { BlogPostSummary } from "@/data/posts"

type BlogGridProps = {
  posts: Array<BlogPostSummary & { image?: string }>
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
        No posts found.
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
