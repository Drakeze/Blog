"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

type FilterType = "all" | "blog" | "reddit" | "twitter" | "linkedin" | "patreon"

export function BlogFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "blog", label: "Blog" },
    { value: "reddit", label: "Reddit" },
    { value: "twitter", label: "Twitter/X" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "patreon", label: "Patreon" },
  ]

  return (
    <div className="mb-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            onClick={() => setActiveFilter(filter.value)}
            className="rounded-full"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tags</SelectItem>
          <SelectItem value="web-dev">Web Development</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="ai">AI & ML</SelectItem>
          <SelectItem value="career">Career</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
