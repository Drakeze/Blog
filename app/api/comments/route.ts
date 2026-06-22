import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongo"
import { sendReplyNotification } from "@/lib/email"
import { getPostHogClient } from "@/lib/posthog-server"
import { env } from "@/lib/env"
import type { Comment } from "@/models/comment"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get("postId")
    if (!postId) return NextResponse.json({ error: "postId is required" }, { status: 400 })

    const db = await getDb()
    const comments = await db
      .collection<Comment>("comments")
      .find({ postId })
      .sort({ createdAt: 1 })
      .toArray()

    return NextResponse.json(comments)
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { postId, content, parentId } = body

    if (!postId || !content?.trim()) {
      return NextResponse.json({ error: "postId and content are required" }, { status: 400 })
    }
    if (content.length > 2000) {
      return NextResponse.json({ error: "Comment must be under 2000 characters" }, { status: 400 })
    }

    const db = await getDb()
    const now = new Date()
    const comment: Comment = {
      postId,
      userId,
      userDisplayName: user.fullName ?? user.username ?? "Anonymous",
      userImageUrl: user.imageUrl,
      content: content.trim(),
      parentId: parentId ?? undefined,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection<Comment>("comments").insertOne(comment)

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: userId,
      event: "server_comment_posted",
      properties: {
        post_id: postId,
        is_reply: !!parentId,
        content_length: comment.content.length,
      },
    })

    if (parentId) {
      void sendReplyNotification({
        db,
        parentCommentId: parentId,
        replyingUserId: userId,
        replierDisplayName: comment.userDisplayName,
        postId,
        postUrl: `${env.SITE_URL}/blog/${postId}`,
        replyContent: comment.content,
      })
    }

    return NextResponse.json({ ...comment, _id: result.insertedId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 })
  }
}
