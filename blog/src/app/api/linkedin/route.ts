import { NextResponse } from "next/server";

export async function GET() {
  const mockLinkedinPosts = [
    {
      id: "lnk_1",
      platform: "linkedin",
      title: "Blog App integration testing in progress!",
      url: "https://linkedin.com/in/yourprofile",
      createdAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json(mockLinkedinPosts);
}