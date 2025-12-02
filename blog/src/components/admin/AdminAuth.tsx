'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminAuthProps {
  authorized: boolean;
  children: React.ReactNode;
}

export default function AdminAuth({ authorized, children }: AdminAuthProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Invalid password');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to authenticate');
    } finally {
      setLoading(false);
    }
  };

  if (authorized) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Admin access</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-300">Enter the admin password to continue.</p>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-100">{error}</p>}

        <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-neutral-200">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            placeholder="••••••"
          />
        </label>

        <button
          type="button"
          onClick={submit}
          disabled={loading || password.length === 0}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Verifying...' : 'Unlock admin'}
        </button>
      </div>
    </div>
  );
}
