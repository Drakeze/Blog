'use client';

import {
  ArrowLeft,
  BarChart3,
  FileText,
  LayoutDashboard,
  Mail,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type NavLink = { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };

const LINKS: NavLink[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <Link
        href="/"
        className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to site
      </Link>

      {LINKS.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(pathname, href, exact) ? 'page' : undefined}
          className={cn(
            'inline-flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive(pathname, href, exact)
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
