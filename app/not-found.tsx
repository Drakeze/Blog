import Link from 'next/link';

import { Brandmark } from '@/components/site/brandmark';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <Brandmark className="mb-10 text-base" />
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-faint">404</p>
      <h1 className="mt-3 font-display text-3xl font-medium">This page wandered off</h1>
      <p className="mt-2 text-muted-foreground">
        The post may have been moved or unpublished.
      </p>
      <div className="mt-6 flex gap-4 font-mono text-xs uppercase tracking-wider">
        <Link href="/" className="text-primary hover:underline">
          Home
        </Link>
        <Link href="/search" className="text-muted-foreground hover:text-foreground">
          Search
        </Link>
      </div>
    </div>
  );
}
