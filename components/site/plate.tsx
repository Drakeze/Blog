import Image from 'next/image';

import { cn } from '@/lib/utils';

/**
 * The framed "plate" that fronts every post - a commissioned illustration held
 * like a specimen in a field notebook. Falls back to a warm gradient + the cat
 * mark when a post has no cover image yet.
 */
export function Plate({
  src,
  alt,
  size = 'sm',
  priority = false,
}: {
  src?: string | null;
  alt: string;
  /** `sm` = homepage row (fixed square). `lg` = post page hero (full width). */
  size?: 'sm' | 'lg';
  priority?: boolean;
}) {
  const lg = size === 'lg';

  return (
    <div
      className={cn(
        'overflow-hidden border border-line-strong bg-sunk',
        lg ? 'rounded-[14px] p-1.5' : 'shrink-0 rounded-[10px] p-1'
      )}
    >
      <div
        className={cn(
          'relative grid place-items-center overflow-hidden',
          lg ? 'aspect-[16/9] rounded-[10px]' : 'size-16 rounded-lg sm:size-[4.5rem]'
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={lg ? '(min-width: 48rem) 40rem, 100vw' : '4.5rem'}
            className="object-cover"
            priority={priority}
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 120% at 30% 20%, #F6E7CE, #E9C9A0 60%, #D9A97C)',
              }}
            />
            <CatMark className={cn('relative text-[#8a5a34]', lg ? 'w-1/3' : 'w-2/3')} />
          </>
        )}
      </div>
    </div>
  );
}

function CatMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none">
      <path
        fill="currentColor"
        d="M22 30c0-8 1-16 3-16s7 7 10 11c4-2 9-3 15-3s11 1 15 3c3-4 8-11 10-11s3 8 3 16c4 5 6 11 6 18 0 18-16 30-34 30S16 66 16 48c0-7 2-13 6-18Z"
      />
      <circle cx="39" cy="47" r="3.4" fill="#FBFAF6" />
      <circle cx="61" cy="47" r="3.4" fill="#FBFAF6" />
      <path d="M46 57c2 2 6 2 8 0" stroke="#FBFAF6" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M50 52l-3 3h6Z" fill="#FBFAF6" />
      <path
        d="M78 66c10 2 16-4 16-12"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
