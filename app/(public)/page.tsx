import { PostList } from '@/components/site/post-list';
import { TagBar } from '@/components/site/tag-bar';
import { listPosts, listPublishedTags } from '@/lib/domains/posts/service';
import { site } from '@/lib/site';

// Static + ISR - the homepage is the hot path for readers.
export const revalidate = 60;

// The recent archive. Numbered pagination isn't worth adding until the list
// actually gets long; a tag filter (/tags/[tag]) covers navigation until then.
const HOME_LIMIT = 20;

export default async function HomePage() {
  const [{ posts }, tags] = await Promise.all([
    listPosts({ status: 'published', limit: HOME_LIMIT }),
    listPublishedTags(),
  ]);

  return (
    <div>
      <section className="mb-9">
        <h1 className="text-[clamp(2rem,1.3rem+3.2vw,3rem)] font-medium">{site.name}</h1>
        <p className="mt-2 max-w-[44ch] text-muted-foreground">{site.tagline}</p>
      </section>

      <TagBar tags={tags} />
      <PostList posts={posts} emptyLabel="No posts published yet." />
    </div>
  );
}
