import { NextResponse } from 'next/server';

import { removePost, updatePost } from '@/data/posts';

type RouteParams = { id: string };

type RouteContext = { params: RouteParams };

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  }

  const body = await request.json();
  const updated = updatePost(postId, body);

  if (!updated) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
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
