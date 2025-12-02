import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">Admin dashboard</p>
        <h2 className="text-lg font-semibold text-gray-900">Content Operations</h2>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          New Post
        </Link>
        <Link
          href="/admin/posts"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Manage Posts
        </Link>
      </div>
    </header>
  );
}
