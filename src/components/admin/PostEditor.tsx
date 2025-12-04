"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost, PostStatus, SocialLinks } from "@/data/posts"

import SocialBadgeInput from "./SocialBadgeInput"

const defaultPost: Partial<BlogPost> = {
  title: "",
  excerpt: "",
  content: "",
  category: "General",
  tags: [],
  author: "Content Team",
  readTimeMinutes: 5,
  socialLinks: {},
  status: "draft",
}

type PostEditorProps = {
  mode: "create" | "edit"
  initialPost?: BlogPost
}

export default function PostEditor({ mode, initialPost }: PostEditorProps) {
  const router = useRouter()
  const [formState, setFormState] = useState<Partial<BlogPost>>(initialPost ?? defaultPost)
  const [tagsInput, setTagsInput] = useState((initialPost?.tags ?? []).join(", "))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)

  const parsedTags = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsInput],
  )

  const previewHtml = useMemo(() => {
    return (formState.content ?? "").replace(/\n/g, "<br />")
  }, [formState.content])

  const handleFieldChange = (key: keyof BlogPost, value: unknown) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const submit = async (status: PostStatus) => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: formState.title ?? "",
        excerpt: formState.excerpt ?? "",
        content: formState.content ?? "",
        category: formState.category ?? "General",
        tags: parsedTags,
        author: formState.author ?? "Content Team",
        readTimeMinutes: formState.readTimeMinutes ?? 5,
        socialLinks: (formState.socialLinks as SocialLinks) ?? {},
        status,
      }

      const url = mode === "edit" ? `/api/posts/${initialPost?.id}` : "/api/posts"
      const method = mode === "edit" ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Unable to save post")
      }

      router.push("/admin/posts")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">
              {mode === "edit" ? `Editing: ${initialPost?.title}` : "New Post"}
            </CardTitle>
            <CardDescription>
              {mode === "edit" ? "Update content and metadata" : "Create a brand new post"}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Button variant="outline" type="button" disabled={saving} onClick={() => void submit("draft")}>
              Save Draft
            </Button>
            <Button type="button" disabled={saving} onClick={() => void submit("published")}>
              Publish
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPreview((prev) => !prev)}
              className="text-foreground"
            >
              {preview ? "Hide preview" : "Preview"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={formState.title ?? ""}
                onChange={(event) => handleFieldChange("title", event.target.value)}
                placeholder="Enter a compelling title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Description</Label>
              <Textarea
                id="excerpt"
                value={formState.excerpt ?? ""}
                onChange={(event) => handleFieldChange("excerpt", event.target.value)}
                className="min-h-[120px]"
                placeholder="Short summary of the post"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formState.content ?? ""}
                onChange={(event) => handleFieldChange("content", event.target.value)}
                className="min-h-[320px]"
                placeholder="Write markdown or rich text here"
              />
            </div>

            {preview && (
              <div className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm">
                <p className="mb-2 text-sm font-semibold text-foreground">Preview</p>
                <div className="prose max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
              <CardDescription>Organize and label your post.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  type="text"
                  value={formState.category ?? ""}
                  onChange={(event) => handleFieldChange("category", event.target.value)}
                  placeholder="e.g. Design, Development"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  type="text"
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  placeholder="nextjs, tailwind, ux"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  type="text"
                  value={formState.author ?? ""}
                  onChange={(event) => handleFieldChange("author", event.target.value)}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="readTime">Read time (minutes)</Label>
                <Input
                  id="readTime"
                  type="number"
                  min={1}
                  value={formState.readTimeMinutes ?? 5}
                  onChange={(event) => handleFieldChange("readTimeMinutes", Number(event.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={formState.status}
                  onChange={(event) => handleFieldChange("status", event.target.value as PostStatus)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social badges</CardTitle>
              <CardDescription>Optional links for badges on posts.</CardDescription>
            </CardHeader>
            <CardContent>
              <SocialBadgeInput
                value={(formState.socialLinks as SocialLinks) ?? {}}
                onChange={(links) => handleFieldChange("socialLinks", links)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
