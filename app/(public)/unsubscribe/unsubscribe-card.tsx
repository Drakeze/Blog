'use client';

import Link from 'next/link';
import { useState } from 'react';

type State = 'confirm' | 'loading' | 'success' | 'error';

/**
 * Plain markup — no shadcn. Phase 5 restyles the public pages; this just has to
 * work end-to-end for the double opt-in verification.
 */
export function UnsubscribeCard({ token }: { token?: string }) {
  const [state, setState] = useState<State>('confirm');
  const [error, setError] = useState('');

  if (!token) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Invalid unsubscribe link</h1>
        <p className="opacity-70">This link looks broken or expired.</p>
        <Link href="/" className="inline-block underline">
          Back to the blog
        </Link>
      </section>
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
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">You&apos;ve been unsubscribed</h1>
        <p className="opacity-70">
          You&apos;ll no longer receive newsletter emails. Re-subscribe any time from the site.
        </p>
        <Link href="/" className="inline-block underline">
          Back to the blog
        </Link>
      </section>
    );
  }

  if (state === 'error') {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Unsubscribe failed</h1>
        <p className="opacity-70">{error}</p>
        <button type="button" onClick={() => setState('confirm')} className="underline">
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Unsubscribe from the newsletter?</h1>
      <p className="opacity-70">You&apos;ll stop receiving new-post emails.</p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={confirm}
          disabled={state === 'loading'}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          {state === 'loading' ? 'Unsubscribing…' : 'Yes, unsubscribe me'}
        </button>
        <Link href="/" className="rounded px-4 py-2 underline">
          Keep me subscribed
        </Link>
      </div>
    </section>
  );
}
