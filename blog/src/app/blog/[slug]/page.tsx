import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';

import { getPostBySlug, posts as allPosts } from '@/data/posts';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { originalUrl } = post;

  // Find index of current post for navigation
  const postIndex = allPosts.findIndex(p => p.slug === params.slug);
  const previousPost = allPosts[postIndex - 1];
  const nextPost = allPosts[postIndex + 1];

  const deploymentHost = process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  const normalizedBaseUrl = deploymentHost ? deploymentHost.replace(/\/$/, '') : undefined;
  const postUrl = normalizedBaseUrl ? `${normalizedBaseUrl}/blog/${post.slug}` : `https://example.com/blog/${post.slug}`;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-700">
          <li>
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <Link href="/blog" className="hover:text-gray-700 transition-colors">
              Blog
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li className="text-gray-900 font-medium truncate">
            {post.title}
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <div className="mb-4">
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
            {post.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700 border-b border-gray-200 pb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-semibold">
                {post.author?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author}</p>
              <p className="text-gray-700">Author</p>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-900">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-gray-700">Published</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">{post.readTime}</p>
            <p className="text-gray-700">Read time</p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{
          '--tw-prose-body': 'rgb(55 65 81)',
          '--tw-prose-headings': 'rgb(17 24 39)',
          '--tw-prose-links': 'rgb(37 99 235)',
          '--tw-prose-bold': 'rgb(17 24 39)',
          '--tw-prose-counters': 'rgb(107 114 128)',
          '--tw-prose-bullets': 'rgb(209 213 219)',
          '--tw-prose-hr': 'rgb(229 231 235)',
          '--tw-prose-quotes': 'rgb(17 24 39)',
          '--tw-prose-quote-borders': 'rgb(229 231 235)',
          '--tw-prose-captions': 'rgb(107 114 128)',
          '--tw-prose-code': 'rgb(17 24 39)',
          '--tw-prose-pre-code': 'rgb(229 231 235)',
          '--tw-prose-pre-bg': 'rgb(17 24 39)',
          '--tw-prose-th-borders': 'rgb(209 213 219)',
          '--tw-prose-td-borders': 'rgb(229 231 235)',
        } as CSSProperties}
      />

      {/* Original Source */}
      <div className="mb-12">
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
        >
          Visit original publication
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Tags */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex justify-between items-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <div className="text-right">
            <p className="text-sm text-gray-700 mb-1">Share this article</p>
            <div className="flex space-x-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <span className="sr-only">Share on Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                <span className="sr-only">Share on LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-12 text-sm">
          {previousPost && (
            <Link href={`/blog/${previousPost.slug}`} className="text-blue-600 hover:underline">
              ← {previousPost.title}
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className="text-blue-600 hover:underline ml-auto">
              {nextPost.title} →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
