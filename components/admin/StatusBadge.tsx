import { Badge } from "@/components/ui/badge"
import type { PostStatus } from "@/data/posts"

type StatusBadgeProps = {
  status: PostStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isPublished = status === "published"

  return (
    <Badge
      variant={isPublished ? "default" : "secondary"}
      className={
        isPublished
          ? "rounded-full bg-emerald-500/15 text-emerald-700 shadow-none"
          : "rounded-full bg-muted text-foreground/80 shadow-none"
      }
    >
      {status}
    </Badge>
  )
}
