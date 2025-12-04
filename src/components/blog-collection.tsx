"use client"

import { useMemo, useState } from "react"

import { BlogFilters } from "@/components/blog-filters"
import { BlogGrid } from "@/components/blog-grid"
import type { BlogPostSummary } from "@/data/posts"

const DEFAULT_PAGE_SIZE = 6

type BlogCollectionProps = {
  posts: Array<BlogPostSummary & { image?: string }>
  enablePagination?: boolean
  pageSize?: number
}

export function BlogCollection({ posts, enablePagination = false, pageSize = DEFAULT_PAGE_SIZE }: BlogCollectionProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeTag, setActiveTag] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.category)))],
    [posts]
  )

  const tags = useMemo(
    () => ["all", ...Array.from(new Set(posts.flatMap((post) => post.tags)))],
    [posts]
  )

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim()

    return posts.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory
      const matchesTag = activeTag === "all" || post.tags.includes(activeTag)
      const matchesSearch =
        normalizedSearch.length === 0 ||
        post.title.toLowerCase().includes(normalizedSearch) ||
        post.excerpt.toLowerCase().includes(normalizedSearch) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))

      return matchesCategory && matchesTag && matchesSearch
    })
  }, [activeCategory, activeTag, posts, searchTerm])

  const totalPages = enablePagination ? Math.max(1, Math.ceil(filteredPosts.length / pageSize)) : 1
  const startIndex = enablePagination ? (page - 1) * pageSize : 0
  const visiblePosts = enablePagination
    ? filteredPosts.slice(startIndex, startIndex + pageSize)
    : filteredPosts

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value)
    setPage(1)
  }

  const handleTagChange = (value: string) => {
    setActiveTag(value)
    setPage(1)
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-1/2">
          <input
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search posts by title, excerpt, or tag"
            className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <BlogFilters
        categories={categories}
        tags={tags}
        activeCategory={activeCategory}
        activeTag={activeTag}
        onCategoryChange={handleCategoryChange}
        onTagChange={handleTagChange}
      />

      <BlogGrid posts={visiblePosts} />

      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm">
          <div className="text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredPosts.length)} of {filteredPosts.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-border px-3 py-2 text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
              className="rounded-lg border border-border px-3 py-2 text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
