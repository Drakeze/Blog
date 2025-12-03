import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAuth from '@/components/admin/AdminAuth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Blog',
  description: 'Manage blog posts, drafts, and publishing from the admin dashboard.',
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const isAuthorized = cookieStore.get('admin-auth')?.value === 'true';

  return (
    <AdminAuth authorized={isAuthorized}>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex flex-1 flex-col">
            <AdminHeader />
            <main className="flex-1 p-6 lg:p-10">{children}</main>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}
