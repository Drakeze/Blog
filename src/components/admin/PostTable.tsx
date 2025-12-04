"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonStyles } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Select } from "@/components/ui/select"
import type { BlogPostSummary, PostStatus } from "@/data/posts"

const PAGE_SIZE = 5

type PostTableProps = {
  posts: BlogPostSummary[]
}

type FilterState = {
  tag: string
  status: PostStatus | "all"
  maxReadTime: string
  date: string
}

export default function PostTable({ posts }: PostTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    tag: "all",
    status: "all",
    maxReadTime: "0",
    date: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const uniqueTags = useMemo(() => Array.from(new Set(posts.flatMap((post) => post.tags))), [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const tagMatch = filters.tag === "all" ? true : post.tags.includes(filters.tag)
      const statusMatch = filters.status === "all" ? true : post.status === filters.status
      const readTimeMatch =
        filters.maxReadTime && Number(filters.maxReadTime) > 0
          ? post.readTimeMinutes <= Number(filters.maxReadTime)
          : true
      const dateMatch = filters.date ? post.date.startsWith(filters.date) : true
      return tagMatch && statusMatch && readTimeMatch && dateMatch
    })
  }, [filters, posts])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pagedPosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE)

  const handleDelete = async (id: number) => {
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
    <Card>
      <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle>Posts</CardTitle>
          <CardDescription>Filter by tag, publish status, read time, or date.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Select
            value={filters.tag}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, tag: event.target.value }))
            }}
            className="min-w-[150px]"
          >
            <option value="all">All tags</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
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
          <Input
            type="number"
            min={0}
            value={filters.maxReadTime}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, maxReadTime: event.target.value }))
            }}
            placeholder="Max read time"
            className="w-36"
          />
          <Input
            type="date"
            value={filters.date}
            onChange={(event) => {
              setCurrentPage(1)
              setFilters((prev) => ({ ...prev, date: event.target.value }))
            }}
            className="min-w-[170px]"
          />
        </div>
      </CardHeader>

      {error && <p className="px-6 text-sm text-red-600">{error}</p>}

      <CardContent className="overflow-x-auto px-0">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Tags</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Read</th>
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
                <td className="px-6 py-4">
                  <Badge tone={post.status === "published" ? "default" : "outline"}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{post.readTime}</td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(post.date).toLocaleDateString()}</td>
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
