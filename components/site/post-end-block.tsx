import { SubscribeForm } from '@/components/site/subscribe-form';
import { site } from '@/lib/site';

/** Newsletter subscribe + Patreon ask folded into one unit (per the Phase 0 design). */
export function PostEndBlock() {
  return (
    <div className="my-11 overflow-hidden rounded-[14px] border border-line-strong bg-card">
      <div className="p-6">
        <h2 className="font-display text-[1.375rem] font-medium">New posts, in your inbox</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Roughly one a week. Confirm once, unsubscribe anytime.
        </p>
        <SubscribeForm />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-sunk px-6 py-4 text-sm text-muted-foreground">
        <span>Writing like this is reader-supported.</span>
        <a
          href={site.patreonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[0.76rem] tracking-wide text-primary hover:underline"
        >
          Support on Patreon →
        </a>
      </div>
    </div>
  );
}
