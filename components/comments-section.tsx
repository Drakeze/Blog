"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import { Loader2, Trash2, MessageSquare, CornerDownRight } from "lucide-react"
import type { Comment } from "@/models/comment"

interface Props {
  postId: string
  userId?: string
  isAdmin?: boolean
}

interface AddCommentArgs {
  text: string
  parentId?: string
}

export function CommentsSection({ postId, userId, isAdmin }: Props) {
  const qc = useQueryClient()
  const [content, setContent] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetch(`/api/comments?postId=${postId}`).then((r) => r.json()),
  })

  const addMutation = useMutation({
    mutationFn: async ({ text, parentId }: AddCommentArgs) => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text, parentId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to post")
      return data
    },
    onSuccess: () => {
      setContent("")
      setReplyContent("")
      setReplyingTo(null)
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
    addMutation.mutate({ text: content })
  }

  function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim() || !replyingTo) return
    addMutation.mutate({ text: replyContent, parentId: replyingTo })
  }

  // Group comments into top-level and replies
  const topLevel = comments.filter((c) => !c.parentId)
  const repliesByParent: Record<string, Comment[]> = {}
  for (const c of comments) {
    if (c.parentId) {
      repliesByParent[c.parentId] ??= []
      repliesByParent[c.parentId].push(c)
    }
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
              {addMutation.isPending && !replyingTo && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link href="/sign-in" className="underline underline-offset-4 hover:opacity-80">Sign in</Link> to leave a comment.
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
          {topLevel.map((comment) => {
            const commentId = String(comment._id)
            const replies = repliesByParent[commentId] ?? []
            const isReplying = replyingTo === commentId

            return (
              <div key={commentId} id={`comment-${commentId}`}>
                <CommentItem
                  comment={comment}
                  userId={userId}
                  isAdmin={isAdmin}
                  onDelete={() => deleteMutation.mutate(commentId)}
                  isDeleting={deleteMutation.isPending}
                  onReply={userId ? () => {
                    setReplyingTo(isReplying ? null : commentId)
                    setReplyContent("")
                  } : undefined}
                  isReplying={isReplying}
                />

                {/* Inline reply form */}
                {isReplying && (
                  <div className="ml-11 mt-2">
                    <form onSubmit={handleReplySubmit} className="space-y-2">
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Reply to ${comment.userDisplayName}…`}
                        rows={2}
                        maxLength={2000}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => { setReplyingTo(null); setReplyContent("") }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={addMutation.isPending || !replyContent.trim()}
                        >
                          {addMutation.isPending && replyingTo === commentId && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Post Reply
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Nested replies */}
                {replies.length > 0 && (
                  <div className="ml-11 mt-3 space-y-3 border-l-2 border-border pl-4">
                    {replies.map((reply) => (
                      <div key={String(reply._id)} id={`comment-${String(reply._id)}`}>
                        <CommentItem
                          comment={reply}
                          userId={userId}
                          isAdmin={isAdmin}
                          onDelete={() => deleteMutation.mutate(String(reply._id))}
                          isDeleting={deleteMutation.isPending}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

interface CommentItemProps {
  comment: Comment
  userId?: string
  isAdmin?: boolean
  onDelete: () => void
  isDeleting: boolean
  onReply?: () => void
  isReplying?: boolean
}

function CommentItem({ comment, userId, isAdmin, onDelete, isDeleting, onReply, isReplying }: CommentItemProps) {
  return (
    <div className="flex gap-3">
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
          <div className="flex items-center gap-1 shrink-0">
            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground gap-1"
                onClick={onReply}
              >
                <CornerDownRight className="h-3 w-3" />
                {isReplying ? "Cancel" : "Reply"}
              </Button>
            )}
            {(userId === comment.userId || isAdmin) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  )
}
