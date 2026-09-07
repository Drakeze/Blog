import { ObjectId } from 'mongodb';

export type EmailLogStatus = 'queued' | 'sent' | 'failed' | 'skipped';

/**
 * One row per outbound email attempt. `skipped` = `EMAIL_DELIVERY_MODE` was
 * `log`/`off`, so nothing was actually sent. Gives the admin a delivery trail
 * without depending on the Resend dashboard.
 */
export interface EmailLog {
  _id?: ObjectId;
  to: string;
  template: string; // "newsletter" | "confirm-subscription" | "comment-notification" | ...
  subject?: string;
  status: EmailLogStatus;
  providerMessageId?: string;
  error?: string;
  meta?: Record<string, unknown>; // e.g. { postSlug }
  createdAt: Date;
}
