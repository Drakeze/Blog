import { z } from "zod"

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  ADMIN_PASSWORD: z.string().min(1, "ADMIN_PASSWORD is required").default("admin"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required").default("development-secret"),
  PATREON_ACCESS_TOKEN: z.string().optional(),
  PATREON_CAMPAIGN_ID: z.string().optional(),
  REDDIT_CLIENT_ID: z.string().optional(),
  REDDIT_CLIENT_SECRET: z.string().optional(),
  REDDIT_USER_AGENT: z.string().optional(),
  LINKEDIN_ACCESS_TOKEN: z.string().optional(),
  TWITTER_BEARER_TOKEN: z.string().optional(),
})

const clientSchema = z.object({
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

export const env = parsed.data

export const publicEnv = {
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_PATREON_URL: env.NEXT_PUBLIC_PATREON_URL,
  NEXT_PUBLIC_LINKEDIN_URL: env.NEXT_PUBLIC_LINKEDIN_URL,
  NEXT_PUBLIC_TWITTER_URL: env.NEXT_PUBLIC_TWITTER_URL,
}

export type Env = typeof env
