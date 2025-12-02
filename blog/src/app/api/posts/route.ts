import { NextResponse } from 'next/server';

import { addPost, filterPosts, getPostSummaries, type PostStatus } from '@/data/posts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag') ?? undefined;
  const date = searchParams.get('date') ?? undefined;
  const readTimeMinutes = searchParams.get('readTime');
  const statusParam = searchParams.get('status');
  const status: PostStatus | undefined = statusParam === 'draft' || statusParam === 'published' ? statusParam : undefined;

  const filtered = filterPosts({
    tag,
    date,
    status,
    readTimeMinutes: readTimeMinutes ? Number(readTimeMinutes) : undefined,
  }).map(({ content, ...summary }) => summary);

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    title,
    excerpt,
    content,
    category,
    tags = [],
    author,
    readTimeMinutes,
    socialLinks,
    status,
  } = body ?? {};

  if (!title || !excerpt || !content || !category || !author) {
    return NextResponse.json({ error: 'Title, excerpt, content, category, and author are required.' }, { status: 400 });
  }

  const newPost = addPost({
    title,
    excerpt,
    content,
    category,
    tags: Array.isArray(tags) ? tags : [],
    author,
    readTimeMinutes: Number.isFinite(readTimeMinutes) ? readTimeMinutes : 5,
    socialLinks,
    status,
  });

  return NextResponse.json(newPost, { status: 201 });
}

export function revalidateTag() {
  return getPostSummaries();
}
