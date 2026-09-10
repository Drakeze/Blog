import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';

import { Plate } from '@/components/site/plate';
import { PostEndBlock } from '@/components/site/post-end-block';
import { ReadingProgress } from '@/components/site/reading-progress';
import { isAdmin } from '@/lib/auth';
import { getRelatedPosts, resolveSlug } from '@/lib/domains/posts/service';
import { publicEnv } from '@/lib/env';
import { renderMarkdown } from '@/lib/markdown';
import { cn, formatDate, readingTime, toIsoOrUndefined } from '@/lib/utils';

export const revalidate = 60;

const siteUrl = (publicEnv.NEXT_PUBLIC_SITE_URL || 'https://blog.drakeze.com').replace(/\/$/, '');

// Deduped across generateMetadata + render within one request.
const resolve = cache((slug: string) => resolveSlug(slug));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await resolve(slug);
  if (!found || found.post.status !== 'published') return {};

  const { post } = found;
  const url = `${siteUrl}/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    authors: post.authorName ? [{ name: post.authorName }] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: toIsoOrUndefined(post.publishedAt),
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = await resolve(slug);
  if (!found) notFound();

  const { post, redirect } = found;
  if (redirect) permanentRedirect(`/${post.slug}`);

  if (post.status === 'draft' && !(await isAdmin())) notFound();

  const html = renderMarkdown(post.content);
  const mins = readingTime(post.content);
  const related = await getRelatedPosts(post.slug, post.tags);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: toIsoOrUndefined(post.publishedAt),
    dateModified: toIsoOrUndefined(post.updatedAt),
    author: post.authorName ? { '@type': 'Person', name: post.authorName } : undefined,
    mainEntityOfPage: `${siteUrl}/${post.slug}`,
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header>
          {post.status === 'draft' ? (
            <p className="mb-4 rounded-md border border-[var(--warn)]/40 bg-[var(--warn)]/10 px-3 py-1.5 font-mono text-xs text-[var(--warn)]">
              Draft preview — not publicly visible
            </p>
          ) : null}

          {post.tags.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[0.72rem] tracking-wide text-muted-foreground transition-colors hover:border-primary"
                >
                  {tag}
                </Link>
              ))}
            </div>
          ) : null}

          <h1 className="font-display text-[clamp(2.2rem,1.5rem+3.4vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.015em]">
            {post.title}
          </h1>

          <div className="mt-5 flex items-center gap-2.5 font-mono text-[0.8125rem] text-muted-foreground">
            {post.authorImageUrl ? (
              <Image
                src={post.authorImageUrl}
                alt=""
                width={28}
                height={28}
                className="rounded-full border border-line-strong"
              />
            ) : (
              <span className="size-7 rounded-full border border-line-strong bg-accent" />
            )}
            <span>{post.authorName}</span>
            <span className="text-line-strong">/</span>
            <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</span>
            <span className="text-line-strong">/</span>
            <span>{mins} min read</span>
          </div>
        </header>

        <figure className="my-9">
          <Plate src={post.coverImage} alt={post.coverImage ? post.title : ''} size="lg" priority />
          <figcaption className="mt-2.5 font-mono text-[0.68rem] tracking-wide text-faint">
            {post.coverImage ? `fig. 1 — ${post.title}` : 'fig. 1 — commissioned plate (placeholder)'}
          </figcaption>
        </figure>

        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

        <PostEndBlock />

        {related.length > 0 ? (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-faint">Read next</h2>
            <div className="flex flex-col gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className={cn(
                    'group grid grid-cols-[3.5rem_1fr] items-start gap-4 rounded-lg p-2 -mx-2',
                    'transition-colors hover:bg-muted/50'
                  )}
                >
                  <Plate src={r.coverImage} alt="" size="sm" />
                  <div className="min-w-0">
                    <h3 className="font-display font-medium transition-colors group-hover:text-primary">
                      {r.title}
                    </h3>
                    <p className="line-clamp-1 text-sm text-muted-foreground">{r.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
