"use client"

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
          <button
            key={filter}
            onClick={() => onCategoryChange(filter)}
            className={`rounded-full border px-3 py-2 text-sm ${
              activeCategory === filter
                ? "bg-foreground text-background"
                : "bg-background text-foreground hover:bg-muted"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <select
        value={activeTag}
        onChange={(event) => onTagChange(event.target.value)}
        className="w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag === "all" ? "All tags" : tag}
          </option>
        ))}
      </select>
    </div>
  )
}
