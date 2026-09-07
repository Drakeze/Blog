'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

/**
 * Phase 1 placeholder — a smoke test for the design tokens, the three fonts, and
 * the light/dark toggle. The real homepage (post list + nav + footer) is Phase 5.
 */
export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="border-border flex items-start justify-between border-b pb-6">
        <div>
          <p className="font-display flex items-center gap-2 text-lg">
            <span className="bg-primary inline-block h-2.5 w-2.5 rounded-full" />
            Thinking Out Loud
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            blog.drakeze.com — fresh repo, Phase 1 scaffold.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="border-line-strong text-muted-foreground hover:text-foreground grid h-9 w-9 place-items-center rounded-lg border"
          aria-label="Toggle theme"
        >
          <Sun size={16} className="hidden dark:block" />
          <Moon size={16} className="block dark:hidden" />
        </button>
      </header>

      <section className="mt-10 space-y-6">
        <h1 className="font-display text-4xl font-medium">Getting the Languages Back</h1>
        <p className="font-display text-primary text-2xl italic">
          Fluency isn&rsquo;t knowledge. It&rsquo;s the tax you pay for not practising.
        </p>
        <p className="text-[1.0625rem] leading-7">
          Hanken Grotesk running body copy at a calm humanist weight. The chrome stays quiet; the
          warmth lives in the illustrated plate on each post.
        </p>
        <p className="text-faint font-mono text-xs tracking-widest uppercase">
          Portfolio · Dev Journey — Sep 3, 2026 · 5 min read
        </p>
        <pre className="border-border bg-sunk overflow-x-auto rounded-[10px] border p-4 font-mono text-[0.8rem] leading-7">
          <code>{`bun run dev        # Next.js dev server\nbun run verify-env # check Mongo / Clerk / Resend / R2`}</code>
        </pre>
        <div className="flex flex-wrap gap-2">
          {['background', 'primary', 'accent', 'muted', 'ok', 'warn'].map((t) => (
            <span
              key={t}
              className="border-line-strong rounded-md border px-2.5 py-1 font-mono text-xs"
              style={{ background: `var(--${t})` }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
