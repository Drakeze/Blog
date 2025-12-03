import { NextResponse } from 'next/server';

import { SOCIAL_PROFILES } from '@/config/social';

const REDDIT_USERNAME = process.env.REDDIT_USERNAME ?? 'Putrid-Economy1639';
const REDDIT_API = `https://www.reddit.com/user/${REDDIT_USERNAME}/submitted.json?limit=5`;
const USER_AGENT =
  process.env.REDDIT_USER_AGENT ??
  'SorenIdeasBlog/1.0 (+https://sorenideas.com; contact@sorenideas.com)';

interface RedditListing {
  data?: {
    children?: Array<{
      data?: {
        id?: string;
        title?: string;
        permalink?: string;
        created_utc?: number;
        subreddit?: string;
      };
    }>;
  };
}

export async function GET() {
  const fallback = [
    {
      id: 'reddit-profile',
      platform: 'reddit',
      title: `Follow ${REDDIT_USERNAME} on Reddit`,
      url: SOCIAL_PROFILES.reddit,
      createdAt: new Date().toISOString(),
      subreddit: REDDIT_USERNAME,
    },
  ];

  try {
    const response = await fetch(REDDIT_API, {
      headers: {
        'User-Agent': USER_AGENT,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Reddit request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as RedditListing;
    const posts = (payload.data?.children ?? [])
      .map((entry) => entry.data)
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .map((post) => ({
        id: post.id ?? `${REDDIT_USERNAME}-${post.permalink ?? ''}`,
        platform: 'reddit',
        title: post.title ?? 'Reddit update',
        url: post.permalink ? `https://www.reddit.com${post.permalink}` : SOCIAL_PROFILES.reddit,
        createdAt: new Date((post.created_utc ?? Date.now() / 1000) * 1000).toISOString(),
        subreddit: post.subreddit ?? '',
      }))
      .slice(0, 5);

    if (posts.length > 0) {
      return NextResponse.json(posts);
    }
  } catch {
    return NextResponse.json(fallback);
  }

  return NextResponse.json(fallback);
}
