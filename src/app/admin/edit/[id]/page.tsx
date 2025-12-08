import { notFound } from "next/navigation"

import PostEditor from "@/components/admin/PostEditor"
import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { getPostById } from "@/data/posts"

export default function EditPostPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id)
  if (!Number.isFinite(postId)) {
    notFound()
  }

  const post = getPostById(postId)
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="container mx-auto px-4 py-12 max-w-5xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-serif font-bold">Edit: {post.title}</h1>
        </div>
        <PostEditor mode="edit" initialPost={post} />
      </main>
      <BlogFooter />
    </div>
  )
}
