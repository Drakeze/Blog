import { notFound } from "next/navigation"

import { BackButton } from "@/components/admin/BackButton"
import PostEditor from "@/components/admin/PostEditor"
import { getPostById } from "@/data/posts"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const postId = params.id

  if (!/^[a-f0-9]{24}$/i.test(postId)) {
    notFound()
  }

  const post = await getPostById(postId)
  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-serif font-bold">Edit: {post.title}</h1>
        </div>
        <BackButton label="Back to posts" />
      </div>
      <PostEditor mode="edit" initialPost={post} />
    </div>
  )
}
