import Image from 'next/image';
import Link from 'next/link';

import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

export function Brandmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('font-display inline-flex items-center gap-2 font-medium', className)}
    >
      <Image
        src="/DrakezeWind.png"
        alt=""
        width={22}
        height={22}
        className="rounded-full"
        priority
      />
      {site.name}
    </Link>
  );
}
