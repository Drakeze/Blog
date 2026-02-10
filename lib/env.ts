import { z } from "zod"

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  ADMIN_PASSWORD: z.string().min(12, "ADMIN_PASSWORD must be at least 12 characters"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required").default("development-secret"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  PATREON_ACCESS_TOKEN: z.string().optional(),
  PATREON_CAMPAIGN_ID: z.string().optional(),
  REDDIT_CLIENT_ID: z.string().optional(),
  REDDIT_CLIENT_SECRET: z.string().optional(),
  REDDIT_USER_AGENT: z.string().optional(),
  REDDIT_USERNAME: z.string().optional(),
  LINKEDIN_ACCESS_TOKEN: z.string().optional(),
  LINKEDIN_AUTHOR_ID: z.string().optional(),
  TWITTER_BEARER_TOKEN: z.string().optional(),
  DAILYDEV_API_KEY: z.string().optional(),
})

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_PATREON_URL: z.string().url().optional(),
  NEXT_PUBLIC_LINKEDIN_URL: z.string().url().optional(),
  NEXT_PUBLIC_TWITTER_URL: z.string().url().optional(),
  NEXT_PUBLIC_DAILYDEV_URL: z.string().url().optional(),
})

const mergedSchema = serverSchema.merge(clientSchema)

function formatErrors(errors: z.ZodIssue[]) {
  return errors.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")
}

const parsed = mergedSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${formatErrors(parsed.error.errors)}`)
}

export const env = parsed.data

export const publicEnv = {
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_PATREON_URL: env.NEXT_PUBLIC_PATREON_URL,
  NEXT_PUBLIC_LINKEDIN_URL: env.NEXT_PUBLIC_LINKEDIN_URL,
  NEXT_PUBLIC_TWITTER_URL: env.NEXT_PUBLIC_TWITTER_URL,
  NEXT_PUBLIC_DAILYDEV_URL: env.NEXT_PUBLIC_DAILYDEV_URL,
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
  linkedin: buildPlatformConfig({
    accessToken: env.LINKEDIN_ACCESS_TOKEN,
    authorId: env.LINKEDIN_AUTHOR_ID,
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
  }),
}

export type SocialPlatform = keyof typeof socialConfig

export type Env = typeof env
