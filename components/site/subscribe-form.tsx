'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SubscribeForm() {
  const { isSignedIn } = useUser();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setMessage(null);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // Signed-in users subscribe with their account email — server ignores the body.
        body: JSON.stringify(isSignedIn ? {} : { email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message ?? 'Something went wrong');
      setState('done');
      setMessage(json.message ?? 'Check your inbox to confirm.');
    } catch (err) {
      setState('idle');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (state === 'done') {
    return <p className="text-sm text-[var(--ok)]">{message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap gap-2">
      {!isSignedIn ? (
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          aria-label="Email address"
          className="min-w-48 flex-1 bg-background"
        />
      ) : null}
      <Button type="submit" disabled={state === 'loading'} className="shrink-0">
        {state === 'loading' ? 'Subscribing…' : isSignedIn ? 'Subscribe' : 'Subscribe'}
      </Button>
      {message && state === 'idle' ? (
        <p className="w-full text-sm text-destructive">{message}</p>
      ) : null}
    </form>
  );
}
