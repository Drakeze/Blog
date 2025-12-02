import Link from 'next/link';

import SocialBadge from './SocialBadge';
import type { BlogPostSummary, SocialLinks } from '@/data/posts';

function getActiveSocialLinks(socialLinks?: SocialLinks) {
  if (!socialLinks) return [] as Array<[keyof SocialLinks, string]>;
  return (Object.entries(socialLinks) as Array<[keyof SocialLinks, string]>).filter(([, url]) => Boolean(url));
}

type BlogCardProps = {
  post: BlogPostSummary;
};

export default function BlogCard({ post }: BlogCardProps) {
  const activeSocialLinks = getActiveSocialLinks(post.socialLinks);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-100">
            {post.category}
          </span>
          <span className="text-sm text-gray-600 dark:text-neutral-300">{post.readTime}</span>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-neutral-50">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="mb-4 line-clamp-3 text-gray-700 dark:text-neutral-200">{post.excerpt}</p>

        {activeSocialLinks.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeSocialLinks.map(([platform, url]) => (
              <SocialBadge key={platform} platform={platform} url={url} />
            ))}
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between text-sm text-gray-600 dark:text-neutral-300">
          <span>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}
