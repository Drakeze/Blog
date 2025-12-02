import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import SocialBadge from '@/components/SocialBadge';
import { getAllPosts, getPostBySlug } from '@/data/posts';
import type { SocialLinks } from '@/data/posts';

function getPostUrl(slug: string) {
  const deploymentHost =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  const normalizedBaseUrl = deploymentHost ? deploymentHost.replace(/\/$/, '') : undefined;
  return normalizedBaseUrl ? `${normalizedBaseUrl}/blog/${slug}` : `https://example.com/blog/${slug}`;
}

type BlogPostParams = { slug: string };

type BlogPostPageProps = {
  params: Promise<BlogPostParams>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  const metadataTitle = `${post.title} | Blog`;
  const postUrl = getPostUrl(post.slug);
  return {
    title: metadataTitle,
    description: post.excerpt,
    openGraph: {
      title: metadataTitle,
      description: post.excerpt,
      type: 'article',
      url: postUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadataTitle,
      description: post.excerpt,
    },
  };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const { originalUrl, socialLinks } = post;

  const activeSocialLinks = (
    Object.entries(socialLinks ?? {}) as Array<[keyof SocialLinks, string]>
  ).filter(([, url]) => Boolean(url));

  const allPosts = getAllPosts();
  const postIndex = allPosts.findIndex((p) => p.slug === slug);
  const previousPost = allPosts[postIndex - 1];
  const nextPost = allPosts[postIndex + 1];

  const postUrl = getPostUrl(post.slug);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 text-neutral-900 sm:px-6 lg:px-8 dark:text-neutral-100">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-700 dark:text-neutral-300">
          <li>
            <Link href="/" className="transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
              Home
            </Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <Link href="/blog" className="transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
              Blog
            </Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li className="truncate font-medium text-gray-900 dark:text-neutral-100">
            {post.title}
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <div className="mb-4">
          <span className="rounded bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-100">
            {post.category}
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl dark:text-neutral-50">
          {post.title}
        </h1>

        <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-neutral-200">
          {post.excerpt}
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 pb-6 text-sm text-gray-700 dark:border-neutral-800 dark:text-neutral-300">
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-neutral-700">
              <span className="font-semibold text-gray-600 dark:text-neutral-100">
                {post.author?.split(' ').map((name) => name[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-neutral-100">{post.author}</p>
              <p className="text-gray-700 dark:text-neutral-300">Author</p>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-900 dark:text-neutral-100">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-gray-700 dark:text-neutral-300">Published</p>
          </div>

          <div>
            <p className="font-medium text-gray-900 dark:text-neutral-100">{post.readTime}</p>
            <p className="text-gray-700 dark:text-neutral-300">Read time</p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div
        className="prose prose-lg prose-neutral mb-12 max-w-none leading-relaxed dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Original Source */}
      <div className="mb-12">
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Visit original publication
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Social Platforms */}
      {activeSocialLinks.length > 0 && (
        <div className="mb-12">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-neutral-100">Join the conversation</h3>
          <div className="flex flex-wrap items-center gap-3">
            {activeSocialLinks.map(([platform, url]) => (
              <SocialBadge key={platform} platform={platform} url={url} />
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="mb-12">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-neutral-100">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-neutral-800 dark:text-neutral-200">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 pt-8 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <div className="text-right">
            <p className="mb-1 text-sm text-gray-700 dark:text-neutral-300">Share this article</p>
            <div className="flex space-x-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500 dark:text-neutral-300 dark:hover:text-blue-400"
              >
                <span className="sr-only">Share on Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-700 dark:text-neutral-300 dark:hover:text-blue-500"
              >
                <span className="sr-only">Share on LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-between text-sm">
          {previousPost && (
            <Link href={`/blog/${previousPost.slug}`} className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
              ← {previousPost.title}
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className="ml-auto text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
              {nextPost.title} →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
