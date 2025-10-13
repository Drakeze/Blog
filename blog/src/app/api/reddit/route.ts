import { NextResponse } from "next/server";

export async function GET() {
  // Temporary mock data
  const mockRedditPosts = [
    {
      id: "1",
      platform: "reddit",
      title: "Reddit Integration Setup Started!",
      url: "https://reddit.com/r/webdev/",
      createdAt: new Date().toISOString(),
      subreddit: "webdev",
    },
  ];

  return NextResponse.json(mockRedditPosts);
}