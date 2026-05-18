import { Suspense } from "react"

import { BlogCollection } from "@/components/blog-collection"
import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { getPostSummaries } from "@/data/posts"

export const runtime = "nodejs"
export const revalidate = 60

export default async function BlogPage() {
  const posts = await getPostSummaries()

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <div className="bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h1 className="mb-3 font-sans text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl">All Posts</h1>
          <p className="text-base text-primary-foreground/70 md:text-lg">
            Browse published posts from the blog and imported Reddit updates.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12 md:px-6 md:py-14">
        <Suspense>
          <BlogCollection posts={posts} enablePagination pageSize={9} />
        </Suspense>
      </main>

      <BlogFooter />
    </div>
  )
}
