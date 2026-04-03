import Link from "next/link"

import { BlogCollection } from "@/components/blog-collection"
import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { getPostSummaries } from "@/data/posts"
import { fetchRedditBlogPosts } from "@/lib/social/reddit-blog"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const [posts, latestRedditPosts] = await Promise.all([
    getPostSummaries(),
    fetchRedditBlogPosts({ limit: 3, newestFirst: true }),
  ])

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-secondary md:text-6xl">All Posts</h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Browse published posts from the blog and imported Reddit updates.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12 md:px-6 md:py-14">
        {latestRedditPosts.length > 0 ? (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Latest from Reddit</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestRedditPosts.map((post) => (
                <Link
                  key={post.id}
                  className="cursor-pointer rounded-xl border p-4 transition hover:shadow-md"
                  href={post.permalink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <h3 className="line-clamp-2 text-lg font-semibold">{post.title}</h3>

                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {post.content || "No description available"}
                  </p>

                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>r/{post.subreddit}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <BlogCollection posts={posts} enablePagination pageSize={9} />
      </main>

      <BlogFooter />
    </div>
  )
}
