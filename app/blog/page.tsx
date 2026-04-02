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
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-xl font-semibold">Latest from Reddit</h2>
            <ul className="mt-4 space-y-3">
              {latestRedditPosts.map((post) => (
                <li key={post.id} className="text-sm text-muted-foreground">
                  <Link className="font-medium text-foreground hover:underline" href={post.permalink} target="_blank" rel="noreferrer">
                    {post.title}
                  </Link>
                  <span className="ml-2">r/{post.subreddit}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <BlogCollection posts={posts} enablePagination pageSize={9} />
      </main>

      <BlogFooter />
    </div>
  )
}
