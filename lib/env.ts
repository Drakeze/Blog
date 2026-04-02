import { z } from "zod"

const optionalString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value
    }

    const trimmed = value.trim()
    return trimmed.length === 0 ? undefined : trimmed
  },
  z.string().optional(),
)

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CLERK_SECRET_KEY: optionalString,
  CLERK_ADMIN_EMAILS: optionalString,
  CLERK_ADMIN_USER_IDS: optionalString,
  DATABASE_URL: optionalString,
  RESEND_API_KEY: optionalString,
  RESEND_FROM_EMAIL: optionalString,
  RESEND_REPLY_TO_EMAIL: optionalString,
  AUTO_SEND_POST_EMAILS: z.enum(["true", "false"]).default("false"),
  REDDIT_CLIENT_ID: optionalString,
  REDDIT_CLIENT_SECRET: optionalString,
  REDDIT_USER_AGENT: optionalString,
  REDDIT_USERNAME: optionalString,
})

const clientSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: optionalString,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: optionalString.default("/sign-in"),
  NEXT_PUBLIC_SITE_URL: optionalString.pipe(z.string().url()).default("http://localhost:3000"),
})

const mergedSchema = serverSchema.merge(clientSchema)

function formatErrors(errors: z.ZodIssue[]) {
  return errors.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")
}

const parsed = mergedSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${formatErrors(parsed.error.errors)}`)
}

export const env = {
  ...parsed.data,
}

export const publicEnv = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
}

function parseList(value: string | undefined) {
  return (
    value
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  )
}

export const authConfig = {
  clerkEnabled: Boolean(env.CLERK_SECRET_KEY && env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  signInUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  adminEmails: parseList(env.CLERK_ADMIN_EMAILS).map((email) => email.toLowerCase()),
  adminUserIds: parseList(env.CLERK_ADMIN_USER_IDS),
  hasAdminAllowlist: Boolean(parseList(env.CLERK_ADMIN_EMAILS).length || parseList(env.CLERK_ADMIN_USER_IDS).length),
}

export const databaseConfig = {
  configured: Boolean(env.DATABASE_URL),
  connectionString:
    env.DATABASE_URL ?? (env.NODE_ENV === "production" ? null : "mongodb://localhost:27017/blog"),
}

export const emailConfig = {
  resendEnabled: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
  autoSendPostEmails: env.AUTO_SEND_POST_EMAILS === "true",
  resendMissingKeys: [
    !env.RESEND_API_KEY ? "RESEND_API_KEY" : null,
    !env.RESEND_FROM_EMAIL ? "RESEND_FROM_EMAIL" : null,
  ].filter(Boolean) as string[],
  fromEmail: env.RESEND_FROM_EMAIL ?? null,
  replyToEmail: env.RESEND_REPLY_TO_EMAIL ?? null,
}

type PlatformConfig<TKeys extends Record<string, string | undefined>> = {
  enabled: boolean
  missingKeys: string[]
  keys: TKeys
}

function buildPlatformConfig<TKeys extends Record<string, string | undefined>>(keys: TKeys): PlatformConfig<TKeys> {
  const missingKeys = Object.entries(keys)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  return {
    enabled: missingKeys.length === 0,
    missingKeys,
    keys,
  }
}

export const socialConfig = {
  reddit: buildPlatformConfig({
    clientId: env.REDDIT_CLIENT_ID,
    clientSecret: env.REDDIT_CLIENT_SECRET,
    userAgent: env.REDDIT_USER_AGENT,
    username: env.REDDIT_USERNAME,
  }),
}

export type SocialPlatform = keyof typeof socialConfig

export type Env = typeof env
