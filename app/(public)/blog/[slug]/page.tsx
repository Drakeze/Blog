import { notFound } from "next/navigation"
import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { marked } from "marked"
import { getDb } from "@/lib/mongo"
import { isAdmin } from "@/lib/auth"
import type { Post } from "@/models/post"
import type { Bookmark } from "@/models/bookmark"
import { Badge } from "@/components/ui/badge"
import { CommentsSection } from "@/components/comments-section"
import { BookmarkButton } from "@/components/bookmark-button"
import { SubscribeForm } from "@/components/subscribe-form"
import { Separator } from "@/components/ui/separator"
import { formatDate, readingTime } from "@/lib/utils"
import type { Metadata } from "next"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const db = await getDb()
  const post = await db.collection<Post>("posts").findOne({ slug })
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.coverImage ? [post.coverImage] : [] },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const db = await getDb()
  const post = await db.collection<Post>("posts").findOne({ slug })

  if (!post) notFound()

  const { userId } = await auth()
  const admin = await isAdmin()

  // Only admins can preview drafts
  if (post.status === "draft" && !admin) notFound()

  // Check if user has bookmarked this post
  let isBookmarked = false
  if (userId) {
    const bookmark = await db.collection<Bookmark>("bookmarks").findOne({ userId, postSlug: slug })
    isBookmarked = !!bookmark
  }

  const html = marked.parse(post.content) as string
  const mins = readingTime(post.content)

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <header className="mb-8 space-y-4">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <a key={tag} href={`/?tag=${tag}`}>
                <Badge variant="secondary">{tag}</Badge>
              </a>
            ))}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{post.title}</h1>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {post.authorImageUrl && (
              <Image
                src={post.authorImageUrl}
                alt={post.authorName}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{post.authorName}</span>
            <span>·</span>
            <span>{post.publishedAt ? formatDate(post.publishedAt) : "Draft"}</span>
            <span>·</span>
            <span>{mins} min read</span>
          </div>
          <BookmarkButton
            postSlug={slug}
            postTitle={post.title}
            postExcerpt={post.excerpt}
            postCoverImage={post.coverImage}
            initialBookmarked={isBookmarked}
            isSignedIn={!!userId}
          />
        </div>
      </header>

      {post.coverImage && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted mb-10">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Post body */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      <Separator className="my-12" />

      {/* Newsletter */}
      <div className="rounded-xl border border-border bg-muted/30 p-6 mb-12">
        <h3 className="font-semibold mb-1">Enjoyed this post?</h3>
        <p className="text-sm text-muted-foreground mb-4">Get new posts delivered straight to your inbox.</p>
        <SubscribeForm userId={userId ?? undefined} />
      </div>

      {/* Patreon */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-6 py-4 mb-12">
        <p className="text-sm text-muted-foreground">☕ Enjoying the content?</p>
        <a
          href="https://www.patreon.com/cw/Drakeze"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline whitespace-nowrap"
        >
          Support on Patreon →
        </a>
      </div>

      {/* Comments */}
      <CommentsSection postId={slug} userId={userId ?? undefined} isAdmin={admin} />
    </article>
  )
}
