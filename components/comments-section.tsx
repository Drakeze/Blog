"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import { Loader2, Trash2, MessageSquare } from "lucide-react"
import type { Comment } from "@/models/comment"

interface Props {
  postId: string
  userId?: string
  isAdmin?: boolean
}

export function CommentsSection({ postId, userId, isAdmin }: Props) {
  const qc = useQueryClient()
  const [content, setContent] = useState("")

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetch(`/api/comments?postId=${postId}`).then((r) => r.json()),
  })

  const addMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to post")
      return data
    },
    onSuccess: () => {
      setContent("")
      qc.invalidateQueries({ queryKey: ["comments", postId] })
      toast.success("Comment posted")
    },
    onError: (err) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", postId] })
      toast.success("Comment deleted")
    },
    onError: () => toast.error("Failed to delete comment"),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    addMutation.mutate(content)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <h2 className="font-semibold">{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h2>
      </div>

      {userId ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment…"
            rows={3}
            maxLength={2000}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={addMutation.isPending || !content.trim()}>
              {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/sign-in" className="underline underline-offset-4 hover:opacity-80">Sign in</a> to leave a comment.
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={String(comment._id)} className="flex gap-3">
              {comment.userImageUrl ? (
                <Image
                  src={comment.userImageUrl}
                  alt={comment.userDisplayName}
                  width={32}
                  height={32}
                  className="rounded-full shrink-0 mt-0.5"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium">
                  {comment.userDisplayName[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{comment.userDisplayName}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  {(userId === comment.userId || isAdmin) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => deleteMutation.mutate(String(comment._id))}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
