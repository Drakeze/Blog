import Link from 'next/link';

import { getPostSummaries } from '@/data/posts';

export default function AdminHomePage() {
  const posts = getPostSummaries();
  const totalPosts = posts.length;
  const published = posts.filter((post) => post.status === 'published').length;
  const drafts = posts.filter((post) => post.status === 'draft').length;
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">Overview</p>
          <h1 className="text-3xl font-semibold text-gray-900">Publishing Control Center</h1>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700"
          >
            New Post
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50"
          >
            Manage Posts
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total posts" value={totalPosts} />
        <StatCard label="Published" value={published} accent="green" />
        <StatCard label="Drafts" value={drafts} accent="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="text-lg font-semibold text-gray-900">Recent posts</h2>
              <Link
                href="/admin/posts"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {recentPosts.map((post) => (
                <li key={post.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{post.title}</p>
                    <p className="text-xs text-gray-500">
                      {post.readTime} • {post.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span
                      className={`rounded-full px-2.5 py-1 ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.status}
                    </span>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-gray-800 hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Quick actions</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm font-semibold text-blue-700">
              <Link
                href="/admin/posts/new"
                className="rounded-lg bg-blue-50 px-3 py-2 hover:bg-blue-100"
              >
                + Create post
              </Link>
              <Link
                href="/admin/posts"
                className="rounded-lg bg-blue-50 px-3 py-2 hover:bg-blue-100"
              >
                Edit posts
              </Link>
              <Link href="/blog" className="rounded-lg bg-blue-50 px-3 py-2 hover:bg-blue-100">
                View live blog
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Health</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex items-center justify-between">
                <span>Publishing pipeline</span>
                <StatusPill status="healthy" />
              </li>
              <li className="flex items-center justify-between">
                <span>API connectivity</span>
                <StatusPill status="healthy" />
              </li>
              <li className="flex items-center justify-between">
                <span>Draft backlog</span>
                <StatusPill status={drafts > 3 ? 'warning' : 'healthy'} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = { label: string; value: number; accent?: 'green' | 'amber' };

function StatCard({ label, value, accent }: StatCardProps) {
  const accentClasses =
    accent === 'green'
      ? 'bg-green-50 text-green-700'
      : accent === 'amber'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-blue-50 text-blue-700';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accentClasses}`}>{value}</p>
    </div>
  );
}

type StatusPillProps = { status: 'healthy' | 'warning' };

function StatusPill({ status }: StatusPillProps) {
  const styles =
    status === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {status === 'healthy' ? 'Healthy' : 'Attention needed'}
    </span>
  );
}
