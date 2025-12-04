"use client"

import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

type BlogFiltersProps = {
  categories: string[]
  tags: string[]
  activeCategory: string
  activeTag: string
  onCategoryChange: (value: string) => void
  onTagChange: (value: string) => void
}

export function BlogFilters({
  categories,
  tags,
  activeCategory,
  activeTag,
  onCategoryChange,
  onTagChange,
}: BlogFiltersProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-wrap gap-2">
        {categories.map((filter) => (
          <Button
            key={filter}
            variant={activeCategory === filter ? "primary" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      <Select
        value={activeTag}
        onChange={(event) => onTagChange(event.target.value)}
        className="w-[200px]"
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
