'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Plate } from '@/components/site/plate';

interface Row {
  postSlug: string;
  postTitle: string;
  postExcerpt: string;
  postCoverImage: string | null;
}

export function BookmarksList({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);

  async function remove(slug: string) {
    setRows((r) => r.filter((b) => b.postSlug !== slug));
    const res = await fetch(`/api/bookmarks?postSlug=${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    });
    if (!res.ok) toast.error('Could not remove bookmark');
  }

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground">
        No bookmarks yet - hit <span className="font-mono text-sm">Save</span> on a post.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {rows.map((b) => (
        <div
          key={b.postSlug}
          className="group grid grid-cols-[4.5rem_1fr_auto] items-start gap-4 border-t border-border py-5 last:border-b"
        >
          <Plate src={b.postCoverImage} alt="" size="sm" />
          <Link href={`/${b.postSlug}`} className="min-w-0">
            <h2 className="font-display text-lg font-medium transition-colors group-hover:text-primary">
              {b.postTitle}
            </h2>
            <p className="line-clamp-2 text-sm text-muted-foreground">{b.postExcerpt}</p>
          </Link>
          <button
            type="button"
            onClick={() => remove(b.postSlug)}
            aria-label={`Remove ${b.postTitle}`}
            className="rounded-md p-1 text-faint transition-colors hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
