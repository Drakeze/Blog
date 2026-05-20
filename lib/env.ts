const requiredServer = [
  "DATABASE_URL",
  "CLERK_SECRET_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
] as const

if (typeof window === "undefined") {
  const missing = requiredServer.filter((k) => !process.env[k])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL!,
  RESEND_REPLY_TO_EMAIL: process.env.RESEND_REPLY_TO_EMAIL,
  CLERK_ADMIN_EMAILS:
    process.env.CLERK_ADMIN_EMAILS?.split(",").map((e) => e.trim()).filter(Boolean) ?? [],
  CLERK_ADMIN_USER_IDS:
    process.env.CLERK_ADMIN_USER_IDS?.split(",").map((id) => id.trim()).filter(Boolean) ?? [],
  AUTO_SEND_POST_EMAILS: process.env.AUTO_SEND_POST_EMAILS === "true",
} as const
