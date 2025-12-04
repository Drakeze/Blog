import { cn } from "@/lib/utils"
import type { PostSource } from "@/data/posts"
import { Badge } from "@/components/ui/badge"

const SOURCE_LABELS: Record<PostSource, string> = {
  blog: "Blog",
  twitter: "Twitter",
  linkedin: "LinkedIn",
  reddit: "Reddit",
  patreon: "Patreon",
}

const SOURCE_STYLES: Record<PostSource, string> = {
  blog: "bg-emerald-600 text-white",
  twitter: "bg-sky-500 text-white",
  linkedin: "bg-blue-700 text-white",
  reddit: "bg-orange-500 text-white",
  patreon: "bg-rose-500 text-white",
}

export function SourceBadge({ source, className }: { source: PostSource; className?: string }) {
  return (
    <Badge tone="muted" className={cn("border-none text-xs font-semibold uppercase", SOURCE_STYLES[source], className)}>
      {SOURCE_LABELS[source]}
    </Badge>
  )
}
