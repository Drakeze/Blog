import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch from the other API routes
    const [reddit, twitter, linkedin] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reddit`).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/twitter`).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/linkedin`).then((r) => r.json()),
    ]);

    // Combine and sort posts
    const allPosts = [...reddit, ...twitter, ...linkedin].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(allPosts);
  } catch (err) {
    console.error("Error fetching social posts:", err);
    return NextResponse.json(
      { error: "Failed to load social posts" },
      { status: 500 }
    );
  }
}