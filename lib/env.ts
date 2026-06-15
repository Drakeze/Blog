function parseList(value: string | undefined) {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? []
}

function detectClerkKeyMode(value: string | undefined, testPrefix: string, livePrefix: string) {
  if (!value) return "missing"
  if (value.startsWith(testPrefix)) return "test"
  if (value.startsWith(livePrefix)) return "live"
  return "unknown"
}

const clerkPublishableKeyMode = detectClerkKeyMode(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  "pk_test_",
  "pk_live_",
)
const clerkSecretKeyMode = detectClerkKeyMode(process.env.CLERK_SECRET_KEY, "sk_test_", "sk_live_")
const clerkMissingKeys = [
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" : null,
  !process.env.CLERK_SECRET_KEY ? "CLERK_SECRET_KEY" : null,
].filter(Boolean) as string[]
const clerkKeyModeMismatch =
  clerkPublishableKeyMode !== "missing" &&
  clerkSecretKeyMode !== "missing" &&
  clerkPublishableKeyMode !== "unknown" &&
  clerkSecretKeyMode !== "unknown" &&
  clerkPublishableKeyMode !== clerkSecretKeyMode

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL ?? "",
  RESEND_REPLY_TO_EMAIL: process.env.RESEND_REPLY_TO_EMAIL,
  CLERK_ADMIN_EMAILS: parseList(process.env.CLERK_ADMIN_EMAILS).map((email) => email.toLowerCase()),
  CLERK_ADMIN_USER_IDS: parseList(process.env.CLERK_ADMIN_USER_IDS),
  AUTO_SEND_POST_EMAILS: process.env.AUTO_SEND_POST_EMAILS === "true",
  BLOG_API_KEY: process.env.BLOG_API_KEY ?? "",
  DRAFT_API_SECRET: process.env.DRAFT_API_SECRET ?? "",
} as const

export const publicEnv = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in",
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up",
  NEXT_PUBLIC_SITE_URL: env.SITE_URL,
} as const

export const authConfig = {
  clerkEnabled: Boolean(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  missingKeys: clerkMissingKeys,
  keyModes: {
    publishable: clerkPublishableKeyMode,
    secret: clerkSecretKeyMode,
  },
  keyModeMismatch: clerkKeyModeMismatch,
  signInUrl: publicEnv.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  signUpUrl: publicEnv.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  adminEmails: env.CLERK_ADMIN_EMAILS,
  adminUserIds: env.CLERK_ADMIN_USER_IDS,
  hasAdminAllowlist: Boolean(env.CLERK_ADMIN_EMAILS.length || env.CLERK_ADMIN_USER_IDS.length),
} as const

export const databaseConfig = {
  configured: Boolean(env.DATABASE_URL),
} as const

export const storageConfig = {
  configured: Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
  ),
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
  accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  bucketName: process.env.R2_BUCKET_NAME ?? "",
  publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "",
} as const

export const socialConfig = {
  reddit: {
    enabled: Boolean(
      process.env.REDDIT_CLIENT_ID &&
        process.env.REDDIT_CLIENT_SECRET &&
        process.env.REDDIT_USER_AGENT,
    ),
    missingKeys: [
      !process.env.REDDIT_CLIENT_ID ? "REDDIT_CLIENT_ID" : null,
      !process.env.REDDIT_CLIENT_SECRET ? "REDDIT_CLIENT_SECRET" : null,
      !process.env.REDDIT_USER_AGENT ? "REDDIT_USER_AGENT" : null,
    ].filter(Boolean) as string[],
    keys: {
      clientId: process.env.REDDIT_CLIENT_ID ?? "",
      clientSecret: process.env.REDDIT_CLIENT_SECRET ?? "",
      userAgent: process.env.REDDIT_USER_AGENT,
      username: process.env.REDDIT_USERNAME,
    },
  },
} as const

export const emailConfig = {
  configured: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
  resendEnabled: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
  missingKeys: [
    !env.RESEND_API_KEY ? "RESEND_API_KEY" : null,
    !env.RESEND_FROM_EMAIL ? "RESEND_FROM_EMAIL" : null,
  ].filter(Boolean) as string[],
  resendMissingKeys: [
    !env.RESEND_API_KEY ? "RESEND_API_KEY" : null,
    !env.RESEND_FROM_EMAIL ? "RESEND_FROM_EMAIL" : null,
  ].filter(Boolean) as string[],
  autoSendPostEmails: env.AUTO_SEND_POST_EMAILS,
} as const
