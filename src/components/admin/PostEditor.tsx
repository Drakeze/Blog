"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost, PostSource, PostStatus } from "@/data/posts"

const defaultPost: Partial<BlogPost> = {
  title: "",
  excerpt: "",
  content: "",
  category: "General",
  tags: [],
  readTimeMinutes: 5,
  source: "blog",
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

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: formState.title ?? "",
        excerpt: formState.excerpt ?? "",
        content: formState.content ?? "",
        category: formState.category ?? "General",
        tags: parsedTags,
        readTimeMinutes: formState.readTimeMinutes ?? 5,
        source: (formState.source as PostSource) ?? "blog",
        slug: formState.slug,
        sourceURL: formState.sourceURL,
        heroImage: formState.heroImage,
        createdAt: formState.createdAt,
        externalID: formState.externalID,
        status: (formState.status as PostStatus) ?? "draft",
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
    <div className="space-y-8">
      <Card className="shadow-sm">
        <CardHeader className="gap-4 rounded-2xl bg-card/50 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {mode === "edit" ? `Editing: ${initialPost?.title}` : "New Post"}
            </CardTitle>
            <CardDescription>
              {mode === "edit" ? "Update content and metadata" : "Create a brand new post"}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Button variant="outline" type="button" disabled={saving} onClick={() => void submit()} className="rounded-full px-4">
              Save Post
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPreview((prev) => !prev)}
              className="rounded-full text-foreground"
            >
              {preview ? "Hide preview" : "Preview"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardContent className="space-y-6 md:p-8">
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
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Metadata</CardTitle>
              <CardDescription>Organize and label your post.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  type="text"
                  value={formState.slug ?? ""}
                  onChange={(event) => handleFieldChange("slug", event.target.value)}
                  placeholder="Auto-generated from title when empty"
                />
              </div>
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
                <Label htmlFor="source">Source</Label>
                <select
                  id="source"
                  value={formState.source}
                  onChange={(event) => handleFieldChange("source", event.target.value as PostSource)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                >
                  <option value="blog">Blog</option>
                  <option value="reddit">Reddit</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="patreon">Patreon</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formState.status ?? "draft"}
                  onChange={(event) => handleFieldChange("status", event.target.value as PostStatus)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 capitalize"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sourceUrl">Source URL</Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  value={formState.sourceURL ?? ""}
                  onChange={(event) => handleFieldChange("sourceURL", event.target.value)}
                  placeholder="https://example.com/original-post"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="heroImage">Hero image URL</Label>
                <Input
                  id="heroImage"
                  type="url"
                  value={formState.heroImage ?? ""}
                  onChange={(event) => handleFieldChange("heroImage", event.target.value)}
                  placeholder="/hero.jpg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="externalId">External ID</Label>
                <Input
                  id="externalId"
                  type="text"
                  value={formState.externalID ?? ""}
                  onChange={(event) => handleFieldChange("externalID", event.target.value)}
                  placeholder="Reference ID for third-party links"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
