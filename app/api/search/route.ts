import { NextResponse } from 'next/server';
import { z } from 'zod';

import { apiError } from '@/lib/api';
import { searchPosts } from '@/lib/search';

const querySchema = z.object({
  q: z.string().trim().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

// CDN-cached: search results tolerate a minute of staleness, and this keeps a
// burst of identical queries off Atlas Search.
const CACHE = 'public, s-maxage=60, stale-while-revalidate=300';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams));

    // A blank query is a normal state for the header input, not an error.
    const hits = parsed.success ? await searchPosts(parsed.data.q, parsed.data.limit ?? 20) : [];

    return NextResponse.json({ hits }, { headers: { 'Cache-Control': CACHE } });
  } catch (err) {
    return apiError(err);
  }
}
