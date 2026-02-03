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
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 shadow-sm sm:flex-row sm:items-center">
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <Button
            key={source}
            variant={activeSource === source ? "default" : "outline"}
            onClick={() => onSourceChange(source)}
            className="rounded-full px-4 py-2 text-sm capitalize shadow-none"
          >
            {source === "all" ? "All" : source === "twitter" ? "Twitter/X" : source}
          </Button>
        ))}
      </div>

      <Select value={activeTag} onValueChange={onTagChange}>
        <SelectTrigger className="w-[220px] rounded-full bg-background text-sm shadow-none">
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
    </div>
  )
}
