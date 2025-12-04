"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button, buttonStyles } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Select } from "@/components/ui/select"
import { SourceBadge } from "@/components/source-badge"
import type { BlogPostSummary, PostSource, PostStatus } from "@/data/posts"

const PAGE_SIZE = 5

type PostTableProps = {
  posts: BlogPostSummary[]
}

type FilterState = {
  status: PostStatus | "all"
  source: PostSource | "all"
  search: string
}

type SortField = "updatedAt" | "createdAt" | "title"
type SortOrder = "asc" | "desc"

export default function PostTable({ posts }: PostTableProps) {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>({ status: "all", source: "all", search: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("updatedAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const uniqueSources = useMemo(() => Array.from(new Set(posts.map((post) => post.source))), [posts])

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const statusMatch = filters.status === "all" ? true : post.status === filters.status
        const sourceMatch = filters.source === "all" ? true : post.source === filters.source
        const search = filters.search.toLowerCase().trim()
        const searchMatch =
          search.length === 0 ||
          post.title.toLowerCase().includes(search) ||
          post.excerpt.toLowerCase().includes(search)

        return statusMatch && sourceMatch && searchMatch
      })
      .sort((a, b) => {
        const direction = sortOrder === "asc" ? 1 : -1

        if (sortField === "title") {
          return a.title.localeCompare(b.title) * direction
        }

        const aDate = new Date(a[sortField]).getTime()
        const bDate = new Date(b[sortField]).getTime()
        return (aDate - bDate) * direction
      })
  }, [filters, posts, sortField, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pagedPosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE)

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this post?")
    if (!confirmed) return
    setError(null)
    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Unable to delete post")
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post")
    }
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  return (
    <Card>
      <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle>Posts</CardTitle>
          <CardDescription>Search, sort, and manage your published or draft posts.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Input
            type="search"
            value={filters.search}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, search: event.target.value }))
            }}
            placeholder="Search by title"
            className="w-52"
          />
          <Select
            value={filters.source}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, source: event.target.value as PostSource | "all" }))
            }}
            className="min-w-[150px]"
          >
            <option value="all">All sources</option>
            {uniqueSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </Select>
          <Select
            value={filters.status}
            onChange={(event) => {
              setCurrentPage(1)
              const value = event.target.value as PostStatus | "all"
              setFilters((prev) => ({ ...prev, status: value }))
            }}
            className="min-w-[150px]"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </Select>
        </div>
      </CardHeader>

      {error && <p className="px-6 text-sm text-red-600">{error}</p>}

      <CardContent className="overflow-x-auto px-0">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Hero</th>
              <th className="px-6 py-3">
                <button
                  type="button"
                  onClick={() => toggleSort("title")}
                  className="flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Title
                  {sortField === "title" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </button>
              </th>
              <th className="px-6 py-3">Tags</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Read</th>
              <th className="px-6 py-3">
                <button
                  type="button"
                  onClick={() => toggleSort("createdAt")}
                  className="flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Created
                  {sortField === "createdAt" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </button>
              </th>
              <th className="px-6 py-3">
                <button
                  type="button"
                  onClick={() => toggleSort("updatedAt")}
                  className="flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  Updated
                  {sortField === "updatedAt" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </button>
              </th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {pagedPosts.map((post) => (
              <tr key={post.id} className="transition-colors hover:bg-muted/40">
                <td className="px-6 py-4">
                  <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                    <img src={post.heroImage ?? "/placeholder.jpg"} alt={post.title} className="h-full w-full object-cover" />
                  </div>
                </td>
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
                <td className="px-6 py-4">
                  <SourceBadge source={post.source} />
                </td>
                <td className="px-6 py-4">
                  <Badge tone={post.status === "published" ? "default" : "outline"}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{post.readTime}</td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(post.updatedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className={buttonStyles("outline", "sm")}
                    >
                      Edit
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => void handleDelete(post.id)}
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
