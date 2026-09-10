'use client';

import { Eye, Loader2, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Post } from '@/lib/domains/posts/types';
import { renderMarkdown } from '@/lib/markdown';
import { slugify } from '@/lib/utils';

export interface EditorAuthor {
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
}

type Props =
  | { mode: 'new'; author: EditorAuthor; post?: undefined }
  | { mode: 'edit'; post: Post; author?: undefined };

function parseTags(input: string): string[] {
  return [...new Set(input.split(',').map((t) => t.trim()).filter(Boolean))].slice(0, 20);
}

export function PostEditor(props: Props) {
  const router = useRouter();
  const editing = props.mode === 'edit' ? props.post : null;

  const [title, setTitle] = useState(editing?.title ?? '');
  const [slug, setSlug] = useState(editing?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(props.mode === 'edit');
  const [excerpt, setExcerpt] = useState(editing?.excerpt ?? '');
  const [tags, setTags] = useState((editing?.tags ?? []).join(', '));
  const [coverImage, setCoverImage] = useState(editing?.coverImage ?? '');
  const [content, setContent] = useState(editing?.content ?? '');
  const [status, setStatus] = useState<'draft' | 'published'>(editing?.status ?? 'draft');

  const [showPreview, setShowPreview] = useState(false);
  const [busy, setBusy] = useState<null | 'save' | 'publish' | 'delete' | 'upload'>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const effectiveSlug = slugTouched ? slug : slugify(title);
  const previewHtml = useMemo(() => renderMarkdown(content || '_Nothing to preview yet._'), [content]);

  async function upload(file: File) {
    setBusy('upload');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      setCoverImage(json.url);
      toast.success('Cover image uploaded');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(null);
    }
  }

  function validate(): string | null {
    if (!title.trim()) return 'Title is required';
    if (!excerpt.trim()) return 'Excerpt is required';
    if (!content.trim()) return 'Content is required';
    return null;
  }

  async function persist(nextStatus?: 'draft' | 'published') {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    const targetStatus = nextStatus ?? status;
    setBusy(nextStatus === 'published' || nextStatus === 'draft' ? 'publish' : 'save');

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: effectiveSlug || undefined,
      excerpt: excerpt.trim(),
      content,
      tags: parseTags(tags),
      coverImage: coverImage.trim() || undefined,
      status: targetStatus,
    };

    try {
      let res: Response;
      if (props.mode === 'new') {
        res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...payload, ...props.author }),
        });
      } else {
        res = await fetch(`/api/posts/${encodeURIComponent(props.post.slug)}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? json.error ?? 'Save failed');

      setStatus(targetStatus);
      toast.success(
        props.mode === 'new'
          ? 'Post created'
          : targetStatus !== status
            ? targetStatus === 'published'
              ? 'Published'
              : 'Moved to draft'
            : 'Saved'
      );

      const savedSlug: string = json.slug ?? effectiveSlug;
      if (props.mode === 'new' || savedSlug !== props.post.slug) {
        router.push(`/admin/posts/${savedSlug}`);
      } else {
        router.refresh();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (props.mode !== 'edit') return;
    if (!confirm(`Delete "${props.post.title}"? This also removes its comments and likes.`)) return;
    setBusy('delete');
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(props.post.slug)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message ?? 'Delete failed');
      }
      toast.success('Post deleted');
      router.push('/admin/posts');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display truncate text-2xl font-semibold">
            {props.mode === 'new' ? 'New post' : 'Edit post'}
          </h1>
          <p className="text-xs text-muted-foreground">
            /{effectiveSlug || '…'} · {status}
            {props.mode === 'edit' && props.post.newsletterSentAt ? ' · emailed' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {status === 'published' && effectiveSlug ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${effectiveSlug}`} target="_blank">
                View live
              </Link>
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview((v) => !v)}
            type="button"
          >
            {showPreview ? <Pencil className="size-4" /> : <Eye className="size-4" />}
            {showPreview ? 'Write' : 'Preview'}
          </Button>
          <Button variant="secondary" size="sm" disabled={!!busy} onClick={() => persist()}>
            {busy === 'save' ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
          {status === 'published' ? (
            <Button
              variant="outline"
              size="sm"
              disabled={!!busy}
              onClick={() => persist('draft')}
            >
              Unpublish
            </Button>
          ) : (
            <Button size="sm" disabled={!!busy} onClick={() => persist('published')}>
              {busy === 'publish' ? <Loader2 className="size-4 animate-spin" /> : null}
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
            />
          </div>

          {showPreview ? (
            <article
              className="prose min-h-[24rem] max-w-none rounded-md border border-border bg-card p-4"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write in Markdown…"
                className="min-h-[24rem] font-mono text-[13px] leading-relaxed"
              />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={effectiveSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="auto from title"
                />
                {props.mode === 'edit' ? (
                  <p className="text-[11px] text-muted-foreground">
                    Changing this 301-redirects the old URL.
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  maxLength={500}
                  className="min-h-20 text-[13px]"
                  placeholder="One or two sentences for the list + newsletter"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="comma, separated"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-4">
              <Label>Cover image</Label>
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="aspect-[3/2] w-full rounded-md border border-border object-cover"
                />
              ) : (
                <div className="grid aspect-[3/2] w-full place-items-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                  No cover
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void upload(f);
                  e.target.value = '';
                }}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy === 'upload'}
                  onClick={() => fileRef.current?.click()}
                >
                  {busy === 'upload' ? <Loader2 className="size-4 animate-spin" /> : null}
                  Upload
                </Button>
                {coverImage ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setCoverImage('')}>
                    Remove
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {props.mode === 'edit' ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={!!busy}
              onClick={remove}
            >
              {busy === 'delete' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete post
            </Button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
