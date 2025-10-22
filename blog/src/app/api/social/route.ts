import { NextResponse } from "next/server";

import { SOCIAL_PROFILES } from "@/config/social";

interface SocialPost {
  id: string;
  createdAt: string;
  url?: string;
  title?: string;
  text?: string;
  platform?: string;
  [key: string]: unknown;
}

export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    const endpoints = [
      { name: "reddit", url: new URL("/api/reddit", origin) },
      { name: "twitter", url: new URL("/api/twitter", origin) },
      { name: "linkedin", url: new URL("/api/linkedin", origin) },
    ];

    const responses = await Promise.allSettled(
      endpoints.map(async ({ url }) => {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return (await response.json()) as SocialPost[];
      })
    );

    const allPosts: SocialPost[] = [];
    responses.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allPosts.push(...result.value);
      } else {
        console.warn(
          `Failed to load ${endpoints[index]!.name} posts:`,
          result.reason
        );
      }
    });

    allPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (allPosts.length === 0) {
      const fallbackTimestamp = new Date().toISOString();
      allPosts.push(
        {
          id: "linkedin-profile",
          platform: "linkedin",
          title: "Connect on LinkedIn",
          url: SOCIAL_PROFILES.linkedin,
          createdAt: fallbackTimestamp,
        },
        {
          id: "reddit-profile",
          platform: "reddit",
          title: "Join the conversation on Reddit",
          url: SOCIAL_PROFILES.reddit,
          createdAt: fallbackTimestamp,
        },
        {
          id: "twitter-profile",
          platform: "twitter",
          title: "Follow on X (Twitter)",
          url: SOCIAL_PROFILES.twitter,
          createdAt: fallbackTimestamp,
        }
      );
    }

    return NextResponse.json(allPosts);
  } catch (err) {
    console.error("Error fetching social posts:", err);
    return NextResponse.json(
      { error: "Failed to load social posts" },
      { status: 500 }
    );
  }
}