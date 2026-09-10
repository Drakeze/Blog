'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Plate } from '@/components/site/plate';
import type { SearchHit } from '@/lib/search';

type HighlightText = { value: string; type: 'hit' | 'text' };
type Highlight = { path: string; texts: HighlightText[] };

/** Render an Atlas Search highlight fragment with the matched spans marked. */
function Snippet({ hit }: { hit: SearchHit }) {
  const hl = (hit.highlights as Highlight[] | undefined)?.find((h) => h.path !== 'title');
  if (!hl) return <>{hit.excerpt}</>;
  return (
    <>
      …
      {hl.texts.map((t, i) =>
        t.type === 'hit' ? (
          <mark key={i} className="rounded-[2px] bg-accent px-0.5 text-accent-foreground">
            {t.value}
          </mark>
        ) : (
          <span key={i}>{t.value}</span>
        )
      )}
      …
    </>
  );
}

export function SearchClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const run = useCallback(async (query: string) => {
    if (!query.trim()) {
      setHits([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      setHits(Array.isArray(json.hits) ? json.hits : []);
      setActive(0);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce the query + keep it in the URL so a search is shareable / back-able.
  useEffect(() => {
    const t = setTimeout(() => {
      run(q);
      const next = q ? `/search?q=${encodeURIComponent(q)}` : '/search';
      window.history.replaceState(null, '', next);
    }, 220);
    return () => clearTimeout(t);
  }, [q, run]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && hits[active]) {
      router.push(`/${hits[active].slug}`);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <Search className="size-5 shrink-0 text-faint" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="w-full bg-transparent font-display text-xl outline-none placeholder:text-faint"
        />
      </div>

      <div className="mt-4">
        {q.trim() && !loading ? (
          <p className="mb-3 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-faint">
            {hits.length} result{hits.length === 1 ? '' : 's'}
          </p>
        ) : null}

        {hits.map((hit, i) => (
          <Link
            key={hit.slug}
            href={`/${hit.slug}`}
            onMouseEnter={() => setActive(i)}
            aria-selected={i === active}
            className="grid grid-cols-[3rem_1fr] items-start gap-3 rounded-lg px-2 py-2.5 aria-selected:bg-accent/60"
          >
            <Plate src={hit.coverImage} alt="" size="sm" />
            <div className="min-w-0">
              <p className="font-display font-medium">{hit.title}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                <Snippet hit={hit} />
              </p>
            </div>
          </Link>
        ))}

        {q.trim() && !loading && hits.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            Nothing found for “{q}”.
          </p>
        ) : null}
      </div>

      <p className="mt-6 font-mono text-[0.66rem] text-faint">↑ ↓ navigate · ↵ open</p>
    </div>
  );
}
