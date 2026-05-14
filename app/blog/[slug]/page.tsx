import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { LinkedInIcon, RedditIcon, XIcon } from "@/components/icons/social"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAdjacentPosts, getPostBySlug } from "@/data/posts"
import { publicEnv } from "@/lib/env"
import { renderPostContent } from "@/lib/render-post-content"

export const runtime = "nodejs"
export const revalidate = 60

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const description = post.excerpt.slice(0, 160)

  return {
    title: `${post.title} | Thinking Outside The Box`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      ...(post.heroImage ? { images: [{ url: post.heroImage, alt: post.title }] } : {}),
    },
    twitter: {
      card: post.heroImage ? "summary_large_image" : "summary",
      title: post.title,
      description,
      ...(post.heroImage ? { images: [post.heroImage] } : {}),
    },
    alternates: { canonical: postUrl },
  }
}

function relativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { prev, next } = await getAdjacentPosts(post.slug)

  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL
  const postUrl = `${siteUrl}/blog/${post.slug}`

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

          {/* Author header */}
          <div className="flex items-center gap-3 p-5 pb-4">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
              <Image
                src="/Minecraft Pfp 1.png"
                alt="Anthony Shead"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Anthony Shead</p>
              <p className="text-xs text-muted-foreground">
                {relativeDate(post.createdAt)} &middot; {post.readTime}
                {post.source === "reddit" && (
                  <span className="ml-1 inline-flex items-center rounded-full bg-[#FF4500]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#FF4500]">
                    Reddit
                  </span>
                )}
              </p>
            </div>
            {post.source === "reddit" && post.externalUrl && (
              <Button variant="outline" size="sm" asChild className="shrink-0 rounded-full text-xs px-3 h-7">
                <a href={post.externalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Original
                </a>
              </Button>
            )}
          </div>

          {/* Title */}
          <div className="px-5 pb-4">
            <h1 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">{post.title}</h1>
          </div>

          {/* Hero image */}
          {post.heroImage && (
            <div className="relative aspect-video w-full">
              <Image
                src={post.heroImage}
                alt={post.title}
                fill
                sizes="(max-width: 672px) 100vw, 672px"
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-sm sm:prose-base max-w-none px-5 py-5
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
              prose-p:leading-relaxed prose-p:mb-4
              prose-li:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderPostContent(post.content, post.title) }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 px-5 pb-4">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Share row */}
          <div className="flex items-center gap-1 border-t border-border px-5 py-3">
            <span className="mr-2 text-xs text-muted-foreground">Share</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-[#FF4500]" asChild>
              <a
                href={`https://www.reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Reddit"
              >
                <RedditIcon className="h-4 w-4" />
                <span className="sr-only">Share on Reddit</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-[#0077B5]" asChild>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
              >
                <LinkedInIcon className="h-4 w-4" />
                <span className="sr-only">Share on LinkedIn</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X / Twitter"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Share on X / Twitter</span>
              </a>
            </Button>
          </div>
        </article>

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <nav className="mt-6 grid grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </span>
                <span className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col items-end gap-1 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </span>
                <span className="line-clamp-2 text-right text-sm font-semibold leading-snug group-hover:text-primary">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </main>

      <BlogFooter />
    </div>
  )
}
