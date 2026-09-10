import type { Metadata } from 'next';

import { SubscribeForm } from '@/components/site/subscribe-form';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Subscribe',
  description: `Get new posts from ${site.name} in your inbox.`,
};

export default function SubscribePage() {
  return (
    <div className="max-w-[38rem]">
      <h1 className="font-display text-[clamp(2rem,1.3rem+3.2vw,3rem)] font-medium">
        New posts, in your inbox
      </h1>
      <p className="mt-3 text-muted-foreground">
        Roughly one a week — software, systems, and the craft of building things. Confirm your
        address once (double opt-in), and every email has a one-click unsubscribe.
      </p>
      <div className="mt-6">
        <SubscribeForm />
      </div>
    </div>
  );
}
