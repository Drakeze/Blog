'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { BlogPostSummary, PostStatus } from '@/data/posts';

const PAGE_SIZE = 5;

type PostTableProps = {
  posts: BlogPostSummary[];
};

type FilterState = {
  tag: string;
  status: PostStatus | 'all';
  maxReadTime: string;
  date: string;
};

export default function PostTable({ posts }: PostTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    tag: 'all',
    status: 'all',
    maxReadTime: '0',
    date: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const uniqueTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const tagMatch = filters.tag === 'all' ? true : post.tags.includes(filters.tag);
      const statusMatch = filters.status === 'all' ? true : post.status === filters.status;
      const readTimeMatch =
        filters.maxReadTime && Number(filters.maxReadTime) > 0
          ? post.readTimeMinutes <= Number(filters.maxReadTime)
          : true;
      const dateMatch = filters.date ? post.date.startsWith(filters.date) : true;
      return tagMatch && statusMatch && readTimeMatch && dateMatch;
    });
  }, [filters, posts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedPosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Unable to delete post');
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500">
            Filter by tag, publish status, read time, or date.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <select
            value={filters.tag}
            onChange={(event) => {
              setCurrentPage(1);
              setFilters((prev) => ({ ...prev, tag: event.target.value }));
            }}
            className="min-w-[140px] rounded-lg border border-gray-200 px-3 py-2"
          >
            <option value="all">All tags</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(event) => {
              setCurrentPage(1);
              const value = event.target.value as PostStatus | 'all';
              setFilters((prev) => ({ ...prev, status: value }));
            }}
            className="min-w-[140px] rounded-lg border border-gray-200 px-3 py-2"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          <input
            type="number"
            min={0}
            value={filters.maxReadTime}
            onChange={(event) => {
              setCurrentPage(1);
              setFilters((prev) => ({ ...prev, maxReadTime: event.target.value }));
            }}
            placeholder="Max read time"
            className="w-36 rounded-lg border border-gray-200 px-3 py-2"
          />
          <input
            type="date"
            value={filters.date}
            onChange={(event) => {
              setCurrentPage(1);
              setFilters((prev) => ({ ...prev, date: event.target.value }));
            }}
            className="rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>
      </div>

      {error && <p className="px-4 pt-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Tags</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Read</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pagedPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                <td className="px-6 py-4 text-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{post.readTime}</td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(post.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 text-xs font-semibold">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-gray-800 hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(post.id)}
                      className="rounded-lg border border-red-200 px-3 py-1 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm">
        <p className="text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filteredPosts.length)} of{' '}
          {filteredPosts.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="rounded-lg border border-gray-200 px-3 py-1 text-gray-700 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="rounded-lg border border-gray-200 px-3 py-1 text-gray-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
