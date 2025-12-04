"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost, PostSource, PostStatus } from "@/data/posts"

const defaultPost: Partial<BlogPost> = {
  title: "",
  excerpt: "",
  content: "",
  tags: [],
  author: "Content Team",
  readTimeMinutes: 5,
  status: "draft",
  source: "blog",
}

const SOURCE_OPTIONS: { value: PostSource; label: string }[] = [
  { value: "blog", label: "Blog" },
  { value: "reddit", label: "Reddit" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "patreon", label: "Patreon" },
]

type PostEditorProps = {
  mode: "create" | "edit"
  initialPost?: BlogPost
}

function isValidUrl(value?: string) {
  if (!value) return true
  try {
    // eslint-disable-next-line no-new
    new URL(value)
    return true
  } catch (error) {
    return false
  }
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

  const validateForm = () => {
    if (!formState.title?.trim()) return "Title is required"
    if (!formState.excerpt?.trim()) return "Excerpt is required"
    if (!formState.content?.trim()) return "Content is required"
    if (!formState.source || !SOURCE_OPTIONS.some((option) => option.value === formState.source)) {
      return "Source is required"
    }
    if (formState.readTimeMinutes && formState.readTimeMinutes < 1) {
      return "Read time must be greater than 0"
    }
    if (formState.heroImage && !isValidUrl(formState.heroImage)) {
      return "Hero image must be a valid URL"
    }
    if (formState.sourceUrl && !isValidUrl(formState.sourceUrl)) {
      return "Source URL must be a valid URL"
    }
    return null
  }

  const submit = async (status: PostStatus) => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: formState.title ?? "",
        slug: formState.slug ?? undefined,
        excerpt: formState.excerpt ?? "",
        content: formState.content ?? "",
        tags: parsedTags,
        author: formState.author ?? "Content Team",
        readTimeMinutes: formState.readTimeMinutes ?? 5,
        status,
        source: formState.source ?? "blog",
        sourceUrl: formState.sourceUrl ?? undefined,
        heroImage: formState.heroImage ?? undefined,
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

  const heroPreview = formState.heroImage && isValidUrl(formState.heroImage) ? formState.heroImage : null

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
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                type="text"
                value={formState.slug ?? ""}
                onChange={(event) => handleFieldChange("slug", event.target.value)}
                placeholder="Auto-generated if left empty"
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
                <Label htmlFor="source">Source</Label>
                <Select
                  id="source"
                  value={formState.source ?? "blog"}
                  onChange={(event) => handleFieldChange("source", event.target.value as PostSource)}
                  className="w-full"
                >
                  {SOURCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sourceUrl">Source URL</Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  value={formState.sourceUrl ?? ""}
                  onChange={(event) => handleFieldChange("sourceUrl", event.target.value)}
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
                  placeholder="https://images.example.com/cover.jpg"
                />
                {heroPreview && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-2">
                    <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-muted">
                      <img src={heroPreview} alt="Hero preview" className="h-full w-full object-cover" />
                    </div>
                    <p className="text-xs text-muted-foreground">Preview</p>
                  </div>
                )}
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
                  value={formState.status ?? "draft"}
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
              <CardTitle className="text-base">Quick tips</CardTitle>
              <CardDescription>Make sure metadata is complete before publishing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Provide an external URL for syndicated sources.</p>
              <p>• Keep slugs short and unique.</p>
              <p>• Use high-quality hero images for better previews.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
