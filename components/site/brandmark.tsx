import Link from 'next/link';

import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

export function Brandmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('font-display inline-flex items-center gap-2 font-medium', className)}
    >
      <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
      {site.name}
    </Link>
  );
}
