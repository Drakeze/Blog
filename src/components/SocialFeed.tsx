"use client";
import { useEffect, useState } from "react";

import { SOCIAL_PROFILES } from "@/config/social";

interface Post {
  id: string;
  platform: string;
  title?: string;
  text?: string;
  url: string;
  createdAt: string;
}

const fallbackLinks = [
  { label: "LinkedIn", platform: "linkedin", url: SOCIAL_PROFILES.linkedin },
  { label: "Reddit", platform: "reddit", url: SOCIAL_PROFILES.reddit },
  { label: "X (Twitter)", platform: "twitter", url: SOCIAL_PROFILES.twitter },
];

export default function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchAll = async () => {
      try {
        const response = await fetch("/api/social", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!active) return;

        if (Array.isArray(data)) {
          const sorted = [...data].sort(
            (a, b) =>
              new Date((b as Post).createdAt).getTime() -
              new Date((a as Post).createdAt).getTime()
          ) as Post[];
          setPosts(sorted);
          setError(sorted.length === 0);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load social feed", err);
        if (active) {
          setError(true);
        }
      }
    };

    fetchAll();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl font-semibold text-black">Social Feed</h2>

      {error && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
          We couldn&apos;t load the latest social posts automatically. Follow the
          profiles below to stay in the loop while API access is being
          finalized.
        </div>
      )}

      {posts.length > 0 ? (
        posts.map((post) => (
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
        ))
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {fallbackLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
            >
              <span className="font-semibold">{link.label}</span>
              <span className="text-sm">Visit profile ↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}