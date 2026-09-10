import Link from 'next/link';

import { Plate } from '@/components/site/plate';
import type { PostSummary } from '@/lib/domains/posts/types';
import { formatDate } from '@/lib/utils';

export function PostList({ posts, emptyLabel }: { posts: PostSummary[]; emptyLabel: string }) {
  if (posts.length === 0) {
    return (
      <p className="border-t border-border py-16 text-center text-muted-foreground">{emptyLabel}</p>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((p) => (
        <Link
          key={p.slug}
          href={`/${p.slug}`}
          className="group grid grid-cols-[4.5rem_1fr] items-start gap-5 border-t border-border py-6 transition-colors last:border-b hover:bg-[linear-gradient(90deg,var(--accent),transparent_60%)]"
        >
          <Plate src={p.coverImage} alt="" size="sm" />
          <div className="min-w-0">
            <p className="font-mono text-[0.68rem] uppercase tracking-wide text-faint">
              {p.tags[0] ? <span className="text-primary">{p.tags[0]}</span> : null}
              {p.tags[1] ? ` · ${p.tags[1]}` : ''}
              {p.publishedAt ? ` — ${formatDate(p.publishedAt)}` : ''}
            </p>
            <h2 className="my-1.5 font-display text-[1.375rem] font-medium transition-colors group-hover:text-primary">
              {p.title}
            </h2>
            <p className="line-clamp-2 max-w-[52ch] text-muted-foreground">{p.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
