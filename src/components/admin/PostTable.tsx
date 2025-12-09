"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import type { BlogPostSummary } from "@/data/posts"

const PAGE_SIZE = 5

type PostTableProps = {
  posts: BlogPostSummary[]
}

type FilterState = {
  tag: string
  source: string
  maxReadTime: string
  createdAt: string
  search: string
  sort: 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'source'
}

export default function PostTable({ posts }: PostTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    tag: "all",
    source: "all",
    maxReadTime: "0",
    createdAt: "",
    search: "",
    sort: "date-desc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const uniqueTags = useMemo(() => Array.from(new Set(posts.flatMap((post) => post.tags))), [posts])
  const uniqueSources = useMemo(() => Array.from(new Set(posts.map((post) => post.source))), [posts])

  const filteredPosts = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase()
    const filtered = posts.filter((post) => {
      const tagMatch = filters.tag === "all" ? true : post.tags.includes(filters.tag)
      const sourceMatch = filters.source === "all" ? true : post.source === filters.source
      const readTimeMatch =
        filters.maxReadTime && Number(filters.maxReadTime) > 0
          ? post.readTimeMinutes <= Number(filters.maxReadTime)
          : true
      const dateMatch = filters.createdAt ? post.createdAt.startsWith(filters.createdAt) : true
      const searchMatch =
        normalizedSearch.length === 0 ||
        post.title.toLowerCase().includes(normalizedSearch) ||
        post.excerpt.toLowerCase().includes(normalizedSearch) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))

      return tagMatch && sourceMatch && readTimeMatch && dateMatch && searchMatch
    })

    return [...filtered].sort((a, b) => {
      switch (filters.sort) {
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        case "source":
          return a.source.localeCompare(b.source)
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "date-desc":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
  }, [filters, posts])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pagedPosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE)

  const handleDelete = async (id: number, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`)
    if (!confirmed) return

    setError(null)
    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Unable to delete post")
      }
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post")
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="gap-4 border-b border-border bg-card/50 md:flex-row md:items-center md:justify-between md:rounded-t-2xl">
        <div className="space-y-1">
          <CardTitle className="text-xl">Posts</CardTitle>
          <CardDescription>Filter by tag, source, read time, or date.</CardDescription>
        </div>
        <div className="flex w-full flex-wrap gap-3 text-sm md:w-auto">
          <Input
            type="search"
            value={filters.search}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, search: event.target.value }))
            }}
            placeholder="Search title or tags"
            className="h-10 w-full min-w-[200px] rounded-lg border-border bg-background/70 md:w-48"
          />
          <select
            value={filters.tag}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, tag: event.target.value }))
            }}
            className="min-w-[150px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All tags</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <select
            value={filters.source}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, source: event.target.value }))
            }}
            className="min-w-[150px] rounded-lg border border-border bg-background px-3 py-2 text-sm capitalize"
          >
            <option value="all">All sources</option>
            {uniqueSources.map((source) => (
              <option key={source} value={source} className="capitalize">
                {source}
              </option>
            ))}
          </select>
          <Input
            type="number"
            min={0}
            value={filters.maxReadTime}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, maxReadTime: event.target.value }))
            }}
            placeholder="Max read time"
            className="h-10 w-36 rounded-lg border-border bg-background/70"
          />
          <Input
            type="date"
            value={filters.createdAt}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, createdAt: event.target.value }))
            }}
            className="h-10 min-w-[170px] rounded-lg border-border bg-background/70"
          />
          <select
            value={filters.sort}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, sort: event.target.value as FilterState["sort"] }))
            }}
            className="min-w-[160px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="source">Source</option>
          </select>
        </div>
      </CardHeader>

      {error && <p className="px-6 text-sm text-red-600">{error}</p>}

      <CardContent className="overflow-hidden px-0">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Tags</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Read</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {pagedPosts.map((post) => (
              <tr key={post.id} className="transition-colors hover:bg-muted/40">
                <td className="px-6 py-4 font-semibold text-foreground">{post.title}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} tone="muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 capitalize text-muted-foreground">{post.source}</td>
                <td className="px-6 py-4 text-muted-foreground">{post.readTime}</td>
                <td className="px-6 py-4 capitalize text-muted-foreground">
                  <Badge
                    variant={post.status === "published" ? "default" : "secondary"}
                    className={
                      post.status === "published"
                        ? "rounded-full bg-emerald-500/15 text-emerald-700 shadow-none"
                        : "rounded-full bg-muted text-foreground/80 shadow-none"
                    }
                  >
                    {post.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <Button asChild variant="outline" size="sm" className="rounded-full px-4">
                      <Link href={`/admin/edit/${post.id}`}>Edit</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-destructive hover:bg-destructive/10"
                      onClick={() => void handleDelete(post.id, post.title)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filteredPosts.length)} of {filteredPosts.length}
        </p>
        <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      </CardFooter>
    </Card>
  )
}
