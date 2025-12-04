import { Card, CardContent } from "@/components/ui/card"
import { BlogCard } from "@/components/blog-card"
import type { BlogPostSummary } from "@/data/posts"

type BlogGridProps = {
  posts: BlogPostSummary[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">No posts found.</CardContent>
      </Card>
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
