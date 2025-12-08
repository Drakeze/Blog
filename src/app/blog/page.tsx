import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { BlogFilters } from "@/components/blog-filters"
import { BlogGrid } from "@/components/blog-grid"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">All Posts</h1>
          <p className="text-lg text-muted-foreground">Browse the complete archive from all platforms</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <BlogFilters />
        <BlogGrid />
      </main>

      <BlogFooter />
    </div>
  )
}
