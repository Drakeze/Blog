import Link from 'next/link';

import { BarChart } from '@/components/admin/bar-chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminOverview } from '@/lib/domains/stats/service';
import { formatDate } from '@/lib/utils';

function StatTile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export default async function AdminOverviewPage() {
  const o = await getAdminOverview();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold">Overview</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Published" value={o.posts.published} hint={`${o.posts.drafts} draft${o.posts.drafts === 1 ? '' : 's'}`} />
        <StatTile
          label="Subscribers"
          value={o.subscribers.confirmed}
          hint={`${o.subscribers.pending} pending`}
        />
        <StatTile label="Likes" value={o.engagement.likes} hint={`${o.engagement.likesLast7} in 7d · ${o.engagement.likesLast30} in 30d`} />
        <StatTile label="Comments" value={o.engagement.comments} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscriber growth</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={o.subscriberGrowth}
            caption={`${o.subscriberGrowth.reduce((s, d) => s + d.count, 0)} new sign-ups in the last 30 days`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {o.recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No posts yet.{' '}
              <Link href="/admin/posts/new" className="text-primary underline-offset-2 hover:underline">
                Write your first one
              </Link>
              .
            </p>
          ) : (
            o.recentPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/admin/posts/${p.slug}`}
                className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/60"
              >
                <span className="min-w-0 truncate text-sm font-medium">{p.title}</span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant={p.status === 'published' ? 'ok' : 'warn'}>{p.status}</Badge>
                  {formatDate(p.updatedAt)}
                </span>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
