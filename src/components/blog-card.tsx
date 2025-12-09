import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

import type { BlogPostSummary } from "@/data/posts"

const sourceColors: Record<BlogPostSummary["source"], string> = {
  blog: "bg-foreground text-background hover:bg-foreground/90",
  reddit: "bg-[#FF4500] text-white hover:bg-[#FF4500]/90",
  twitter: "bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90",
  linkedin: "bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90",
  patreon: "bg-[#FF424D] text-white hover:bg-[#FF424D]/90",
}

const sourceLabels: Record<BlogPostSummary["source"], string> = {
  blog: "Blog",
  reddit: "Reddit",
  twitter: "Twitter/X",
  linkedin: "LinkedIn",
  patreon: "Patreon",
}

export function BlogCard({ post }: { post: BlogPostSummary & { heroImage?: string } }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={post.heroImage || "/placeholder.svg"}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex h-full flex-col gap-4 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <Badge className={`${sourceColors[post.source]} px-3 py-1.5 text-[11px] font-semibold tracking-tight shadow-sm`}>{sourceLabels[post.source]}</Badge>
            <div className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h2 className="text-xl font-serif font-bold leading-tight tracking-tight text-balance transition-colors group-hover:text-primary">
            {post.title}
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 text-pretty">{post.excerpt}</p>

          <div className="mt-auto text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </article>
    </Link>
  )
}
