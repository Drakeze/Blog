import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AdminNav } from '@/components/admin/admin-nav';
import { isAdmin } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

// Admin data is per-request and never cached.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // `proxy.ts` already enforces *authentication* on /admin; this enforces *authorization*.
  if (!(await isAdmin())) redirect('/');

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[13rem_1fr] md:px-6 md:py-10">
      <aside className="md:sticky md:top-10 md:h-fit">
        <p className="font-display mb-4 text-base font-semibold">
          <span className="mr-2 inline-block size-2 rounded-full bg-primary align-middle" />
          Admin
        </p>
        <AdminNav />
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
