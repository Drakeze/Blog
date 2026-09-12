import { env } from '@/lib/env';
import { AppError, Errors } from '@/lib/errors';
import { blogCollectionNames, getDb } from '@/lib/mongo';
import type { EmailLog, EmailLogStatus } from '@/models/email-log';

import { getResendClient } from './resend';

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  /** e.g. "newsletter" | "confirm-subscription" | "comment-notification" - stored on the EmailLog. */
  template: string;
  meta?: Record<string, unknown>;
}

async function logEmail(
  row: Omit<EmailLog, '_id' | 'createdAt'> & { status: EmailLogStatus }
): Promise<void> {
  try {
    const db = await getDb();
    await db
      .collection<EmailLog>(blogCollectionNames.emailLogs)
      .insertOne({ ...row, createdAt: new Date() } as EmailLog);
  } catch (err) {
    console.error('[email] failed to write EmailLog', err);
  }
}

/**
 * The single outbound-email chokepoint. Honors `EMAIL_DELIVERY_MODE`:
 *
 * - `off`  → nothing sent, nothing logged.
 * - `log`  → nothing sent; one `EmailLog` row, status `skipped` (dev default -
 *            local never emails real people, but the trail is complete).
 * - `live` → Resend send + an `EmailLog` row (`sent` with `providerMessageId`,
 *            or `failed` with the error). Throws `AppError` on hard failure.
 */
export async function sendEmail({
  to,
  subject,
  html,
  template,
  meta,
}: SendEmailInput): Promise<{ id: string | null; skipped: boolean }> {
  if (!subject.trim()) throw Errors.badRequest('Email subject is required');
  if (!html.trim()) throw Errors.badRequest('Email content is required');

  const mode = env.EMAIL_DELIVERY_MODE;

  if (mode === 'off') return { id: null, skipped: true };

  if (mode === 'log') {
    console.info(`[email:log] "${subject}" -> ${to} (not sent)`);
    await logEmail({ to, template, subject, status: 'skipped', meta });
    return { id: null, skipped: true };
  }

  let data: { id?: string } | null | undefined;
  let sendError: { message: string } | null | undefined;
  try {
    ({ data, error: sendError } = await getResendClient().emails.send({
      from: env.RESEND_FROM_EMAIL,
      ...(env.RESEND_REPLY_TO_EMAIL ? { replyTo: env.RESEND_REPLY_TO_EMAIL } : {}),
      to,
      subject,
      html,
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logEmail({ to, template, subject, status: 'failed', error: message, meta });
    throw err instanceof AppError ? err : Errors.internal('Failed to send email', message);
  }

  if (sendError) {
    await logEmail({ to, template, subject, status: 'failed', error: sendError.message, meta });
    throw Errors.internal('Failed to send email', sendError.message);
  }

  await logEmail({
    to,
    template,
    subject,
    status: 'sent',
    providerMessageId: data?.id,
    meta,
  });
  return { id: data?.id ?? null, skipped: false };
}
