import PostEditor from "@/components/admin/PostEditor"
import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"

export default function CreatePostPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-12 md:px-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Create post</h1>
        </div>
        <PostEditor mode="create" />
      </main>
      <BlogFooter />
    </div>
  )
}
