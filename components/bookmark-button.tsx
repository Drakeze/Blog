"use client"

import { useState } from "react"
import posthog from "posthog-js"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"

interface BookmarkButtonProps {
  postSlug: string
  postTitle: string
  postExcerpt: string
  postCoverImage?: string
  initialBookmarked: boolean
  isSignedIn: boolean
}

export function BookmarkButton({
  postSlug,
  postTitle,
  postExcerpt,
  postCoverImage,
  initialBookmarked,
  isSignedIn,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (!isSignedIn) {
      toast.error("Sign in to bookmark posts")
      return
    }
    setLoading(true)
    try {
      if (bookmarked) {
        await fetch(`/api/bookmarks?postSlug=${postSlug}`, { method: "DELETE" })
        setBookmarked(false)
        posthog.capture("post_bookmark_removed", { post_slug: postSlug, post_title: postTitle })
        toast.success("Bookmark removed")
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postSlug, postTitle, postExcerpt, postCoverImage }),
        })
        setBookmarked(true)
        posthog.capture("post_bookmarked", { post_slug: postSlug, post_title: postTitle })
        toast.success("Bookmarked!")
      }
    } catch {
      toast.error("Failed to update bookmark")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} disabled={loading} aria-label="Toggle bookmark">
      {loading
        ? <Loader2 className="h-4 w-4 animate-spin" />
        : bookmarked
          ? <BookmarkCheck className="h-4 w-4 text-primary" />
          : <Bookmark className="h-4 w-4" />
      }
    </Button>
  )
}
