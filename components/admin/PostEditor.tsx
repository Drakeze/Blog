"use client"

import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  Minus,
  Quote,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BlogPost, PostSource, PostStatus } from "@/data/posts"
import { renderPostContent } from "@/lib/render-post-content"

// ── Markdown helpers ─────────────────────────────────────────────────────────

type InsertResult = { value: string; selStart: number; selEnd: number }

function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
  placeholder = "text",
): InsertResult {
  const sel = value.slice(start, end) || placeholder
  const next = value.slice(0, start) + before + sel + after + value.slice(end)
  return { value: next, selStart: start + before.length, selEnd: start + before.length + sel.length }
}

function prefixLine(
  value: string,
  start: number,
  prefix: string,
): InsertResult {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1
  // Strip any existing heading prefix on the line
  const rest = value.slice(lineStart).replace(/^#{1,6} /, "")
  const next = value.slice(0, lineStart) + prefix + rest
  const offset = lineStart + prefix.length
  return { value: next, selStart: offset, selEnd: offset }
}

function insertTemplate(
  value: string,
  start: number,
  end: number,
  template: string,
  cursorAt: number,
): InsertResult {
  const next = value.slice(0, start) + template + value.slice(end)
  const pos = start + cursorAt
  return { value: next, selStart: pos, selEnd: pos }
}

// ── Types ────────────────────────────────────────────────────────────────────

const defaultPost: Partial<BlogPost> = {
  title: "",
  excerpt: "",
  content: "",
  category: "General",
  tags: [],
  readTimeMinutes: 5,
  source: "blog",
  status: "draft",
  featured: false,
  heroImage: "",
}

type PostEditorProps = {
  mode: "create" | "edit"
  initialPost?: BlogPost
  emailDeliveryAvailable?: boolean
  missingEmailKeys?: string[]
}

// ── Component ────────────────────────────────────────────────────────────────

export default function PostEditor({
  mode,
  initialPost,
  emailDeliveryAvailable = false,
  missingEmailKeys = [],
}: PostEditorProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [formState, setFormState] = useState<Partial<BlogPost>>(initialPost ?? defaultPost)
  const [tagsInput, setTagsInput] = useState((initialPost?.tags ?? []).join(", "))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notifySubscribers, setNotifySubscribers] = useState(mode === "create")

  const parsedTags = useMemo(
    () => tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    [tagsInput],
  )

  const previewHtml = useMemo(
    () => renderPostContent(formState.content ?? ""),
    [formState.content],
  )

  function field<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  // ── Toolbar action ──────────────────────────────────────────────────────

  function applyFormat(fn: (value: string, start: number, end: number) => InsertResult) {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e, value } = ta
    const result = fn(value, s, e)
    field("content", result.value)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(result.selStart, result.selEnd)
    })
  }

  const toolbar = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      title: "Heading 1  (#)",
      action: () => applyFormat((v, s) => prefixLine(v, s, "# ")),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      title: "Heading 2  (##)",
      action: () => applyFormat((v, s) => prefixLine(v, s, "## ")),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      title: "Heading 3  (###)",
      action: () => applyFormat((v, s) => prefixLine(v, s, "### ")),
    },
    null, // divider
    {
      icon: <Bold className="h-4 w-4" />,
      title: "Bold  (Cmd+B)",
      action: () => applyFormat((v, s, e) => wrapSelection(v, s, e, "**", "**", "bold text")),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      title: "Italic  (Cmd+I)",
      action: () => applyFormat((v, s, e) => wrapSelection(v, s, e, "_", "_", "italic text")),
    },
    null,
    {
      icon: <Link className="h-4 w-4" />,
      title: "Link",
      action: () => applyFormat((v, s, e) => {
        const sel = v.slice(s, e) || "link text"
        const template = `[${sel}](url)`
        return insertTemplate(v, s, e, template, 1 + sel.length + 2)
      }),
    },
    {
      icon: <Image className="h-4 w-4" />,
      title: "Image",
      action: () => applyFormat((v, s, e) =>
        insertTemplate(v, s, e, "![alt text](image-url)", 2),
      ),
    },
    null,
    {
      icon: <Quote className="h-4 w-4" />,
      title: "Blockquote",
      action: () => applyFormat((v, s) => prefixLine(v, s, "> ")),
    },
    {
      icon: <List className="h-4 w-4" />,
      title: "Bullet list",
      action: () => applyFormat((v, s) => prefixLine(v, s, "- ")),
    },
    {
      icon: <Code className="h-4 w-4" />,
      title: "Inline code",
      action: () => applyFormat((v, s, e) => wrapSelection(v, s, e, "`", "`", "code")),
    },
    {
      icon: <Minus className="h-4 w-4" />,
      title: "Divider (---)",
      action: () => applyFormat((v, s, e) =>
        insertTemplate(v, s, e, "\n---\n", 5),
      ),
    },
  ]

  // ── Keyboard shortcuts ──────────────────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget
    const meta = e.metaKey || e.ctrlKey

    if (e.key === "Tab") {
      e.preventDefault()
      applyFormat((v, s, e2) => insertTemplate(v, s, e2, "  ", 2))
      return
    }
    if (meta && e.key === "b") {
      e.preventDefault()
      applyFormat((v, s, e2) => wrapSelection(v, s, e2, "**", "**", "bold text"))
    }
    if (meta && e.key === "i") {
      e.preventDefault()
      applyFormat((v, s, e2) => wrapSelection(v, s, e2, "_", "_", "italic text"))
    }
    if (meta && e.key === "k") {
      e.preventDefault()
      applyFormat((_v, s, e2) => {
        const sel = ta.value.slice(s, e2) || "link text"
        return insertTemplate(ta.value, s, e2, `[${sel}](url)`, 1 + sel.length + 2)
      })
    }
  }

  // ── Save ────────────────────────────────────────────────────────────────

  async function submit() {
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
        externalUrl: formState.externalUrl || undefined,
        heroImage: formState.heroImage || undefined,
        createdAt: formState.createdAt,
        externalId: formState.externalId,
        status: (formState.status as PostStatus) ?? "draft",
        featured: formState.featured ?? false,
        notifySubscribers,
      }

      const url = mode === "edit" ? `/api/posts/${initialPost?.id}` : "/api/posts"
      const method = mode === "edit" ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Unable to save post")

      if (mode === "create" && data.newsletterDelivery?.message) {
        const delivery = data.newsletterDelivery
        if (notifySubscribers || delivery.status !== "skipped") {
          window.alert(`Post saved. ${delivery.message}`)
        }
      }

      router.push("/admin/posts")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post")
    } finally {
      setSaving(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Status toggle */}
          <div className="flex overflow-hidden rounded-full border border-border text-sm font-medium">
            {(["draft", "published"] as PostStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => field("status", s)}
                className={`px-4 py-1.5 capitalize transition-colors ${
                  formState.status === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Featured toggle */}
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formState.featured ?? false}
              onChange={(e) => field("featured", e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-muted-foreground">Featured</span>
          </label>
        </div>

        <Button onClick={() => void submit()} disabled={saving} className="rounded-full px-6">
          {saving ? "Saving…" : mode === "edit" ? "Update post" : "Save post"}
        </Button>
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}

      {/* Two-column: Editor | Preview */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* ── Editor column ── */}
        <div className="space-y-4">

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formState.title ?? ""}
              onChange={(e) => field("title", e.target.value)}
              placeholder="Post title"
              className="h-11 text-base font-semibold"
            />
          </div>

          {/* Hero image */}
          <div className="space-y-1.5">
            <Label htmlFor="heroImage">Hero image URL</Label>
            <Input
              id="heroImage"
              type="url"
              value={formState.heroImage ?? ""}
              onChange={(e) => field("heroImage", e.target.value)}
              placeholder="https://example.com/image.png"
            />
            {formState.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={formState.heroImage}
                alt="Hero preview"
                className="mt-2 h-32 w-full rounded-lg object-cover"
                onError={(e) => { e.currentTarget.style.display = "none" }}
              />
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <Label htmlFor="excerpt">Excerpt</Label>
            <textarea
              id="excerpt"
              value={formState.excerpt ?? ""}
              onChange={(e) => field("excerpt", e.target.value)}
              rows={2}
              placeholder="Short description shown in post cards"
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Markdown toolbar */}
          <div className="space-y-1.5">
            <Label>Content</Label>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5">
                {toolbar.map((item, i) =>
                  item === null ? (
                    <div key={`sep-${i}`} className="mx-1 h-5 w-px bg-border" />
                  ) : (
                    <button
                      key={item.title}
                      type="button"
                      title={item.title}
                      onClick={item.action}
                      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {item.icon}
                    </button>
                  ),
                )}
                <span className="ml-auto text-[11px] text-muted-foreground/60">
                  Cmd+B · Cmd+I · Cmd+K · Tab=indent
                </span>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                id="content"
                value={formState.content ?? ""}
                onChange={(e) => field("content", e.target.value)}
                onKeyDown={handleKeyDown}
                rows={28}
                placeholder={"# My post title\n\nStart writing in markdown...\n\nUse ## for headings, **bold**, _italic_, [links](url), and ![images](url)."}
                spellCheck
                className="w-full resize-y bg-background px-4 py-3 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
              />
            </div>
            <p className="text-xs text-muted-foreground">Markdown supported · # H1 · ## H2 · **bold** · _italic_ · `code`</p>
          </div>

          {/* Metadata row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formState.category ?? ""}
                onChange={(e) => field("category", e.target.value)}
                placeholder="e.g. Development"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="nextjs, tailwind"
              />
            </div>
          </div>

          {/* Email notification */}
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={notifySubscribers}
                disabled={!emailDeliveryAvailable}
                onChange={(e) => setNotifySubscribers(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded"
              />
              <div>
                <span className="font-medium">Email subscribers on publish</span>
                <p className="mt-0.5 text-muted-foreground">
                  {emailDeliveryAvailable
                    ? "Subscribers will be notified when the post is published."
                    : `Resend not configured. Missing: ${missingEmailKeys.join(", ") || "email keys"}.`}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* ── Preview column ── */}
        <div className="space-y-1.5">
          <Label>Live preview</Label>
          <div className="min-h-150 rounded-xl border border-border bg-card p-6 shadow-sm">
            {formState.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={formState.heroImage}
                alt={formState.title ?? ""}
                className="mb-6 h-48 w-full rounded-lg object-cover"
                onError={(e) => { e.currentTarget.style.display = "none" }}
              />
            )}
            <h1 className="mb-2 font-sans text-2xl font-bold leading-tight">
              {formState.title || <span className="text-muted-foreground/50">Post title…</span>}
            </h1>
            {formState.excerpt && (
              <p className="mb-6 text-sm text-muted-foreground">{formState.excerpt}</p>
            )}
            {parsedTags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {parsedTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div
              className="prose prose-sm max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:tracking-tight
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground"
              dangerouslySetInnerHTML={{ __html: previewHtml || "<p class='text-muted-foreground/50 text-sm'>Start writing to see a preview…</p>" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
