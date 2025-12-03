"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { BlogPost, PostStatus, SocialLinks } from '@/data/posts';
import SocialBadgeInput from './SocialBadgeInput';

const defaultPost: Partial<BlogPost> = {
  title: '',
  excerpt: '',
  content: '',
  category: 'General',
  tags: [],
  author: 'Content Team',
  readTimeMinutes: 5,
  socialLinks: {},
  status: 'draft',
};

type PostEditorProps = {
  mode: 'create' | 'edit';
  initialPost?: BlogPost;
};

export default function PostEditor({ mode, initialPost }: PostEditorProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<Partial<BlogPost>>(initialPost ?? defaultPost);
  const [tagsInput, setTagsInput] = useState((initialPost?.tags ?? []).join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  const parsedTags = useMemo(
    () =>
      tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsInput]
  );

  const previewHtml = useMemo(() => {
    return (formState.content ?? '').replace(/\n/g, '<br />');
  }, [formState.content]);

  const handleFieldChange = (key: keyof BlogPost, value: unknown) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (status: PostStatus) => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: formState.title ?? '',
        excerpt: formState.excerpt ?? '',
        content: formState.content ?? '',
        category: formState.category ?? 'General',
        tags: parsedTags,
        author: formState.author ?? 'Content Team',
        readTimeMinutes: formState.readTimeMinutes ?? 5,
        socialLinks: (formState.socialLinks as SocialLinks) ?? {},
        status,
      };

      const url = mode === 'edit' ? `/api/posts/${initialPost?.id}` : '/api/posts';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Unable to save post');
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{mode === 'edit' ? 'Update content and metadata' : 'Create a brand new post'}</p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {mode === 'edit' ? `Editing: ${initialPost?.title}` : 'New Post'}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            disabled={saving}
            onClick={() => void submit('draft')}
            className="rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void submit('published')}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={() => setPreview((prev) => !prev)}
            className="rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50"
          >
            {preview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <label className="grid gap-2 text-sm text-gray-800">
            Title
            <input
              type="text"
              value={formState.title ?? ''}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2"
              placeholder="Enter a compelling title"
            />
          </label>
          <label className="grid gap-2 text-sm text-gray-800">
            Description
            <textarea
              value={formState.excerpt ?? ''}
              onChange={(event) => handleFieldChange('excerpt', event.target.value)}
              className="min-h-[120px] rounded-lg border border-gray-200 px-3 py-2"
              placeholder="Short summary of the post"
            />
          </label>
          <label className="grid gap-2 text-sm text-gray-800">
            Content
            <textarea
              value={formState.content ?? ''}
              onChange={(event) => handleFieldChange('content', event.target.value)}
              className="min-h-[320px] rounded-lg border border-gray-200 px-3 py-2"
              placeholder="Write markdown or rich text here"
            />
          </label>
          {preview && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-semibold text-gray-900">Preview</p>
              <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Metadata</h3>
            <label className="grid gap-1 text-sm text-gray-800">
              Category
              <input
                type="text"
                value={formState.category ?? ''}
                onChange={(event) => handleFieldChange('category', event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2"
                placeholder="e.g. Design, Development"
              />
            </label>
            <label className="grid gap-1 text-sm text-gray-800">
              Tags (comma separated)
              <input
                type="text"
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2"
                placeholder="nextjs, tailwind, ux"
              />
            </label>
            <label className="grid gap-1 text-sm text-gray-800">
              Author
              <input
                type="text"
                value={formState.author ?? ''}
                onChange={(event) => handleFieldChange('author', event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2"
                placeholder="Author name"
              />
            </label>
            <label className="grid gap-1 text-sm text-gray-800">
              Read time (minutes)
              <input
                type="number"
                min={1}
                value={formState.readTimeMinutes ?? 5}
                onChange={(event) => handleFieldChange('readTimeMinutes', Number(event.target.value))}
                className="rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-gray-800">
              Status
              <select
                value={formState.status}
                onChange={(event) => handleFieldChange('status', event.target.value as PostStatus)}
                className="rounded-lg border border-gray-200 px-3 py-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <SocialBadgeInput
            value={(formState.socialLinks as SocialLinks) ?? {}}
            onChange={(links) => handleFieldChange('socialLinks', links)}
          />
        </div>
      </div>
    </div>
  );
}
