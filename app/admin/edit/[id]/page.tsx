import { notFound } from "next/navigation"

import { BackButton } from "@/components/admin/BackButton"
import PostEditor from "@/components/admin/PostEditor"
import { requireAdmin } from "@/lib/auth"
import { getPostById } from "@/data/posts"
import { emailConfig } from "@/lib/env"

type EditPostPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id: postId } = await params

  await requireAdmin(`/admin/edit/${postId}`)

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
      <PostEditor
        mode="edit"
        initialPost={post}
        emailDeliveryAvailable={emailConfig.resendEnabled}
        missingEmailKeys={emailConfig.resendMissingKeys}
      />
    </div>
  )
}
