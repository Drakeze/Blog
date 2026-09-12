import Link from 'next/link';

import { cn, getTagColorClasses } from '@/lib/utils';

/** `activeTag` undefined = the "all" pill is active (homepage). */
export function TagBar({ tags, activeTag }: { tags: string[]; activeTag?: string }) {
  if (tags.length === 0) return null;

  return (
    <div className="mb-9 flex flex-wrap gap-2">
      <Pill href="/" label="all" active={!activeTag} />
      {tags.map((t) => (
        <Pill
          key={t}
          href={`/tags/${encodeURIComponent(t)}`}
          label={t}
          active={t === activeTag}
          colorClasses={getTagColorClasses(t)}
        />
      ))}
    </div>
  );
}

function Pill({
  href,
  label,
  active,
  colorClasses,
}: {
  href: string;
  label: string;
  active: boolean;
  colorClasses?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-full border px-2.5 py-1 font-mono text-[0.72rem] tracking-wide transition-colors',
        colorClasses
          ? cn('border-transparent', colorClasses, active && 'outline-2 outline-offset-1 outline-current')
          : active
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-line-strong bg-card text-muted-foreground hover:border-primary'
      )}
    >
      {label}
    </Link>
  );
}
