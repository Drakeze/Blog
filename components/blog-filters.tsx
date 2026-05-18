"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PostSource } from "@/data/posts"

type BlogFiltersProps = {
  sources: (PostSource | "all")[]
  tags: string[]
  activeSource: PostSource | "all"
  activeTag: string
  onSourceChange: (source: PostSource | "all") => void
  onTagChange: (tag: string) => void
}

export function BlogFilters({ sources, tags, activeSource, activeTag, onSourceChange, onTagChange }: BlogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {sources.map((source) => (
        <Button
          key={source}
          variant="ghost"
          onClick={() => onSourceChange(source)}
          className={`h-8 rounded-full px-4 text-sm capitalize transition-colors ${
            activeSource === source
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          {source === "all" ? "All" : source}
        </Button>
      ))}

      {tags.length > 2 && (
        <Select value={activeTag} onValueChange={onTagChange}>
          <SelectTrigger className="h-8 w-auto min-w-35 rounded-full border-border bg-background text-sm">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag} className="capitalize">
                {tag === "all" ? "All tags" : tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
