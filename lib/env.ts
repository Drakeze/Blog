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

export const emailConfig = {
  configured: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
  missingKeys: [
    !env.RESEND_API_KEY ? "RESEND_API_KEY" : null,
    !env.RESEND_FROM_EMAIL ? "RESEND_FROM_EMAIL" : null,
  ].filter(Boolean) as string[],
  autoSendPostEmails: env.AUTO_SEND_POST_EMAILS,
} as const
