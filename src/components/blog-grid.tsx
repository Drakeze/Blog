import { BlogCard } from "@/components/blog-card"

// Mock data - replace with actual data fetching
const posts = [
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
  {
    id: "4",
    slug: "ai-development-tools",
    title: "How AI is Transforming Development Workflows",
    excerpt:
      "From code completion to automated testing, AI tools are changing how we build software. Here's what's working.",
    date: "Nov 22, 2025",
    readTime: "6 min read",
    source: "twitter" as const,
    image: "/ai-coding-assistant.jpg",
  },
  {
    id: "5",
    slug: "server-components-guide",
    title: "A Practical Guide to React Server Components",
    excerpt: "Understanding when and how to use React Server Components for better performance and user experience.",
    date: "Nov 20, 2025",
    readTime: "15 min read",
    source: "patreon" as const,
    image: "/react-server-components.png",
  },
  {
    id: "6",
    slug: "performance-optimization",
    title: "Web Performance Optimization in 2025",
    excerpt:
      "Practical techniques for making your web applications faster, from bundle optimization to edge caching strategies.",
    date: "Nov 18, 2025",
    readTime: "11 min read",
    source: "reddit" as const,
    image: "/website-performance-metrics.jpg",
  },
]

export function BlogGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
