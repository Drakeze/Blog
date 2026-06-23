"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { marked } from "marked"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, X, Loader2, Send, Save, FolderOpen, ImageIcon } from "lucide-react"
import { slugify } from "@/lib/utils"
import type { Post } from "@/models/post"

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]

function getCaretOffsetAtPoint(x: number, y: number): number | null {
  if ("caretPositionFromPoint" in document) {
    const pos = (document as Document & { caretPositionFromPoint(x: number, y: number): { offset: number } | null }).caretPositionFromPoint(x, y)
    return pos?.offset ?? null
  }
  if ("caretRangeFromPoint" in document) {
    const range = (document as Document & { caretRangeFromPoint(x: number, y: number): Range | null }).caretRangeFromPoint(x, y)
    return range?.startOffset ?? null
  }
  return null
}

type SerializedPost = Omit<Post, "_id"> & { _id: string }

interface PostEditorProps {
  post?: SerializedPost
  authorId: string
  authorName: string
  authorImageUrl?: string
}

export function PostEditor({ post, authorId, authorName, authorImageUrl }: PostEditorProps) {
  const router = useRouter()
  const isEditing = !!post

  const [title, setTitle] = useState(post?.title ?? "")
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "")
  const [content, setContent] = useState(post?.content ?? "")
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(post?.tags ?? [])
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingInline, setUploadingInline] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inlineFileInputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const lastCursorRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 })

  function saveCursor(e: React.SyntheticEvent<HTMLTextAreaElement>) {
    const t = e.currentTarget
    lastCursorRef.current = { start: t.selectionStart, end: t.selectionEnd }
  }

  function insertAtCursor(text: string) {
    const { start, end } = lastCursorRef.current
    setContent((prev) => prev.slice(0, start) + text + prev.slice(end))
    setTimeout(() => {
      const ta = contentRef.current
      if (!ta) return
      ta.focus()
      ta.selectionStart = start + text.length
      ta.selectionEnd = start + text.length
    }, 0)
  }

  async function uploadInlineFile(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("File type not allowed")
      return
    }
    setUploadingInline(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? "Upload failed"); return }
      insertAtCursor(`\n\n![image](${data.url})\n\n`)
      toast.success("Image inserted")
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploadingInline(false)
    }
  }

  async function handleInlineFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadInlineFile(file)
    if (inlineFileInputRef.current) inlineFileInputRef.current.value = ""
  }

  function handleDragOver(e: React.DragEvent<HTMLTextAreaElement>) {
    if (!e.dataTransfer.types.includes("Files")) return
    e.preventDefault()
    setIsDraggingOver(true)
    // Keep cursor tracking up to date while dragging
    const ta = e.currentTarget
    lastCursorRef.current = { start: ta.selectionStart, end: ta.selectionEnd }
  }

  function handleDragLeave() {
    setIsDraggingOver(false)
  }

  async function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
    setIsDraggingOver(false)
    const files = Array.from(e.dataTransfer.files).filter(f => ALLOWED_IMAGE_TYPES.includes(f.type))
    if (files.length === 0) return
    e.preventDefault()
    // Try to get the character offset at the drop coordinates
    const dropOffset = getCaretOffsetAtPoint(e.clientX, e.clientY) ?? lastCursorRef.current.start
    lastCursorRef.current = { start: dropOffset, end: dropOffset }
    await uploadInlineFile(files[0])
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? "Upload failed"); return }
      setCoverImage(data.url)
      toast.success("Image uploaded")
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const slug = slugify(title)

  const addTag = useCallback(() => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput("")
  }, [tagInput, tags])

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  async function handleSave(status: "draft" | "published") {
    if (!title.trim()) { toast.error("Title is required"); return }
    if (!excerpt.trim()) { toast.error("Excerpt is required"); return }
    if (!content.trim()) { toast.error("Content is required"); return }

    const setter = status === "published" ? setPublishing : setSaving
    setter(true)

    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImage.trim() || undefined,
      tags,
      status,
      authorId,
      authorName,
      authorImageUrl,
    }

    try {
      let res: Response
      if (isEditing) {
        res = await fetch(`/api/posts/${post.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? "Failed to save"); return }

      toast.success(status === "published" ? "Published!" : "Saved as draft")
      router.push("/admin/posts")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setter(false)
    }
  }

  const renderedHtml = preview
    ? (marked.parse(content) as string)
    : ""

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isEditing ? "Edit Post" : "New Post"}</h1>
          {title && <p className="text-xs text-muted-foreground mt-1">slug: /blog/{slug}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? <EyeOff className="h-4 w-4 mr-1.5" /> : <Eye className="h-4 w-4 mr-1.5" />}
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            disabled={saving || publishing}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave("published")}
            disabled={saving || publishing}
          >
            {publishing ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Send className="h-4 w-4 mr-1.5" />}
            {isEditing && post?.status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Metadata */}
      <div className="grid gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="text-base"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short description shown in post cards and emails"
            rows={2}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cover">Cover Image</Label>
          <div className="flex gap-2">
            <Input
              id="cover"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://... or use Browse to upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <FolderOpen className="h-4 w-4" />}
              <span className="ml-1.5">{uploading ? "Uploading…" : "Browse"}</span>
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={handleFileSelect}
          />
          {coverImage && (
            <div className="relative mt-2 h-32 w-full overflow-hidden rounded-md">
              <Image src={coverImage} alt="Cover preview" fill className="object-cover" unoptimized />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
              placeholder="Add a tag and press Enter"
            />
            <Button type="button" variant="outline" onClick={addTag} size="sm">
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-0.5 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Editor / Preview */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>{preview ? "Preview" : "Content (Markdown)"}</Label>
          {!preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => inlineFileInputRef.current?.click()}
              disabled={uploadingInline}
            >
              {uploadingInline
                ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                : <ImageIcon className="h-3.5 w-3.5 mr-1.5" />}
              {uploadingInline ? "Uploading…" : "Insert Image"}
            </Button>
          )}
        </div>
        <input
          ref={inlineFileInputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={handleInlineFileSelect}
        />
        {preview ? (
          <div className="min-h-125 rounded-md border border-border p-6 prose">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
            ) : (
              <p className="text-muted-foreground italic">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <Textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onSelect={saveCursor}
            onClick={saveCursor}
            onKeyUp={saveCursor}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            placeholder={`# Your post title\n\nStart writing in Markdown...`}
            rows={28}
            className={`font-mono text-sm resize-y transition-colors ${isDraggingOver ? "border-primary bg-primary/5" : ""}`}
          />
        )}
      </div>
    </div>
  )
}
