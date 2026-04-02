import { NextResponse } from "next/server"

import { authConfig, databaseConfig, emailConfig, socialConfig } from "@/lib/env"

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          configured: databaseConfig.configured,
        },
        clerk: {
          configured: authConfig.clerkEnabled,
          adminAllowlistConfigured: authConfig.hasAdminAllowlist,
        },
        resend: {
          configured: emailConfig.resendEnabled,
          autoSendPostEmails: emailConfig.autoSendPostEmails,
          missingKeys: emailConfig.resendMissingKeys,
        },
        reddit: {
          configured: socialConfig.reddit.enabled,
          missingKeys: socialConfig.reddit.missingKeys,
        },
      },
    },
    { status: 200 },
  )
}
