import Link from 'next/link';

import { Plate } from '@/components/site/plate';
import { listPosts, listPublishedTags } from '@/lib/domains/posts/service';
import { site } from '@/lib/site';
import { cn, formatDate } from '@/lib/utils';

// ponytail: reading searchParams (?tag, ?page) makes this dynamic — Next ISR
// can't apply. The query is tiny (indexed find, limit 12) so it's fine for now;
// Phase 6 perf pass can split /tags/[tag] + /page/[n] into static ISR routes.
export const revalidate = 60;

const PER_PAGE = 12;

type SearchParams = Promise<{ tag?: string; page?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { tag, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ posts, total }, tags] = await Promise.all([
    listPosts({ status: 'published', tag, page, limit: PER_PAGE }),
    listPublishedTags(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const hrefFor = (t?: string, p?: number) => {
    const q = new URLSearchParams();
    if (t) q.set('tag', t);
    if (p && p > 1) q.set('page', String(p));
    const s = q.toString();
    return s ? `/?${s}` : '/';
  };

  return (
    <div>
      <section className="mb-9">
        <h1 className="text-[clamp(2rem,1.3rem+3.2vw,3rem)] font-medium">{site.name}</h1>
        <p className="mt-2 max-w-[44ch] text-muted-foreground">{site.tagline}</p>
      </section>

      {tags.length > 0 ? (
        <div className="mb-9 flex flex-wrap gap-2">
          <TagPill label="all" href={hrefFor(undefined)} active={!tag} />
          {tags.map((t) => (
            <TagPill key={t} label={t} href={hrefFor(t)} active={tag === t} />
          ))}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <p className="border-t border-border py-16 text-center text-muted-foreground">
          {tag ? `No posts tagged "${tag}" yet.` : 'No posts published yet.'}
        </p>
      ) : (
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
      )}

      {totalPages > 1 ? (
        <nav className="mt-8 flex items-center justify-between font-mono text-xs text-muted-foreground">
          {page > 1 ? (
            <Link href={hrefFor(tag, page - 1)} className="hover:text-foreground">
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span>
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={hrefFor(tag, page + 1)} className="hover:text-foreground">
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}

function TagPill({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-2.5 py-1 font-mono text-[0.72rem] tracking-wide transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-line-strong bg-card text-muted-foreground hover:border-primary'
      )}
    >
      {label}
    </Link>
  );
}
