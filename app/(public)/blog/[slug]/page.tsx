import { cache } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongo"
import { renderMarkdown } from "@/lib/markdown"
import { isAdmin } from "@/lib/auth"
import { publicEnv } from "@/lib/env"
import type { Post } from "@/models/post"
import type { Bookmark } from "@/models/bookmark"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CommentsSection } from "@/components/comments-section"
import { BookmarkButton } from "@/components/bookmark-button"
import { SubscribeForm } from "@/components/subscribe-form"
import { Separator } from "@/components/ui/separator"
import { formatDate, readingTime, getTagColorClasses, cn, toIsoOrUndefined } from "@/lib/utils"
import type { Metadata } from "next"

export const revalidate = 60

const siteUrl = (publicEnv.NEXT_PUBLIC_SITE_URL || "https://blog.drakeze.com").replace(/\/$/, "")

// Deduped across generateMetadata + the page render within one request.
const getPost = cache(async (slug: string) => {
  const db = await getDb()
  return db.collection<Post>("posts").findOne({ slug })
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const url = `${siteUrl}/blog/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    authors: post.authorName ? [{ name: post.authorName }] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: toIsoOrUndefined(post.publishedAt),
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const { userId } = await auth()
  const admin = await isAdmin()

  // Only admins can preview drafts
  if (post.status === "draft" && !admin) notFound()

  // Check if user has bookmarked this post
  let isBookmarked = false
  if (userId) {
    const db = await getDb()
    const bookmark = await db.collection<Bookmark>("bookmarks").findOne({ userId, postSlug: slug })
    isBookmarked = !!bookmark
  }

  const html = renderMarkdown(post.content)
  const mins = readingTime(post.content)
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: toIsoOrUndefined(post.publishedAt),
    dateModified: toIsoOrUndefined(post.updatedAt),
    author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
    mainEntityOfPage: canonicalUrl,
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <header className="mb-8 space-y-4">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
                <Badge className={cn("border-transparent", getTagColorClasses(tag))}>{tag}</Badge>
              </Link>
            ))}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Post body */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      <Separator className="my-12" />

      {/* Newsletter */}
      <Card className="rounded-xl bg-muted/30 p-6 mb-12">
        <h3 className="font-semibold mb-1">Enjoyed this post?</h3>
        <p className="text-sm text-muted-foreground mb-4">Get new posts delivered straight to your inbox.</p>
        <SubscribeForm userId={userId ?? undefined} />
      </Card>

      {/* Patreon */}
      <Card className="flex items-center justify-between gap-4 rounded-xl bg-muted/30 px-6 py-4 mb-12">
        <p className="text-sm text-muted-foreground">☕ Enjoying the content?</p>
        <a
          href="https://www.patreon.com/cw/Drakeze"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline whitespace-nowrap"
        >
          Support on Patreon →
        </a>
      </Card>

      {/* Comments */}
      <CommentsSection postId={slug} userId={userId ?? undefined} isAdmin={admin} />
    </article>
  )
}
