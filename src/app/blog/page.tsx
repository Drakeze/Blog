import { BlogCollection } from "@/components/blog-collection"
import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { getPostSummaries } from "@/data/posts"

export default function BlogPage() {
  const posts = getPostSummaries()

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-neutral-50">Blog Posts</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-700 dark:text-neutral-300">
            Explore our collection of articles about web development, design, and technology.
          </p>
        </div>

        <BlogCollection posts={posts} enablePagination pageSize={6} />
      </main>

      <BlogFooter />
    </div>
  )
}
