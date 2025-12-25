"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"

type AdminTableActionsProps = {
  postId: string
  postTitle: string
  onDeleteError?: (message: string | null) => void
}

export function AdminTableActions({ postId, postTitle, onDeleteError }: AdminTableActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${postTitle}"? This cannot be undone.`)
    if (!confirmed) return

    onDeleteError?.(null)
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Unable to delete post")
      }
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete post"
      onDeleteError?.(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 text-xs font-semibold">
      <Button asChild variant="outline" size="sm" className="rounded-full px-4" disabled={isDeleting}>
        <Link href={`/admin/edit/${postId}`}>Edit</Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="rounded-full text-destructive hover:bg-destructive/10"
        onClick={() => void handleDelete()}
        disabled={isDeleting}
      >
        Delete
      </Button>
    </div>
  )
}
