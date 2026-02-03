import { BlogCollection } from "@/components/blog-collection"
import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { getPostSummaries } from "@/data/posts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const posts = await getPostSummaries()

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-secondary md:text-6xl">All Posts</h1>
          <p className="text-base text-muted-foreground md:text-lg">Browse the complete archive from all platforms</p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <BlogCollection posts={posts} enablePagination pageSize={9} />
      </main>

      <BlogFooter />
    </div>
  )
}
