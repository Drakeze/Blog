import { NextResponse } from 'next/server';

import { appendJsonRecord } from '@/data/storage';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body ?? {};

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }

  await appendJsonRecord('subscribers.json', {
    name,
    email,
    message: message ?? '',
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
