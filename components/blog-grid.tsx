import { BlogCard } from "@/components/blog-card"
import type { BlogPostSummary } from "@/data/posts"

type BlogGridProps = {
  posts: BlogPostSummary[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return <p className="rounded-2xl border border-border bg-card/50 p-8 text-center text-muted-foreground">No published posts yet.</p>
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
