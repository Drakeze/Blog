import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongo"
import { isAdmin } from "@/lib/auth"
import type { Comment } from "@/models/comment"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const db = await getDb()
    const comment = await db.collection<Comment>("comments").findOne({ _id: new ObjectId(id) })
    if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const admin = await isAdmin()
    if (comment.userId !== userId && !admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.collection<Comment>("comments").deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
