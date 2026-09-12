import Link from 'next/link';

import { confirmSubscriber } from '@/lib/domains/subscribers/service';
import { tokenSchema } from '@/lib/domains/subscribers/validators';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ token?: string | string[] }>;
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[32rem] py-10 text-center">
      <h1 className="font-display text-[1.75rem] font-medium">{title}</h1>
      <p className="mt-3 text-muted-foreground">{children}</p>
      <Link
        href="/"
        className="mt-6 inline-block font-mono text-xs uppercase tracking-wider text-primary hover:underline"
      >
        ← Back to the blog
      </Link>
    </section>
  );
}

export default async function ConfirmPage({ searchParams }: Props) {
  const { token } = await searchParams;
  // Parse before it reaches the Mongo filter - repeated `?token=` params arrive
  // as an array, and validators.ts is the operator-injection guard.
  const parsed = tokenSchema.safeParse({ token });
  const subscriber = parsed.success ? await confirmSubscriber(parsed.data.token) : null;

  if (subscriber) {
    return (
      <Shell title="You're subscribed">
        Thanks for confirming - new posts will land in your inbox. Every email has a one-click
        unsubscribe.
      </Shell>
    );
  }

  return (
    <Shell title="This link is invalid or expired">
      If you already confirmed, you&apos;re all set. Otherwise, subscribe again for a fresh
      confirmation email.
    </Shell>
  );
}
