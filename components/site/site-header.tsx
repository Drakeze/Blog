'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Brandmark } from '@/components/site/brandmark';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { navLinks } from '@/lib/site';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    fetch('/api/me')
      .then((r) => r.json())
      .then((d: { isAdmin?: boolean }) => {
        if (!cancelled) setIsAdmin(!!d.isAdmin);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  const showAdmin = !!isSignedIn && isAdmin;

  return (
    <header className="mb-10 flex items-center justify-between gap-4 border-b border-border pb-5">
      <Brandmark className="text-base" />

      <nav className="flex items-center gap-5 font-mono text-[0.78rem] tracking-wide text-muted-foreground">
        {navLinks.map((l) => {
          const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={cn('transition-colors hover:text-foreground', active && 'text-foreground')}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href="/search"
          aria-label="Search"
          className="grid size-8 place-items-center rounded-lg border border-border text-faint transition-colors hover:border-primary hover:text-foreground"
        >
          <Search className="size-4" />
        </Link>
        <ThemeToggle />

        {isLoaded && !isSignedIn ? (
          <SignInButton mode="modal">
            <button
              type="button"
              className="rounded-lg border border-line-strong bg-card px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider transition-colors hover:border-primary"
            >
              Sign in
            </button>
          </SignInButton>
        ) : null}

        {isLoaded && isSignedIn ? (
          <UserButton
            appearance={{ elements: { userButtonAvatarBox: 'size-7' } }}
          >
            {showAdmin ? (
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Admin"
                  labelIcon={<span className="size-2 rounded-full bg-primary" />}
                  href="/admin"
                />
              </UserButton.MenuItems>
            ) : null}
          </UserButton>
        ) : null}
      </div>
    </header>
  );
}
