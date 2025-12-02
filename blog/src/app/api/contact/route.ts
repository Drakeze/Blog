import { NextResponse } from 'next/server';

import { appendJsonRecord } from '@/data/storage';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, subject, message } = body ?? {};

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Name, email, subject, and message are required.' }, { status: 400 });
  }

  await appendJsonRecord('contact-messages.json', {
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
