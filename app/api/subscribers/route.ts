import { auth, currentUser } from '@clerk/nextjs/server';

import { apiError, apiOk } from '@/lib/api';
import { requireAdminApi } from '@/lib/auth';
import { listSubscribers, subscribe } from '@/lib/domains/subscribers/service';
import { listSubscribersQuerySchema, subscribeSchema } from '@/lib/domains/subscribers/validators';
import { sendSubscriptionConfirmation } from '@/lib/email/notifications';
import { Errors } from '@/lib/errors';
import { captureServerEvent } from '@/lib/posthog-server';

export async function GET(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(req.url);
    const { status } = listSubscribersQuerySchema.parse(Object.fromEntries(searchParams));
    return apiOk(await listSubscribers(status ?? 'all'));
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = subscribeSchema.parse(await req.json().catch(() => ({})));

    // Signed-in users subscribe with their Clerk account email.
    let email = body.email;
    let userId: string | undefined;
    const { userId: clerkUserId } = await auth();
    if (clerkUserId) {
      const user = await currentUser();
      email = user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? email;
      userId = clerkUserId;
    }

    if (!email) throw Errors.badRequest('An email address is required');

    const { created, subscriber } = await subscribe({ email, userId });

    if (created) {
      await sendSubscriptionConfirmation(subscriber.email, subscriber.confirmToken!);
      captureServerEvent({
        distinctId: userId ?? subscriber.email,
        event: 'server_newsletter_subscribed',
        properties: { is_authenticated: !!userId },
      });
      return apiOk({ message: 'Check your inbox to confirm your subscription.' }, 201);
    }

    // Don't re-send on repeat submits - the endpoint is unauthenticated, so an
    // auto-resend is an email-bomb vector. A pending subscriber who lost the
    // email re-confirms via a Phase 3b admin action or a future "resend" flow.
    if (!subscriber.confirmed) {
      return apiOk({ message: 'Check your inbox to confirm your subscription.' });
    }

    return apiOk({ message: 'You are already subscribed.' });
  } catch (err) {
    return apiError(err);
  }
}
