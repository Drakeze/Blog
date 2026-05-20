import Link from "next/link"
import { getDb } from "@/lib/mongo"
import type { Post } from "@/models/post"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"

export const metadata = { title: "Posts" }

export default async function PostsPage() {
  const db = await getDb()
  const posts = await db
    .collection<Post>("posts")
    .find({}, { projection: { content: 0 } })
    .sort({ createdAt: -1 })
    .toArray()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">{posts.length} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        {posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground text-sm">No posts yet.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/admin/posts/new">Write your first post</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <div key={String(post._id)} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{post.title}</p>
                    <Badge variant={post.status === "published" ? "default" : "secondary"} className="shrink-0">
                      {post.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                    {post.tags.length > 0 && (
                      <p className="text-xs text-muted-foreground">{post.tags.join(", ")}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {post.status === "published" && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/blog/${post.slug}`} target="_blank">View</Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/posts/${post.slug}`}>Edit</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
