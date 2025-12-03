import type { ReactNode } from 'react';

import type { SocialLinks } from '@/data/posts';

const styles: Record<keyof SocialLinks, { label: string; className: string; icon: ReactNode }> = {
  reddit: {
    label: 'Reddit',
    className:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/20 dark:text-orange-100 dark:border-orange-400/60',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M14.983 7.29a1.44 1.44 0 00-.982.377 7.1 7.1 0 00-3.24-.96l.69-2.185 1.89.398a1.45 1.45 0 102.9-.3 1.45 1.45 0 00-2.798.517l-2.179-.458a.467.467 0 00-.548.312l-.885 2.8a7.11 7.11 0 00-3.41.963 1.44 1.44 0 10-1.724 2.26 2.76 2.76 0 00-.054.51c0 2.29 2.65 4.152 5.913 4.152s5.913-1.862 5.913-4.152a2.75 2.75 0 00-.055-.513 1.44 1.44 0 00-.39-2.881zm-8.465 1.985a1.05 1.05 0 111.047-1.047 1.05 1.05 0 01-1.047 1.047zm6.028 3.227a3.597 3.597 0 01-2.546.894 3.597 3.597 0 01-2.546-.894.2.2 0 01.282-.282 3.201 3.201 0 002.264.797 3.2 3.2 0 002.264-.797.2.2 0 01.282.282zm-.264-2.18a1.05 1.05 0 110-2.1 1.05 1.05 0 010 2.1z" />
      </svg>
    ),
  },
  twitter: {
    label: 'Twitter',
    className:
      'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/20 dark:text-sky-100 dark:border-sky-400/60',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    className:
      'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-100 dark:border-blue-400/60',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path
          fillRule="evenodd"
          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  patreon: {
    label: 'Patreon',
    className:
      'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-100 dark:border-rose-400/60',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3 3h4v18H3V3zm9.5 0C8.916 3 6 5.916 6 9.5S8.916 16 12.5 16 19 13.084 19 9.5 16.084 3 12.5 3z" />
      </svg>
    ),
  },
};

type SocialBadgeProps = {
  platform: keyof SocialLinks;
  url: string;
};

export default function SocialBadge({ platform, url }: SocialBadgeProps) {
  const config = styles[platform];
  if (!config) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${config.className} hover:shadow-sm`}
    >
      {config.icon}
      <span>{config.label}</span>
    </a>
  );
}
