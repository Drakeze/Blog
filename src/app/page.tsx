import { BlogCollection } from "@/components/blog-collection"
import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { BlogHero } from "@/components/blog-hero"
import { getPostSummaries } from "@/data/posts"

export default function HomePage() {
  const posts = getPostSummaries(6)

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <BlogHero />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <BlogCollection posts={posts} />
      </main>
      <BlogFooter />
    </div>
  )
}
