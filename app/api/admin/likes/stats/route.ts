import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { isAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const admin = await isAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const days = Math.min(parseInt(req.nextUrl.searchParams.get("days") ?? "30"), 90)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const db = await getDb()

  const [totalAllTime, totalInPeriod, topPosts, byDay] = await Promise.all([
    db.collection("likes").countDocuments(),
    db.collection("likes").countDocuments({ createdAt: { $gte: since } }),
    db.collection("likes").aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$postSlug", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "slug",
          as: "post",
          pipeline: [{ $project: { title: 1 } }],
        },
      },
      {
        $addFields: {
          title: { $ifNull: [{ $arrayElemAt: ["$post.title", 0] }, "$_id"] },
        },
      },
      { $project: { post: 0 } },
    ]).toArray(),
    db.collection("likes").aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray(),
  ])

  return NextResponse.json({ totalAllTime, totalInPeriod, topPosts, byDay })
}
