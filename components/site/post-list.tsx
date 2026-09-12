import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Plate } from '@/components/site/plate';
import type { PostSummary } from '@/lib/domains/posts/types';
import { cn, formatDate, getTagColorClasses } from '@/lib/utils';

export function PostList({ posts, emptyLabel }: { posts: PostSummary[]; emptyLabel: string }) {
  if (posts.length === 0) {
    return (
      <p className="border-t border-border py-16 text-center text-muted-foreground">{emptyLabel}</p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <Link
          key={p.slug}
          href={`/${p.slug}`}
          className="group block overflow-hidden rounded-[14px] border border-line-strong bg-card transition-colors hover:border-primary/40"
        >
          <Plate src={p.coverImage} alt="" size="lg" />
          <div className="p-4">
            {p.tags.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} className={cn('border-transparent text-xs', getTagColorClasses(tag))}>
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
            <h2 className="mb-2 font-display text-[1.25rem] font-medium leading-snug transition-colors group-hover:text-primary line-clamp-2">
              {p.title}
            </h2>
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
            <div className="flex items-center gap-2 font-mono text-xs text-faint">
              {p.authorImageUrl ? (
                <Image
                  src={p.authorImageUrl}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full border border-line-strong"
                />
              ) : (
                <span className="size-5 rounded-full border border-line-strong bg-accent" />
              )}
              <span>{p.authorName}</span>
              {p.publishedAt ? (
                <>
                  <span>·</span>
                  <span>{formatDate(p.publishedAt)}</span>
                </>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
