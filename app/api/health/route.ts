import { NextResponse } from "next/server"
import { authConfig, databaseConfig, emailConfig, publicEnv } from "@/lib/env"
import { isAdmin } from "@/lib/auth"

export async function GET() {
  const base = { status: "ok" as const, timestamp: new Date().toISOString() }

  // The detailed config state (Clerk key modes, missing keys, allowlist status,
  // sign-in URLs) is useful for debugging but is reconnaissance for everyone
  // else — admin only.
  if (!(await isAdmin())) {
    return NextResponse.json(base)
  }

  return NextResponse.json({
    ...base,
    services: {
      database: { configured: databaseConfig.configured },
      clerk: {
        configured: authConfig.clerkEnabled,
        missingKeys: authConfig.missingKeys,
        adminAllowlistConfigured: authConfig.hasAdminAllowlist,
        keyModes: authConfig.keyModes,
        keyModeMismatch: authConfig.keyModeMismatch,
        signInUrl: authConfig.signInUrl,
        signUpUrl: authConfig.signUpUrl,
      },
      site: { url: publicEnv.NEXT_PUBLIC_SITE_URL },
      resend: {
        configured: emailConfig.configured,
        missingKeys: emailConfig.missingKeys,
        autoSendPostEmails: emailConfig.autoSendPostEmails,
      },
    },
  })
}
