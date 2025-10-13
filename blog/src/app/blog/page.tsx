'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

// Sample blog posts data - in a real app, this would come from a CMS or API
const allPosts = [
  {
    id: 1,
    title: 'Getting Started with Next.js 15',
    excerpt: 'Learn how to build modern apps with Next.js 15 using the new App Router and server components.',
    category: 'Tutorial',
    tags: ['nextjs', 'react', 'typescript'],
    date: '2024-01-14',
    readTime: '5 min read',
    slug: 'getting-started-nextjs-15',
    socialLinks: {
      reddit: 'https://reddit.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
    },
  },
  {
    id: 2,
    title: 'Mastering Tailwind CSS for Rapid UI Design',
    excerpt: 'Discover how Tailwind CSS can help you design beautiful, responsive UIs faster than ever.',
    category: 'Design',
    tags: ['tailwind', 'css', 'ui'],
    date: '2024-02-10',
    readTime: '6 min read',
    slug: 'mastering-tailwind-css',
    socialLinks: {
      reddit: 'https://reddit.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
    },
  },
];

const POSTS_PER_PAGE = 4;

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(allPosts.map(post => post.category)))];

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Blog Posts
        </h1>
        <p className="text-xl text-black max-w-3xl mx-auto">
          Explore our collection of articles about web development, design, and technology.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full md:w-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        {filteredPosts.length === 0 ? (
          <p className="text-black">No posts found</p>
        ) : (
          <p className="text-black">
            Showing {startIndex + 1}-{Math.min(startIndex + POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
          </p>
        )}
      </div>
      {/* Blog Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {paginatedPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-sm text-black">{post.readTime}</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                
                <h2 className="text-2xl font-bold text-black mb-3 hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                
                <p className="text-black mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Social platform badges */}
                <div className="flex gap-2 mb-3">
                  {post.socialLinks?.reddit && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-700">
                      Reddit
                    </span>
                  )}
                  {post.socialLinks?.twitter && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                      Twitter
                    </span>
                  )}
                  {post.socialLinks?.linkedin && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-sky-100 text-sky-700">
                      LinkedIn
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-black text-xs px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-700 text-lg mb-4">No posts found matching your criteria.</p>
          <button
          <p className="text-black text-lg mb-4">No posts found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-black hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
