import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import Link from 'next/link';

import { BookmarksList } from '@/components/site/bookmarks-list';
import { listByUser } from '@/lib/domains/bookmarks/service';

export const metadata: Metadata = { title: 'Bookmarks', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function BookmarksPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div>
        <h1 className="font-display text-2xl font-medium">Bookmarks</h1>
        <p className="mt-3 text-muted-foreground">
          <Link href="/sign-in" className="text-primary underline-offset-2 hover:underline">
            Sign in
          </Link>{' '}
          to save posts and find them here.
        </p>
      </div>
    );
  }

  const bookmarks = await listByUser(userId);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Bookmarks</h1>
      <BookmarksList
        initial={bookmarks.map((b) => ({
          postSlug: b.postSlug,
          postTitle: b.postTitle,
          postExcerpt: b.postExcerpt,
          postCoverImage: b.postCoverImage ?? null,
        }))}
      />
    </div>
  );
}
