import { NextResponse } from "next/server";

export async function GET() {
  const mockTweets = [
    {
      id: "tweet_1",
      platform: "twitter",
      text: "Testing Twitter integration for What The Post?! 🚀",
      url: "https://twitter.com/",
      createdAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json(mockTweets);
}