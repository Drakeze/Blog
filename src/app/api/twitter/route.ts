import { NextResponse } from 'next/server';

import { SOCIAL_PROFILES } from '@/config/social';

const TWITTER_PROFILE = SOCIAL_PROFILES.twitter;

export async function GET() {
  return NextResponse.json([
    {
      id: 'twitter-profile',
      platform: 'twitter',
      text: 'Follow @SorenIdeas on X for the latest updates.',
      url: TWITTER_PROFILE,
      createdAt: new Date().toISOString(),
    },
  ]);
}
