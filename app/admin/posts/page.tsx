"use client"

import Link from "next/link"

import PostTable from "@/components/admin/PostTable"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"

async function fetchAdminPosts() {
  const res = await fetch("/api/posts", {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch posts")
  }

  return res.json()
}

export default function AdminPostsPage() {
  const { data: posts, status, error } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: fetchAdminPosts,
  })

  if (status === "pending") {
    return <p>Loading posts…</p>
  }

  if (status === "error") {
    return <p>{(error as Error).message}</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Posts</h1>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/create">Create post</Link>
        </Button>
      </div>

      <PostTable posts={posts ?? []} />
    </div>
  )
}
