import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from 'next/font/google';

import { publicEnv } from '@/lib/env';

import { Providers } from './providers';

const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' });
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL || 'https://blog.drakeze.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Thinking Out Loud',
    template: '%s · Thinking Out Loud',
  },
  description:
    'Software, systems, and the craft of building things — mostly in public. By Anthony (Drakeze).',
  applicationName: 'Thinking Out Loud',
  authors: [{ name: 'Anthony Shead', url: 'https://drakeze.com' }],
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/feed.xml' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Thinking Out Loud',
    title: 'Thinking Out Loud',
    description: 'Software, systems, and the craft of building things — mostly in public.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@SorenIdeas',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${newsreader.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
