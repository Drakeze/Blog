import { NextResponse } from 'next/server';

import { getPostSummaries } from '@/data/posts';

export async function GET() {
  const posts = getPostSummaries(6);
  return NextResponse.json(posts);
}
