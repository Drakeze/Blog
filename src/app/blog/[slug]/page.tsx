import { notFound } from "next/navigation"
import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, ExternalLink } from "lucide-react"

import { getPostBySlug } from "@/data/posts"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const postUrl = `${siteUrl}/blog/${post.slug}`

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        {post.heroImage && (
          <div className="mb-12 -mx-4 sm:mx-0">
            <img
              src={post.heroImage || "/placeholder.svg"}
              alt={post.title}
              className="w-full aspect-[2/1] object-cover rounded-none sm:rounded-2xl"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
          <div className="space-y-1">
            <p className="font-medium">{new Date(post.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-muted-foreground">{post.readTime}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge className={`${sourceColors[post.source]} px-3 py-1`}>{sourceLabels[post.source]}</Badge>
            {post.sourceURL && (
              <Button variant="outline" size="sm" asChild>
                <a href={post.sourceURL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Original
                </a>
              </Button>
            )}
          </div>
        </div>

        <div
          className="prose prose-lg prose-slate dark:prose-invert max-w-none
            prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share this article
          </h3>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter/X
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
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
