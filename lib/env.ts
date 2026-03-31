import { z } from "zod"

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required").default("development-secret"),
  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_ADMIN_EMAILS: z.string().optional(),
  CLERK_ADMIN_USER_IDS: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  PATREON_ACCESS_TOKEN: z.string().optional(),
  PATREON_CAMPAIGN_ID: z.string().optional(),
  REDDIT_CLIENT_ID: z.string().optional(),
  REDDIT_CLIENT_SECRET: z.string().optional(),
  REDDIT_USER_AGENT: z.string().optional(),
  LINKEDIN_ACCESS_TOKEN: z.string().optional(),
  TWITTER_BEARER_TOKEN: z.string().optional(),
  DAILYDEV_API_KEY: z.string().optional(),
  DAILYDEV_USERNAME: z.string().optional(),
})

const clientSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_PATREON_URL: z.string().url().optional(),
  NEXT_PUBLIC_LINKEDIN_URL: z.string().url().optional(),
  NEXT_PUBLIC_TWITTER_URL: z.string().url().optional(),
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
  DATABASE_URL: parsed.data.DATABASE_URL ?? "mongodb://localhost:27017/blog",
}

export const publicEnv = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_PATREON_URL: env.NEXT_PUBLIC_PATREON_URL,
  NEXT_PUBLIC_LINKEDIN_URL: env.NEXT_PUBLIC_LINKEDIN_URL,
  NEXT_PUBLIC_TWITTER_URL: env.NEXT_PUBLIC_TWITTER_URL,
}

function parseList(value: string | undefined) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? []
}

export const authConfig = {
  clerkEnabled: Boolean(env.CLERK_SECRET_KEY && env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  signInUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  adminEmails: parseList(env.CLERK_ADMIN_EMAILS).map((email) => email.toLowerCase()),
  adminUserIds: parseList(env.CLERK_ADMIN_USER_IDS),
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
  }),
  linkedin: buildPlatformConfig({
    accessToken: env.LINKEDIN_ACCESS_TOKEN,
  }),
  patreon: buildPlatformConfig({
    accessToken: env.PATREON_ACCESS_TOKEN,
    campaignId: env.PATREON_CAMPAIGN_ID,
  }),
  twitter: buildPlatformConfig({
    bearerToken: env.TWITTER_BEARER_TOKEN,
  }),
  dailydev: buildPlatformConfig({
    apiKey: env.DAILYDEV_API_KEY,
    username: env.DAILYDEV_USERNAME,
  }),
}

export type SocialPlatform = keyof typeof socialConfig

export type Env = typeof env
