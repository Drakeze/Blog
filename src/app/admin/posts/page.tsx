import Link from "next/link"

import PostTable from "@/components/admin/PostTable"
import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { Button } from "@/components/ui/button"
import { getPostSummaries } from "@/data/posts"

export default function AdminPostsPage() {
  const posts = getPostSummaries(undefined, true)

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-12 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Admin</p>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Posts</h1>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/admin/create">Create post</Link>
          </Button>
        </div>

        <PostTable posts={posts} />
      </main>

      <BlogFooter />
    </div>
  )
}
