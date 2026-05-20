import { notFound } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongo"
import type { Post } from "@/models/post"
import { PostEditor } from "@/components/admin/post-editor"

export const metadata = { title: "Edit Post" }

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = await getDb()
  const raw = await db.collection<Post>("posts").findOne({ slug })
  if (!raw) notFound()

  const { _id, ...rest } = raw
  const post = { ...rest, _id: String(_id) }

  const user = await currentUser()

  return (
    <PostEditor
      post={post}
      authorId={user?.id ?? ""}
      authorName={user?.fullName ?? user?.username ?? "Admin"}
      authorImageUrl={user?.imageUrl}
    />
  )
}
