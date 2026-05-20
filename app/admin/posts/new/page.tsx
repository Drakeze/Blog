import { currentUser } from "@clerk/nextjs/server"
import { PostEditor } from "@/components/admin/post-editor"

export const metadata = { title: "New Post" }

export default async function NewPostPage() {
  const user = await currentUser()

  return (
    <PostEditor
      authorId={user?.id ?? ""}
      authorName={user?.fullName ?? user?.username ?? "Admin"}
      authorImageUrl={user?.imageUrl}
    />
  )
}
