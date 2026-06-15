"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Heart } from "lucide-react"

interface Stats {
  totalAllTime: number
  totalInPeriod: number
  topPosts: { _id: string; title: string; count: number }[]
  byDay: { _id: string; count: number }[]
}

export function LikesAnalytics() {
  const [days, setDays] = useState(30)

  const { data, isLoading } = useQuery<Stats>({
    queryKey: ["admin-likes", days],
    queryFn: () => fetch(`/api/admin/likes/stats?days=${days}`).then((r) => r.json()),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Likes
        </h2>
        <div className="flex gap-1.5">
          {[7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                days === d
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/50"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">All Time</span>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{isLoading ? "—" : (data?.totalAllTime ?? 0)}</div>
          <div className="text-xs text-muted-foreground mt-1">total likes</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Last {days} Days</span>
            <Heart className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-3xl font-bold">{isLoading ? "—" : (data?.totalInPeriod ?? 0)}</div>
          <div className="text-xs text-muted-foreground mt-1">recent likes</div>
        </div>
      </div>

      {!isLoading && data?.topPosts && data.topPosts.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Top posts — last {days} days</p>
          <div className="rounded-lg border border-border divide-y divide-border">
            {data.topPosts.map((post) => (
              <div key={post._id} className="flex items-center justify-between p-4">
                <p className="text-sm font-medium truncate pr-4">{post.title}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                  <Heart className="h-3.5 w-3.5 fill-current text-red-400" />
                  <span className="font-medium">{post.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && data?.topPosts?.length === 0 && (
        <p className="text-sm text-muted-foreground">No likes in this period yet.</p>
      )}
    </div>
  )
}
