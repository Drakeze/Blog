import { NextResponse } from 'next/server';

import { apiError, apiOk } from '@/lib/api';
import { unsubscribe } from '@/lib/domains/subscribers/service';
import { tokenSchema } from '@/lib/domains/subscribers/validators';
import { Errors } from '@/lib/errors';
import { captureServerEvent } from '@/lib/posthog-server';

/** Email links point here (GET) — bounce to the confirmation page. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });
  return NextResponse.redirect(new URL(`/unsubscribe?token=${encodeURIComponent(token)}`, req.url));
}

/** The actual unsubscribe, called from the confirmation page. */
export async function DELETE(req: Request) {
  try {
    const { token } = tokenSchema.parse(await req.json().catch(() => ({})));
    const removed = await unsubscribe(token);
    if (!removed) throw Errors.notFound('Invalid or expired unsubscribe link');

    captureServerEvent({
      distinctId: removed.userId ?? removed.email,
      event: 'server_newsletter_unsubscribed',
    });

    return apiOk({ success: true });
  } catch (err) {
    return apiError(err);
  }
}
