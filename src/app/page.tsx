import { BlogHeader } from "@/components/blog-header"
import { BlogHero } from "@/components/blog-hero"
import { BlogFooter } from "@/components/blog-footer"
import { BlogCard } from "@/components/blog-card"
import { getPostSummaries } from "@/data/posts"

export default async function HomePage() {
  const recentPosts = await getPostSummaries(3)

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <BlogHero />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </main>
      <BlogFooter />
    </div>
  )
}
