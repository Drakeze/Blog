import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

type Source = "blog" | "reddit" | "twitter" | "linkedin" | "patreon"

interface BlogCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt: string
    date: string
    readTime: string
    source: Source
    image: string
  }
}

const sourceColors: Record<Source, string> = {
  blog: "bg-foreground text-background hover:bg-foreground/90",
  reddit: "bg-[#FF4500] text-white hover:bg-[#FF4500]/90",
  twitter: "bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90",
  linkedin: "bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90",
  patreon: "bg-[#FF424D] text-white hover:bg-[#FF424D]/90",
}

const sourceLabels: Record<Source, string> = {
  blog: "Blog",
  reddit: "Reddit",
  twitter: "Twitter/X",
  linkedin: "LinkedIn",
  patreon: "Patreon",
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="h-full bg-card border border-border rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:border-foreground/20">
        <div className="aspect-[3/2] overflow-hidden bg-muted">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Badge className={`${sourceColors[post.source]} px-2 py-1 text-xs`}>{sourceLabels[post.source]}</Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h2 className="text-xl font-serif font-bold leading-tight group-hover:text-primary transition-colors text-balance">
            {post.title}
          </h2>

          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 text-pretty">{post.excerpt}</p>

          <p className="text-sm text-muted-foreground">{post.date}</p>
        </div>
      </article>
    </Link>
  )
}
