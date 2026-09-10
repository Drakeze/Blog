'use client';

import { useUser } from '@clerk/nextjs';
import { Bookmark, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

/** Stable per-browser id for anonymous likes. */
function getFingerprint(): string {
  try {
    let fp = localStorage.getItem('tol_fp');
    if (!fp) {
      fp = crypto.randomUUID();
      localStorage.setItem('tol_fp', fp);
    }
    return fp;
  } catch {
    return 'anon';
  }
}

export function PostEngagement({
  slug,
  title,
  excerpt,
  coverImage,
}: {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
}) {
  const { isSignedIn } = useUser();

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);
  const [bmBusy, setBmBusy] = useState(false);

  useEffect(() => {
    const fp = getFingerprint();
    fetch(`/api/likes?postSlug=${encodeURIComponent(slug)}&fingerprint=${fp}`)
      .then((r) => r.json())
      .then((d: { count?: number; liked?: boolean }) => {
        setLikes(d.count ?? 0);
        setLiked(!!d.liked);
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    fetch('/api/bookmarks')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { postSlug: string }[]) => {
        if (!cancelled) {
          setBookmarked(Array.isArray(rows) && rows.some((b) => b.postSlug === slug));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, slug]);

  const showSaved = !!isSignedIn && bookmarked;

  async function toggleLike() {
    if (likeBusy) return;
    setLikeBusy(true);
    const fp = getFingerprint();
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    try {
      const res = next
        ? await fetch('/api/likes', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ postSlug: slug, fingerprint: fp }),
          })
        : await fetch(
            `/api/likes?postSlug=${encodeURIComponent(slug)}&fingerprint=${fp}`,
            { method: 'DELETE' }
          );
      if (!res.ok) throw new Error();
    } catch {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
    } finally {
      setLikeBusy(false);
    }
  }

  async function toggleBookmark() {
    if (!isSignedIn) {
      toast('Sign in to save posts');
      return;
    }
    if (bmBusy) return;
    setBmBusy(true);
    const next = !bookmarked;
    setBookmarked(next);
    try {
      const res = next
        ? await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              postSlug: slug,
              postTitle: title,
              postExcerpt: excerpt,
              postCoverImage: coverImage,
            }),
          })
        : await fetch(`/api/bookmarks?postSlug=${encodeURIComponent(slug)}`, {
            method: 'DELETE',
          });
      if (!res.ok) throw new Error();
    } catch {
      setBookmarked(!next);
      toast.error('Could not update bookmark');
    } finally {
      setBmBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={liked}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors',
          liked
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-line-strong text-muted-foreground hover:border-primary'
        )}
      >
        <Heart className={cn('size-4', liked && 'fill-current')} />
        {likes}
      </button>

      <button
        type="button"
        onClick={toggleBookmark}
        aria-pressed={showSaved}
        aria-label={showSaved ? 'Remove bookmark' : 'Bookmark this post'}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors',
          showSaved
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-line-strong text-muted-foreground hover:border-primary'
        )}
      >
        <Bookmark className={cn('size-4', showSaved && 'fill-current')} />
        {showSaved ? 'Saved' : 'Save'}
      </button>
    </div>
  );
}
