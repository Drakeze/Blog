export const SOCIAL_PROFILES = {
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_PROFILE ?? 'https://www.linkedin.com/in/anthonyshead/',
  reddit:
    process.env.NEXT_PUBLIC_REDDIT_PROFILE ?? 'https://www.reddit.com/user/Putrid-Economy1639/',
  twitter: process.env.NEXT_PUBLIC_TWITTER_PROFILE ?? 'https://x.com/SorenIdeas',
} as const;

export type SocialPlatform = keyof typeof SOCIAL_PROFILES;

export function getSocialProfile(platform: SocialPlatform) {
  return SOCIAL_PROFILES[platform];
}
