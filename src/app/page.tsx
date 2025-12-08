import { BlogHeader } from "@/components/blog-header"
import { BlogHero } from "@/components/blog-hero"
import { BlogFooter } from "@/components/blog-footer"
import { BlogCard } from "@/components/blog-card"

const recentPosts = [
  {
    id: "1",
    slug: "future-of-web-development",
    title: "The Future of Web Development: Trends to Watch in 2025",
    excerpt:
      "Exploring the latest innovations in web technology and what they mean for developers building the next generation of applications.",
    date: "Dec 1, 2025",
    readTime: "8 min read",
    source: "blog" as const,
    image: "/modern-web-development.png",
  },
  {
    id: "2",
    slug: "design-systems-at-scale",
    title: "Building Design Systems at Scale",
    excerpt:
      "Lessons learned from creating and maintaining design systems for large engineering teams and multiple products.",
    date: "Nov 28, 2025",
    readTime: "12 min read",
    source: "linkedin" as const,
    image: "/design-system-components.png",
  },
  {
    id: "3",
    slug: "typescript-best-practices",
    title: "TypeScript Best Practices for 2025",
    excerpt:
      "A comprehensive guide to writing maintainable, type-safe TypeScript code with modern patterns and practices.",
    date: "Nov 25, 2025",
    readTime: "10 min read",
    source: "blog" as const,
    image: "/typescript-code.png",
  },
]

export default function HomePage() {
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
