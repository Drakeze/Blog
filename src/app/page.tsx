'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import SocialFeed from '@/components/SocialFeed';
import type { BlogPostSummary } from '@/data/posts';

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [socialStatus, setSocialStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Fetch posts from backend API
  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setFeaturedPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/social')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load social posts');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSocialStatus('success');
        } else {
          setSocialStatus('error');
        }
      })
      .catch(() => setSocialStatus('error'));
  }, []);

  // Social share handlers
  async function shareToLinkedIn(slug: string) {
    try {
      const response = await fetch('/api/linkedin/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        throw new Error('Failed to share to LinkedIn');
      }

      const data = await response.json();

      if (data.shareUrl && typeof window !== 'undefined') {
        window.open(data.shareUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      alert('Unable to share this post on LinkedIn right now.');
    }
  }

  async function shareToTwitter(slug: string) {
    try {
      const response = await fetch('/api/twitter/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        throw new Error('Failed to share to Twitter');
      }

      const data = await response.json();

      if (data.shareUrl && typeof window !== 'undefined') {
        window.open(data.shareUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      alert('Unable to share this post on Twitter right now.');
    }
  }

  // Newsletter subscription
  async function handleSubscribe() {
    if (!email) return;
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message || 'Thanks for subscribing!');
    setEmail('');
  }

  return (
    <div className="">
      {/* ✅ API Status Banner */}
      {socialStatus === 'success' && (
        <div className="bg-green-50 py-2 text-center text-sm text-green-700">
          Synced with social APIs ✅
        </div>
      )}
      {socialStatus === 'error' && (
        <div className="bg-red-50 py-2 text-center text-sm text-red-700">
          Unable to sync social feeds. Check your API keys or try again later.
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
              Welcome to <span className="block text-blue-600">SorenLab Blog</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              Follow my journey as an aspiring developer — sharing real project updates, lessons
              learned, and snippets from the path to becoming a full-stack engineer.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/blog"
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Read Latest Posts
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-blue-600 px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Featured Posts</h2>
            <p className="text-lg text-gray-600">
              Latest articles and updates from the SorenLab team.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-700">{post.readTime}</span>
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors hover:text-blue-600">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="mb-4 line-clamp-3 text-gray-600">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
                      >
                        Read More →
                      </Link>
                    </div>

                    {/* 🌐 Share Buttons */}
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => shareToLinkedIn(post.slug)}
                        className="text-sm text-blue-700 hover:underline"
                      >
                        LinkedIn
                      </button>
                      <button
                        onClick={() => shareToTwitter(post.slug)}
                        className="text-sm text-sky-500 hover:underline"
                      >
                        Twitter
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Stay Updated</h2>
          <p className="mb-8 text-lg text-gray-600">
            Subscribe to our newsletter to receive new articles and development insights.
          </p>
          <div className="mx-auto flex max-w-md flex-col justify-center gap-4 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSubscribe}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Subscribe
            </button>
          </div>
          {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
      </section>

      {/* Social Feed Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SocialFeed />
        </div>
      </section>
    </div>
  );
}
