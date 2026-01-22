"use client"

import { useMemo, useState } from "react"

import { BlogFilters } from "@/components/blog-filters"
import { BlogGrid } from "@/components/blog-grid"
import { Input } from "@/components/ui/input"
import type { BlogPostSummary, PostSource } from "@/data/posts"

const DEFAULT_PAGE_SIZE = 6

type BlogCollectionProps = {
  posts: BlogPostSummary[]
  enablePagination?: boolean
  pageSize?: number
}

export function BlogCollection({ posts, enablePagination = false, pageSize = DEFAULT_PAGE_SIZE }: BlogCollectionProps) {
  const [activeTag, setActiveTag] = useState("all")
  const [activeSource, setActiveSource] = useState<PostSource | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  const tags = useMemo(
    () => ["all", ...Array.from(new Set(posts.flatMap((post) => post.tags)))],
    [posts]
  )

  const sources = useMemo(
    () => ["all" as const, ...Array.from(new Set(posts.map((post) => post.source)))] as (PostSource | "all")[],
    [posts]
  )

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim()

    return posts.filter((post) => {
      const matchesTag = activeTag === "all" || post.tags.includes(activeTag)
      const matchesSource = activeSource === "all" || post.source === activeSource
      const matchesSearch =
        normalizedSearch.length === 0 ||
        post.title.toLowerCase().includes(normalizedSearch) ||
        post.excerpt.toLowerCase().includes(normalizedSearch) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))

      return matchesTag && matchesSearch && matchesSource
    })
  }, [activeSource, activeTag, posts, searchTerm])

  const totalPages = enablePagination ? Math.max(1, Math.ceil(filteredPosts.length / pageSize)) : 1
  const startIndex = enablePagination ? (page - 1) * pageSize : 0
  const visiblePosts = enablePagination
    ? filteredPosts.slice(startIndex, startIndex + pageSize)
    : filteredPosts

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleTagChange = (value: string) => {
    setActiveTag(value)
    setPage(1)
  }

  const handleSourceChange = (value: PostSource | "all") => {
    setActiveSource(value)
    setPage(1)
  }

  return (
    <div className="space-y-12">
      <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm space-y-6">
        <div className="w-full">
          <Input
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search posts by title, excerpt, or tag"
            className="h-12 rounded-full border-border bg-background/70 px-5 text-sm shadow-none"
          />
        </div>

        <BlogFilters
          sources={sources}
          tags={tags}
          activeSource={activeSource}
          activeTag={activeTag}
          onSourceChange={handleSourceChange}
          onTagChange={handleTagChange}
        />
      </div>

      <BlogGrid posts={visiblePosts} />

      {enablePagination && totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/70 p-4 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredPosts.length)} of {filteredPosts.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-full border border-border bg-background px-4 py-2 text-foreground shadow-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="rounded-full border border-border bg-background px-4 py-2 text-foreground shadow-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
