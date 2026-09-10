'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type State = 'confirm' | 'loading' | 'success' | 'error';

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[32rem] py-10 text-center">
      <h1 className="font-display text-[1.75rem] font-medium">{title}</h1>
      <div className="mt-3 text-muted-foreground">{children}</div>
    </section>
  );
}

export function UnsubscribeCard({ token }: { token?: string }) {
  const [state, setState] = useState<State>('confirm');
  const [error, setError] = useState('');

  if (!token) {
    return (
      <Shell title="Invalid unsubscribe link">
        <p>This link looks broken or expired.</p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Back to the blog
        </Link>
      </Shell>
    );
  }

  async function confirm() {
    setState('loading');
    try {
      const res = await fetch('/api/subscribers/unsubscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setState('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? 'Something went wrong.');
        setState('error');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <Shell title="You've been unsubscribed">
        <p>You&apos;ll no longer receive newsletter emails. Re-subscribe any time from the site.</p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Back to the blog
        </Link>
      </Shell>
    );
  }

  if (state === 'error') {
    return (
      <Shell title="Unsubscribe failed">
        <p>{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setState('confirm')}>
          Try again
        </Button>
      </Shell>
    );
  }

  return (
    <Shell title="Unsubscribe from the newsletter?">
      <p>You&apos;ll stop receiving new-post emails.</p>
      <div className="mt-5 flex justify-center gap-3">
        <Button variant="destructive" disabled={state === 'loading'} onClick={confirm}>
          {state === 'loading' ? 'Unsubscribing…' : 'Yes, unsubscribe'}
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Keep me subscribed</Link>
        </Button>
      </div>
    </Shell>
  );
}
