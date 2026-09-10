import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SearchClient } from '@/components/site/search-client';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search every post on Thinking Out Loud.',
};

export default function SearchPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Search</h1>
      <Suspense fallback={null}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
