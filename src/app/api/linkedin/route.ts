import { NextResponse } from 'next/server';

import { SOCIAL_PROFILES } from '@/config/social';

const LINKEDIN_PROFILE = SOCIAL_PROFILES.linkedin;

export async function GET() {
  return NextResponse.json([
    {
      id: 'linkedin-profile',
      platform: 'linkedin',
      title: 'Connect on LinkedIn for product announcements and articles.',
      url: LINKEDIN_PROFILE,
      createdAt: new Date().toISOString(),
    },
  ]);
}
