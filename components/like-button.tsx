"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

function getFingerprint(): string {
  let fp = localStorage.getItem("like_fp")
  if (!fp) {
    fp = crypto.randomUUID()
    localStorage.setItem("like_fp", fp)
  }
  return fp
}

function readLiked(postSlug: string): boolean {
  try {
    const liked = JSON.parse(localStorage.getItem("liked_posts") ?? "[]") as string[]
    return liked.includes(postSlug)
  } catch {
    return false
  }
}

function persistLiked(postSlug: string, liked: boolean) {
  try {
    const existing = JSON.parse(localStorage.getItem("liked_posts") ?? "[]") as string[]
    const updated = liked
      ? [...new Set([...existing, postSlug])]
      : existing.filter((s) => s !== postSlug)
    localStorage.setItem("liked_posts", JSON.stringify(updated))
  } catch {}
}

interface LikeButtonProps {
  postSlug: string
}

export function LikeButton({ postSlug }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLiked(readLiked(postSlug))
  }, [postSlug])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" disabled aria-label="Like post" className="gap-1.5 px-2">
        <Heart className="h-4 w-4" />
      </Button>
    )
  }

  async function toggle() {
    setLoading(true)
    try {
      const fingerprint = getFingerprint()
      if (liked) {
        await fetch(`/api/likes?postSlug=${encodeURIComponent(postSlug)}&fingerprint=${encodeURIComponent(fingerprint)}`, {
          method: "DELETE",
        })
        setLiked(false)
        persistLiked(postSlug, false)
      } else {
        await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postSlug, fingerprint }),
        })
        setLiked(true)
        persistLiked(postSlug, true)
        toast("Thanks for the like!")
      }
    } catch {
      toast.error("Couldn't save your like")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      disabled={loading}
      aria-label={liked ? "Unlike post" : "Like post"}
      className={`gap-1.5 px-2 transition-colors ${liked ? "text-red-500 hover:text-red-600 hover:bg-red-500/10" : ""}`}
    >
      <Heart className={`h-4 w-4 transition-all ${liked ? "fill-current scale-110" : ""}`} />
    </Button>
  )
}
