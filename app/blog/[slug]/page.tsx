import { ExternalLink,Share2 } from "lucide-react"
import { notFound } from "next/navigation"

import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPostBySlug } from "@/data/posts"
import { publicEnv } from "@/lib/env"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const sourceColors = {
    blog: "bg-foreground text-background",
    reddit: "bg-[#FF4500] text-white",
    twitter: "bg-[#1DA1F2] text-white",
    linkedin: "bg-[#0A66C2] text-white",
    patreon: "bg-[#FF424D] text-white",
  }

  const sourceLabels = {
    blog: "Blog Post",
    reddit: "Reddit",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    patreon: "Patreon",
  }

  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL
  const postUrl = `${siteUrl}/blog/${post.slug}`

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <article className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
        {post.heroImage && (
          <div className="mb-12 overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
            <img
              src={post.heroImage || "/placeholder.svg"}
              alt={post.title}
              className="aspect-[2/1] w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <h1 className="text-balance leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/60 p-4 shadow-sm">
            <div className="space-y-1 text-sm md:text-base">
              <p className="font-semibold tracking-tight">{new Date(post.createdAt).toLocaleDateString()}</p>
              <p className="text-muted-foreground">{post.readTime}</p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Badge className={`${sourceColors[post.source]} px-3 py-1.5 text-xs font-semibold tracking-tight shadow-sm`}>
                {sourceLabels[post.source]}
              </Badge>
              {post.source !== "blog" && post.externalUrl && (
                <Button variant="outline" size="sm" asChild className="rounded-full border-border px-4">
                  <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Original
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div
          className="prose prose-lg prose-slate mt-10 max-w-none dark:prose-invert
            prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:mt-12 prose-h2:mb-6
            prose-p:leading-relaxed prose-p:mb-6 prose-li:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 flex flex-wrap gap-2 rounded-2xl border border-border bg-card/50 p-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Share2 className="h-5 w-5" />
            Share this article
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild className="rounded-full px-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter/X
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="rounded-full px-4">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="rounded-full px-4">
              <a
                href={`https://www.reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reddit
              </a>
            </Button>
          </div>
        </div>
      </article>

      <BlogFooter />
    </div>
  )
}
