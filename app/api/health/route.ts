import { NextResponse } from "next/server"
import { authConfig, databaseConfig, emailConfig, publicEnv } from "@/lib/env"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: {
        configured: databaseConfig.configured,
      },
      clerk: {
        configured: authConfig.clerkEnabled,
        missingKeys: authConfig.missingKeys,
        adminAllowlistConfigured: authConfig.hasAdminAllowlist,
        keyModes: authConfig.keyModes,
        keyModeMismatch: authConfig.keyModeMismatch,
        signInUrl: authConfig.signInUrl,
        signUpUrl: authConfig.signUpUrl,
      },
      site: {
        url: publicEnv.NEXT_PUBLIC_SITE_URL,
      },
      resend: {
        configured: emailConfig.configured,
        missingKeys: emailConfig.missingKeys,
        autoSendPostEmails: emailConfig.autoSendPostEmails,
      },
    },
  })
}
