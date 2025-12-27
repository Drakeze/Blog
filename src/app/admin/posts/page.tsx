import Link from "next/link"

import PostTable from "@/components/admin/PostTable"
import { Button } from "@/components/ui/button"
import { getPostSummaries } from "@/data/posts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function AdminPostsPage() {
  const posts = await getPostSummaries(undefined, true)

  return (
    <div className="space-y-8">
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
    </div>
  )
}
