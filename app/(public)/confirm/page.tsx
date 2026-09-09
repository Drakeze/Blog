import Link from 'next/link';

import { confirmSubscriber } from '@/lib/domains/subscribers/service';
import { tokenSchema } from '@/lib/domains/subscribers/validators';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default async function ConfirmPage({ searchParams }: Props) {
  const { token } = await searchParams;
  // Parse before it reaches the Mongo filter — repeated `?token=` params arrive
  // as an array, and validators.ts is the operator-injection guard.
  const parsed = tokenSchema.safeParse({ token });
  const subscriber = parsed.success ? await confirmSubscriber(parsed.data.token) : null;

  if (subscriber) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">You&apos;re subscribed</h1>
        <p className="opacity-70">
          Thanks for confirming — new posts will land in your inbox. You can unsubscribe from the
          link in any email.
        </p>
        <Link href="/" className="inline-block underline">
          Back to the blog
        </Link>
      </section>
    );
  }

  // An unknown or already-spent token (a second click on the same link) lands
  // here — the token is `$unset` on first confirm.
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">This link is invalid or expired</h1>
      <p className="opacity-70">
        If you already confirmed, you&apos;re all set. Otherwise, subscribe again to get a fresh
        confirmation email.
      </p>
      <Link href="/" className="inline-block underline">
        Back to the blog
      </Link>
    </section>
  );
}
