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

      <main className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Admin</p>
            <h1 className="text-3xl font-serif font-bold">Posts</h1>
          </div>
          <Button asChild>
            <Link href="/admin/create">Create post</Link>
          </Button>
        </div>

        <PostTable posts={posts} />
      </main>

      <BlogFooter />
    </div>
  )
}
