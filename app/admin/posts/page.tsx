import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listPosts } from '@/lib/domains/posts/service';
import { formatDate } from '@/lib/utils';

export default async function AdminPostsPage() {
  const { posts } = await listPosts({ status: 'all', limit: 200 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Posts</h1>
        <Button asChild size="sm">
          <Link href="/admin/posts/new">
            <Plus className="size-4" />
            New post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No posts yet. Start with{' '}
          <Link href="/admin/posts/new" className="text-primary underline-offset-2 hover:underline">
            a new post
          </Link>
          .
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Tags</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p.slug}>
                  <TableCell>
                    <Link
                      href={`/admin/posts/${p.slug}`}
                      className="font-medium underline-offset-2 hover:underline"
                    >
                      {p.title}
                    </Link>
                    <span className="block truncate text-xs text-muted-foreground">/{p.slug}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'published' ? 'ok' : 'warn'}>{p.status}</Badge>
                    {p.newsletterSentAt ? (
                      <span className="ml-1 block text-[11px] text-muted-foreground">emailed</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">{p.tags.join(', ') || '—'}</span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground md:table-cell">
                    {formatDate(p.updatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
