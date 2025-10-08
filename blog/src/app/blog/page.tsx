'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

// Sample blog posts data - in a real app, this would come from a CMS or API
const allPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    excerpt: "Learn how to build modern web applications with the latest features in Next.js 15, including improved performance and developer experience.",
    content: "Full content would go here...",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Tutorial",
    slug: "getting-started-nextjs-15",
    tags: ["nextjs", "react", "tutorial"]
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS for Modern UI",
    excerpt: "Discover advanced Tailwind CSS techniques to create beautiful, responsive user interfaces with utility-first CSS framework.",
    content: "Full content would go here...",
    date: "2024-01-10",
    readTime: "8 min read",
    category: "Design",
    slug: "mastering-tailwind-css",
    tags: ["tailwind", "css", "design"]
  },
  {
    id: 3,
    title: "Building Scalable React Applications",
    excerpt: "Best practices and patterns for building large-scale React applications that are maintainable and performant.",
    content: "Full content would go here...",
    date: "2024-01-05",
    readTime: "12 min read",
    category: "Development",
    slug: "scalable-react-applications",
    tags: ["react", "architecture", "development"]
  },
  {
    id: 4,
    title: "TypeScript Best Practices in 2024",
    excerpt: "Essential TypeScript patterns and practices that every developer should know for writing better, more maintainable code.",
    content: "Full content would go here...",
    date: "2024-01-01",
    readTime: "10 min read",
    category: "Development",
    slug: "typescript-best-practices-2024",
    tags: ["typescript", "javascript", "development"]
  },
  {
    id: 5,
    title: "Modern CSS Grid Layouts",
    excerpt: "Master CSS Grid to create complex, responsive layouts with ease. Learn the fundamentals and advanced techniques.",
    content: "Full content would go here...",
    date: "2023-12-28",
    readTime: "7 min read",
    category: "Design",
    slug: "modern-css-grid-layouts",
    tags: ["css", "grid", "layout"]
  },
  {
    id: 6,
    title: "API Design with Node.js and Express",
    excerpt: "Learn how to design and build robust RESTful APIs using Node.js and Express with best practices and security considerations.",
    content: "Full content would go here...",
    date: "2023-12-20",
    readTime: "15 min read",
    category: "Backend",
    slug: "api-design-nodejs-express",
    tags: ["nodejs", "express", "api"]
  }
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Blog Posts
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredPosts.length === 0 ? 'No posts found' :
           `Showing ${startIndex + 1}-${Math.min(startIndex + POSTS_PER_PAGE, filteredPosts.length)} of ${filteredPosts.length} posts`}
        </p>
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
                  <span className="text-sm text-gray-700">{post.readTime}</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
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
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-black border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
