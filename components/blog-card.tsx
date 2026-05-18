import Image from "next/image"
import Link from "next/link"

import type { BlogPostSummary } from "@/data/posts"

const sourceBadgeColors: Record<BlogPostSummary["source"], string> = {
  blog: "bg-foreground/80 text-background",
  reddit: "bg-[#FF4500]/90 text-white",
}

const sourceLabels: Record<BlogPostSummary["source"], string> = {
  blog: "Blog",
  reddit: "Reddit",
}

export function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">

        {/* Image with badge overlay */}
        <div className="relative aspect-16/10 overflow-hidden bg-muted">
          <Image
            src={post.heroImage ?? "/placeholder.svg"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${sourceBadgeColors[post.source]}`}>
              {sourceLabels[post.source]}
            </span>
          </div>
        </div>

        {/* Text content */}
        <div className="flex h-full flex-col gap-2 p-5">
          <h2 className="text-base font-bold leading-snug tracking-tight text-balance transition-colors group-hover:text-primary line-clamp-2">
            {post.title}
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 text-pretty">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-1 text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>

      </article>
    </Link>
  )
}
