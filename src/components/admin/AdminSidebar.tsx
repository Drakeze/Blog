'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/posts/new', label: 'New Post' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r border-gray-200 bg-white shadow-sm md:block">
      <div className="border-b border-gray-200 px-6 py-5">
        <p className="text-xs tracking-wide text-gray-500 uppercase">Blog Admin</p>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
