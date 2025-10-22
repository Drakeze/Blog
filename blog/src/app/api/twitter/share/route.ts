import { NextResponse } from 'next/server';

import { getPostBySlug } from '@/data/posts';

interface ShareRequestBody {
  slug?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ShareRequestBody;
  const slug = body.slug;

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing post slug' },
      { status: 400 }
    );
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: 'Share to Twitter simulated successfully',
    shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(post.originalUrl)}`,
  });
}
