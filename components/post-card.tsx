import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatDate, readingTime } from "@/lib/utils"
import type { PostSummary } from "@/models/post"

interface PostCardProps {
  post: PostSummary
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors">
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-5">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <h2 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {post.authorImageUrl && (
              <Image
                src={post.authorImageUrl}
                alt={post.authorName}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span>{post.authorName}</span>
            <span>·</span>
            <span>{post.publishedAt ? formatDate(post.publishedAt) : "Draft"}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
