"use client"

import { Select } from "@/components/ui/select"

type BlogFiltersProps = {
  sources: string[]
  tags: string[]
  activeSource: string
  activeTag: string
  onSourceChange: (value: string) => void
  onTagChange: (value: string) => void
}

export function BlogFilters({ sources, tags, activeSource, activeTag, onSourceChange, onTagChange }: BlogFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2 text-sm">
        {sources.map((source) => (
          <button
            key={source}
            type="button"
            onClick={() => onSourceChange(source)}
            className={`rounded-full px-4 py-2 font-semibold transition ${
              activeSource === source
                ? "bg-foreground text-background shadow"
                : "border border-border/70 text-foreground hover:border-foreground"
            }`}
          >
            {source === "all" ? "All sources" : source}
          </button>
        ))}
      </div>

      <Select
        value={activeTag}
        onChange={(event) => onTagChange(event.target.value)}
        className="w-[220px]"
      >
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag === "all" ? "All tags" : tag}
          </option>
        ))}
      </Select>
    </div>
  )
}
