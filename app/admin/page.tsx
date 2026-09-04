import { getDb } from "@/lib/mongo"
import type { Post } from "@/models/post"
import type { Subscriber } from "@/models/subscriber"
import type { Comment } from "@/models/comment"
import { FileText, Users, MessageSquare, TrendingUp } from "lucide-react"
import { LikesAnalytics } from "@/components/admin/likes-analytics"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata = { title: "Admin Dashboard" }

export default async function AdminDashboard() {
  const db = await getDb()

  const [totalPosts, publishedPosts, totalSubscribers, totalComments] = await Promise.all([
    db.collection<Post>("posts").countDocuments(),
    db.collection<Post>("posts").countDocuments({ status: "published" }),
    db.collection<Subscriber>("subscribers").countDocuments({ confirmed: true }),
    db.collection<Comment>("comments").countDocuments(),
  ])

  const recentPosts = await db
    .collection<Post>("posts")
    .find({}, { projection: { content: 0 } })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray()

  const stats = [
    { label: "Total Posts", value: totalPosts, sub: `${publishedPosts} published`, icon: FileText },
    { label: "Subscribers", value: totalSubscribers, sub: "confirmed", icon: Users },
    { label: "Comments", value: totalComments, sub: "all time", icon: MessageSquare },
    { label: "Draft Posts", value: totalPosts - publishedPosts, sub: "unpublished", icon: TrendingUp },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your blog</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
          </Card>
        ))}
      </div>

      <LikesAnalytics />

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Recent Posts
        </h2>
        <div className="rounded-lg border border-border divide-y divide-border">
          {recentPosts.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            recentPosts.map((post) => (
              <div key={String(post._id)} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={post.status === "published" ? "default" : "secondary"} className="shrink-0">
                  {post.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
