"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { BlogPostSummary } from "@/data/posts"

type AdminTableActionsProps = {
  post: BlogPostSummary
  onActionError?: (message: string | null) => void
}

export function AdminTableActions({ post, onActionError }: AdminTableActionsProps) {
  const router = useRouter()
  const [loadingAction, setLoadingAction] = useState<"delete" | "status" | "featured" | null>(null)

  const updatePost = async (payload: Record<string, unknown>, action: "status" | "featured") => {
    onActionError?.(null)
    setLoadingAction(action)

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Unable to update post")
      }

      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update post"
      onActionError?.(message)
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${post.title}"? This cannot be undone.`)
    if (!confirmed) return

    onActionError?.(null)
    setLoadingAction("delete")

    try {
      const response = await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Unable to delete post")
      }
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete post"
      onActionError?.(message)
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 text-xs font-semibold">
      <Button asChild variant="outline" size="sm" className="rounded-full px-4" disabled={loadingAction !== null}>
        <Link href={`/admin/edit/${post.id}`}>Edit</Link>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full px-4"
        onClick={() => void updatePost({ status: post.status === "published" ? "draft" : "published" }, "status")}
        disabled={loadingAction !== null}
      >
        {post.status === "published" ? "Unpublish" : "Publish"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full px-4"
        onClick={() => void updatePost({ featured: !post.featured }, "featured")}
        disabled={loadingAction !== null}
      >
        {post.featured ? "Unfeature" : "Feature"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="rounded-full text-destructive hover:bg-destructive/10"
        onClick={() => void handleDelete()}
        disabled={loadingAction !== null}
      >
        Delete
      </Button>
    </div>
  )
}
