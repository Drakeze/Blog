import Link from 'next/link';

import PostTable from '@/components/admin/PostTable';
import { getPostSummaries } from '@/data/posts';

export default function AdminPostsPage() {
  const posts = getPostSummaries();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Content</p>
          <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Create post
        </Link>
      </div>

      <PostTable posts={posts} />
    </div>
  );
}
