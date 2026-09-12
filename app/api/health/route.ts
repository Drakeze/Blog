import { NextResponse } from 'next/server';

import { isAdmin } from '@/lib/auth';
import {
  analyticsConfig,
  authConfig,
  databaseConfig,
  emailConfig,
  publicEnv,
  storageConfig,
} from '@/lib/env';

export async function GET() {
  const base = { status: 'ok' as const, timestamp: new Date().toISOString() };

  // The detailed config state is useful for debugging but is reconnaissance for
  // everyone else - admin only.
  if (!(await isAdmin())) return NextResponse.json(base);

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
      },
      site: { url: publicEnv.NEXT_PUBLIC_SITE_URL },
      resend: {
        configured: emailConfig.configured,
        deliveryMode: emailConfig.deliveryMode,
        missingKeys: emailConfig.missingKeys,
        autoSendPostEmails: emailConfig.autoSendPostEmails,
      },
      storage: { configured: storageConfig.configured },
      analytics: { configured: analyticsConfig.configured },
    },
  });
}
