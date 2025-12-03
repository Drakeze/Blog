import { BlogHeader } from "@/components/blog-header"
import { BlogHero } from "@/components/blog-hero"
import { BlogFilters } from "@/components/blog-filters"
import { BlogGrid } from "@/components/blog-grid"
import { BlogFooter } from "@/components/blog-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <BlogHero />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <BlogFilters />
        <BlogGrid />
      </main>
      <BlogFooter />
    </div>
  )
}
