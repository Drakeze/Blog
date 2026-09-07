import { z } from 'zod';

/**
 * Environment access, centralized. Deliberately **non-throwing**: a bad build
 * env should surface as a degraded `/api/health` and disabled features, never a
 * crashed lambda (this app has the incident history to prove why). `zod` is
 * used for coercion + shape, then `safeParse` falls back to safe defaults.
 */

const list = z
  .string()
  .optional()
  .transform(
    (v) =>
      v
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? []
  );

const bool = z
  .string()
  .optional()
  .transform((v) => v === 'true');

const schema = z.object({
  DATABASE_URL: z.string().optional().default(''),
  NEXT_PUBLIC_SITE_URL: z.string().optional().default('http://localhost:3000'),

  RESEND_API_KEY: z.string().optional().default(''),
  RESEND_FROM_EMAIL: z.string().optional().default(''),
  RESEND_REPLY_TO_EMAIL: z.string().optional(),
  EMAIL_DELIVERY_MODE: z.enum(['live', 'log', 'off']).optional().default('log'),
  AUTO_SEND_POST_EMAILS: bool,

  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional().default('/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional().default('/sign-up'),
  CLERK_ADMIN_EMAILS: list,
  CLERK_ADMIN_USER_IDS: list,

  CLOUDFLARE_ACCOUNT_ID: z.string().optional().default(''),
  R2_ACCESS_KEY_ID: z.string().optional().default(''),
  R2_SECRET_ACCESS_KEY: z.string().optional().default(''),
  R2_BUCKET_NAME: z.string().optional().default(''),
  NEXT_PUBLIC_R2_PUBLIC_URL: z.string().optional().default(''),

  NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: z.string().optional().default(''),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional().default('https://us.i.posthog.com'),

  DRAFT_API_SECRET: z.string().optional().default(''),
  MCP_SERVICE_SECRET: z.string().optional().default(''),
});

const parsed = schema.safeParse(process.env);
const raw = parsed.success ? parsed.data : schema.parse({});
if (!parsed.success && process.env.NODE_ENV !== 'test') {
  console.warn('[env] validation issues:', parsed.error.flatten().fieldErrors);
}

// --- Clerk key-mode detection (test vs live pk/sk mismatch is a silent 500) ---
function clerkKeyMode(value: string | undefined, testPrefix: string, livePrefix: string) {
  if (!value) return 'missing' as const;
  if (value.startsWith(testPrefix)) return 'test' as const;
  if (value.startsWith(livePrefix)) return 'live' as const;
  return 'unknown' as const;
}
const pubMode = clerkKeyMode(raw.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, 'pk_test_', 'pk_live_');
const secMode = clerkKeyMode(raw.CLERK_SECRET_KEY, 'sk_test_', 'sk_live_');
const clerkKeyModeMismatch =
  pubMode !== 'missing' &&
  secMode !== 'missing' &&
  pubMode !== 'unknown' &&
  secMode !== 'unknown' &&
  pubMode !== secMode;

export const env = {
  DATABASE_URL: raw.DATABASE_URL,
  SITE_URL: raw.NEXT_PUBLIC_SITE_URL,
  RESEND_API_KEY: raw.RESEND_API_KEY,
  RESEND_FROM_EMAIL: raw.RESEND_FROM_EMAIL,
  RESEND_REPLY_TO_EMAIL: raw.RESEND_REPLY_TO_EMAIL,
  EMAIL_DELIVERY_MODE: raw.EMAIL_DELIVERY_MODE,
  AUTO_SEND_POST_EMAILS: raw.AUTO_SEND_POST_EMAILS,
  CLERK_ADMIN_EMAILS: raw.CLERK_ADMIN_EMAILS.map((e) => e.toLowerCase()),
  CLERK_ADMIN_USER_IDS: raw.CLERK_ADMIN_USER_IDS,
  DRAFT_API_SECRET: raw.DRAFT_API_SECRET,
  MCP_SERVICE_SECRET: raw.MCP_SERVICE_SECRET,
} as const;

export const publicEnv = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: raw.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: raw.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: raw.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  NEXT_PUBLIC_SITE_URL: raw.NEXT_PUBLIC_SITE_URL,
} as const;

export const authConfig = {
  clerkEnabled: Boolean(raw.CLERK_SECRET_KEY && raw.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  missingKeys: [
    !raw.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY' : null,
    !raw.CLERK_SECRET_KEY ? 'CLERK_SECRET_KEY' : null,
  ].filter(Boolean) as string[],
  keyModes: { publishable: pubMode, secret: secMode },
  keyModeMismatch: clerkKeyModeMismatch,
  signInUrl: raw.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  signUpUrl: raw.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  adminEmails: env.CLERK_ADMIN_EMAILS,
  adminUserIds: env.CLERK_ADMIN_USER_IDS,
  hasAdminAllowlist: Boolean(env.CLERK_ADMIN_EMAILS.length || env.CLERK_ADMIN_USER_IDS.length),
} as const;

export const databaseConfig = {
  configured: Boolean(env.DATABASE_URL),
} as const;

export const storageConfig = {
  configured: Boolean(
    raw.CLOUDFLARE_ACCOUNT_ID &&
    raw.R2_ACCESS_KEY_ID &&
    raw.R2_SECRET_ACCESS_KEY &&
    raw.R2_BUCKET_NAME &&
    raw.NEXT_PUBLIC_R2_PUBLIC_URL
  ),
  accountId: raw.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: raw.R2_ACCESS_KEY_ID,
  secretAccessKey: raw.R2_SECRET_ACCESS_KEY,
  bucketName: raw.R2_BUCKET_NAME,
  publicUrl: raw.NEXT_PUBLIC_R2_PUBLIC_URL,
} as const;

export const emailConfig = {
  configured: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
  resendEnabled: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
  deliveryMode: env.EMAIL_DELIVERY_MODE,
  missingKeys: [
    !env.RESEND_API_KEY ? 'RESEND_API_KEY' : null,
    !env.RESEND_FROM_EMAIL ? 'RESEND_FROM_EMAIL' : null,
  ].filter(Boolean) as string[],
  autoSendPostEmails: env.AUTO_SEND_POST_EMAILS,
} as const;

export const analyticsConfig = {
  configured: Boolean(raw.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN),
  host: raw.NEXT_PUBLIC_POSTHOG_HOST,
} as const;

export const mcpConfig = {
  configured: Boolean(env.MCP_SERVICE_SECRET),
} as const;
