import { Resend } from 'resend';

import { env } from '@/lib/env';
import { Errors } from '@/lib/errors';

/**
 * Lazy singleton — never construct at module load. `new Resend("")` throws
 * "Missing API key", which breaks `next build` in CI where the key is absent
 * (see the `blog-ci-red-eager-resend-init` incident). Only reached in
 * `EMAIL_DELIVERY_MODE=live`; `log`/`off` never call this.
 */
let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!env.RESEND_API_KEY) throw Errors.internal('Resend API key is not configured');
  if (!client) client = new Resend(env.RESEND_API_KEY);
  return client;
}
