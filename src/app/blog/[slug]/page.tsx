import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, ExternalLink } from "lucide-react"

// This would come from your database/API
const getPost = (slug: string) => {
  return {
    title: "The Future of Web Development: Trends to Watch in 2025",
    excerpt: "Exploring the latest innovations in web technology and what they mean for developers.",
    content: `
      <p>The web development landscape continues to evolve at a rapid pace. As we move into 2025, several key trends are shaping how we build digital experiences.</p>
      
      <h2>Server Components and Progressive Enhancement</h2>
      <p>React Server Components have fundamentally changed how we think about rendering. By moving more logic to the server, we can deliver faster, more efficient applications while maintaining excellent user experiences.</p>
      
      <h2>AI-Powered Development Tools</h2>
      <p>The integration of AI into development workflows is no longer experimental—it's essential. From code generation to automated testing, AI tools are augmenting developer capabilities in unprecedented ways.</p>
      
      <h2>Edge Computing Goes Mainstream</h2>
      <p>Edge computing has moved from a niche optimization to a standard architecture pattern. By processing requests closer to users, we can deliver sub-50ms response times globally.</p>
      
      <p>These trends aren't just technical curiosities—they represent fundamental shifts in how we approach web development. The developers who adapt to these changes will be well-positioned for the future.</p>
    `,
    author: "Your Name",
    date: "Dec 1, 2025",
    readTime: "8 min read",
    source: "blog" as const,
    sourceUrl: null,
    tags: ["web development", "trends", "technology"],
    image: "/modern-web-development-abstract.jpg",
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)

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

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Hero Image */}
        {post.image && (
          <div className="mb-12 -mx-4 sm:mx-0">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full aspect-[2/1] object-cover rounded-none sm:rounded-2xl"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance leading-tight">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold">
              {post.author[0]}
            </div>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-muted-foreground">
                {post.date} · {post.readTime}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge className={`${sourceColors[post.source]} px-3 py-1`}>{sourceLabels[post.source]}</Badge>
            {post.sourceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Original
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg prose-slate dark:prose-invert max-w-none
            prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share this article
          </h3>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter/X
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
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
