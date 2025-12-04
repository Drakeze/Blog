import Image from "next/image"
import { notFound } from "next/navigation"

import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { SourceBadge } from "@/components/source-badge"
import { getPostBySlug } from "@/data/posts"

function buildShareUrl(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  return new URL(
    `/blog/${slug}`,
    baseUrl
  ).toString()
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  const shareUrl = buildShareUrl(post.slug)
  const heroImage = post.heroImage ?? "/placeholder.jpg"

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <article className="container mx-auto max-w-3xl px-4 py-16">
        {heroImage && (
          <div className="-mx-4 mb-12 overflow-hidden sm:mx-0 sm:rounded-2xl">
            <div className="relative aspect-[2/1]">
              <Image
                src={heroImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <h1 className="mb-6 text-balance font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          {post.title}
        </h1>

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted font-semibold">
              {post.author[0]}
            </div>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()} · {post.readTime}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SourceBadge source={post.source} />
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-3 py-1 text-foreground">
                  {tag}
                </span>
              ))}
            </div>
            {post.source !== "blog" && post.sourceUrl && (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-primary underline-offset-4 hover:bg-muted"
              >
                View original
              </a>
            )}
          </div>
        </div>

        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-3 py-1 text-sm text-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <h3 className="mb-4 text-xl font-semibold">Share this article</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Twitter/X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              LinkedIn
            </a>
            <a
              href={`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Reddit
            </a>
          </div>
        </div>
      </article>

      <BlogFooter />
    </div>
  )
}
