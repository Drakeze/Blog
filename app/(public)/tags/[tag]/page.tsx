import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostList } from '@/components/site/post-list';
import { TagBar } from '@/components/site/tag-bar';
import { listPosts, listPublishedTags } from '@/lib/domains/posts/service';
import { site } from '@/lib/site';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    return (await listPublishedTags()).map((tag) => ({ tag }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const label = decodeURIComponent(tag);
  return {
    title: `${label} — posts`,
    description: `Every ${site.name} post tagged “${label}”.`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const label = decodeURIComponent(tag);

  const [{ posts }, tags] = await Promise.all([
    listPosts({ status: 'published', tag: label, limit: 100 }),
    listPublishedTags(),
  ]);

  if (posts.length === 0 && !tags.includes(label)) notFound();

  return (
    <div>
      <section className="mb-9">
        <h1 className="font-display text-[clamp(2rem,1.3rem+3.2vw,3rem)] font-medium">
          <span className="text-muted-foreground">#</span>
          {label}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {posts.length} post{posts.length === 1 ? '' : 's'}
        </p>
      </section>

      <TagBar tags={tags} activeTag={label} />
      <PostList posts={posts} emptyLabel={`No posts tagged “${label}”.`} />
    </div>
  );
}
