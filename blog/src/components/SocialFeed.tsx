"use client";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  platform: string;
  title?: string;
  text?: string;
  url: string;
  createdAt: string;
}

export default function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [reddit, twitter, linkedin] = await Promise.all([
        fetch("/api/reddit").then((r) => r.json()),
        fetch("/api/twitter").then((r) => r.json()),
        fetch("/api/linkedin").then((r) => r.json()),
      ]);

      const combined = [...reddit, ...twitter, ...linkedin];
      combined.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(combined);
    };
    fetchAll();
  }, []);

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl font-semibold text-black">Social Feed</h2>
      {posts.map((post) => (
        <div
          key={post.id}
          className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
        >
          <p className="text-black">
            {post.title || post.text || "Untitled post"}
          </p>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{post.platform.toUpperCase()}</span>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Post
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}