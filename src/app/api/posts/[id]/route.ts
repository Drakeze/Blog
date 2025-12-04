import { NextResponse } from 'next/server';

import { removePost, updatePost, type PostSource, type PostStatus } from '@/data/posts';

type RouteParams = { id: string };

type RouteContext = { params: RouteParams };

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  }

  const body = await request.json();

  const parseStatus = (value: string | null): PostStatus | undefined => {
    if (value === 'draft' || value === 'published') return value;
    return undefined;
  };

  const parseSource = (value: string | null): PostSource | undefined => {
    if (value === 'blog' || value === 'twitter' || value === 'linkedin' || value === 'reddit' || value === 'patreon') {
      return value;
    }
    return undefined;
  };

  try {
    const readTimeMinutes = Number.isFinite(body.readTimeMinutes)
      ? Number(body.readTimeMinutes)
      : Number.parseInt(body.readTimeMinutes ?? '', 10);

    const updated = updatePost(postId, {
      title: body.title ?? undefined,
      excerpt: body.excerpt ?? undefined,
      content: body.content ?? undefined,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      author: body.author ?? undefined,
      readTimeMinutes: Number.isFinite(readTimeMinutes) ? readTimeMinutes : undefined,
      status: parseStatus(body.status) ?? undefined,
      slug: body.slug ?? undefined,
      source: parseSource(body.source) ?? body.source,
      sourceUrl: body.sourceUrl ?? undefined,
      heroImage: body.heroImage ?? undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update post';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  }

  const removed = removePost(postId);

  if (!removed) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
