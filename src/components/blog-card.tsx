import Image from "next/image"
import Link from "next/link"

import type { BlogPostSummary } from "@/data/posts"

interface BlogCardProps {
  post: BlogPostSummary & { image?: string }
}

const FALLBACK_IMAGE = "/placeholder.jpg"

export function BlogCard({ post }: BlogCardProps) {
  const imageSrc = post.image ?? FALLBACK_IMAGE

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="h-full overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg">
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-1 text-foreground">{post.category}</span>
            <span>{post.readTime}</span>
          </div>

          <h2 className="text-balance font-serif text-xl font-bold leading-tight transition-colors group-hover:text-primary">
            {post.title}
          </h2>

          <p className="text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-3">{post.excerpt}</p>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-border px-2 py-1">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
