import { BlogCard } from "@/components/blog-card"
import type { BlogPostSummary } from "@/data/posts"

type BlogGridProps = {
  posts: BlogPostSummary[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
