import { BackButton } from "@/components/admin/BackButton"
import PostEditor from "@/components/admin/PostEditor"
import { requireAdmin } from "@/lib/auth"

export default async function CreatePostPage() {
  await requireAdmin()
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Create post</h1>
        </div>
        <BackButton label="Back to posts" />
      </div>
      <PostEditor mode="create" />
    </div>
  )
}
