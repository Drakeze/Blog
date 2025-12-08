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
    <div className="mb-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <Button
            key={source}
            variant={activeSource === source ? "default" : "outline"}
            onClick={() => onSourceChange(source)}
            className="rounded-full capitalize"
          >
            {source === "all" ? "All" : source === "twitter" ? "Twitter/X" : source}
          </Button>
        ))}
      </div>

      <Select value={activeTag} onValueChange={onTagChange}>
        <SelectTrigger className="w-[200px]">
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
