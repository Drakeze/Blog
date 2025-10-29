"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AdminPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [posts, setPosts] = useState<{ title: string; slug: string; content: string }[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPost = { title, slug, content }
    setPosts((prev) => [newPost, ...prev])
    setTitle("")
    setSlug("")
    setContent("")
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-accent">Blog Admin</h1>

        <Card className="p-6 bg-card border border-border shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Create New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background text-foreground border-border"
            />
            <Input
              placeholder="Slug (ex: my-first-post)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-background text-foreground border-border"
            />
            <Textarea
              placeholder="Write your post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] bg-background text-foreground border-border"
            />
            <Button type="submit" className="bg-success text-black hover:bg-accent transition">
              Publish Post
            </Button>
          </form>
        </Card>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Existing Posts</h2>
          {posts.length === 0 ? (
            <p className="text-muted">No posts yet.</p>
          ) : (
            posts.map((post, i) => (
              <Card key={i} className="p-4 bg-card border border-border">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">/{post.slug}</p>
                <p className="text-muted-foreground">{post.content}</p>
              </Card>
            ))
          )}
        </section>
      </div>
    </main>
  )
}