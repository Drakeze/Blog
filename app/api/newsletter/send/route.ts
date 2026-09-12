import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';

import { apiError, apiOk } from '@/lib/api';
import { requireAdminApi } from '@/lib/auth';
import { claimNewsletterSend, getPostBySlug } from '@/lib/domains/posts/service';
import { sendNewsletterTest, sendNewsletterToConfirmedSubscribers } from '@/lib/email/newsletter';
import { AppError, Errors } from '@/lib/errors';
import { captureServerEvent } from '@/lib/posthog-server';

const bodySchema = z.object({
  slug: z.string().trim().min(1).max(200),
  force: z.boolean().optional(),
  test: z.boolean().optional(),
});

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { slug, force, test } = bodySchema.parse(await req.json().catch(() => ({})));

    const post = await getPostBySlug(slug);
    if (!post || post.status !== 'published') throw Errors.notFound('Published post not found');

    if (test) {
      const user = await currentUser();
      const to = user?.emailAddresses[0]?.emailAddress;
      if (!to) throw Errors.badRequest('Your account has no email address to send the test to');
      await sendNewsletterTest(post, to);
      return apiOk({ test: true, to });
    }

    // Atomic claim - two overlapping requests (double-click, retry, auto-send +
    // manual) can't both pass this and email the list twice. The read above is a
    // fast path for the common already-sent case.
    if (!force && !(await claimNewsletterSend(post.slug))) {
      throw new AppError('Newsletter already sent for this post', 409, 'CONFLICT', {
        sentAt: post.newsletterSentAt ?? undefined,
        hint: 'Pass { force: true } to send again.',
      });
    }

    const result = await sendNewsletterToConfirmedSubscribers(post);

    captureServerEvent({
      distinctId: 'admin',
      event: 'server_newsletter_sent',
      properties: { post_slug: post.slug, ...result },
    });

    return apiOk(result);
  } catch (err) {
    return apiError(err);
  }
}
