import Link from 'next/link';

import { BarChart } from '@/components/admin/bar-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnalytics } from '@/lib/domains/stats/service';

export default async function AdminAnalyticsPage() {
  const a = await getAnalytics();
  const likeTotal = a.likesByDay.reduce((s, d) => s + d.count, 0);
  const commentTotal = a.commentsByDay.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          On-site engagement. Traffic and sources live in PostHog.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Likes · 30 days</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={a.likesByDay} caption={`${likeTotal} likes in the last 30 days`} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comments · 30 days</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={a.commentsByDay}
              caption={`${commentTotal} comments in the last 30 days`}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most-liked posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {a.topPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No likes yet.</p>
          ) : (
            a.topPosts.map((p) => (
              <div
                key={p.slug}
                className="flex items-center justify-between gap-3 py-1.5 text-sm"
              >
                <Link
                  href={`/admin/posts/${p.slug}`}
                  className="min-w-0 truncate underline-offset-2 hover:underline"
                >
                  {p.title}
                </Link>
                <span className="shrink-0 tabular-nums text-muted-foreground">{p.likes}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
