'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/utils';

interface CommentRow {
  _id: string;
  postId: string;
  userId: string;
  userDisplayName: string;
  userImageUrl?: string;
  content: string;
  parentId?: string | null;
  createdAt: string;
}

export function CommentsSection({ slug }: { slug: string }) {
  const { user, isSignedIn } = useUser();
  const [rows, setRows] = useState<CommentRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?postId=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (!cancelled) {
          setRows(Array.isArray(d) ? d : []);
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    fetch('/api/me')
      .then((r) => r.json())
      .then((d: { isAdmin?: boolean }) => {
        if (!cancelled) setIsAdmin(!!d.isAdmin);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  const { top, repliesByParent } = useMemo(() => {
    const top: CommentRow[] = [];
    const repliesByParent = new Map<string, CommentRow[]>();
    for (const c of rows) {
      if (c.parentId) {
        const arr = repliesByParent.get(c.parentId) ?? [];
        arr.push(c);
        repliesByParent.set(c.parentId, arr);
      } else {
        top.push(c);
      }
    }
    return { top, repliesByParent };
  }, [rows]);

  async function submit(content: string, parentId?: string) {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ postId: slug, content, parentId: parentId ?? null }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(json.message ?? 'Could not post comment');
      return false;
    }
    setRows((r) => [...r, json as CommentRow]);
    return true;
  }

  async function remove(id: string) {
    if (!confirm('Delete this comment?')) return;
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Could not delete');
      return;
    }
    setRows((r) => r.filter((c) => c._id !== id && c.parentId !== id));
  }

  const canModerate = (c: CommentRow) => isAdmin || c.userId === user?.id;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-5 font-mono text-xs uppercase tracking-wider text-faint">
        {rows.length} comment{rows.length === 1 ? '' : 's'}
      </h2>

      {isSignedIn ? (
        <CommentBox onSubmit={(c) => submit(c)} placeholder="Add a comment…" />
      ) : (
        <SignInButton mode="modal">
          <button className="rounded-lg border border-line-strong bg-card px-4 py-2 font-mono text-xs uppercase tracking-wider hover:border-primary">
            Sign in to comment
          </button>
        </SignInButton>
      )}

      <div className="mt-8 space-y-6">
        {loaded && top.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : null}

        {top.map((c) => (
          <Comment
            key={c._id}
            c={c}
            replies={repliesByParent.get(c._id) ?? []}
            canModerate={canModerate}
            canReply={!!isSignedIn}
            onDelete={remove}
            onReply={(content) => submit(content, c._id)}
          />
        ))}
      </div>
    </section>
  );
}

function Comment({
  c,
  replies,
  canModerate,
  canReply,
  onDelete,
  onReply,
}: {
  c: CommentRow;
  replies: CommentRow[];
  canModerate: (c: CommentRow) => boolean;
  canReply: boolean;
  onDelete: (id: string) => void;
  onReply: (content: string) => Promise<boolean>;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div>
      <CommentBody c={c} canModerate={canModerate(c)} onDelete={onDelete} />
      {canReply ? (
        <button
          type="button"
          onClick={() => setReplying((v) => !v)}
          className="ml-11 mt-1 font-mono text-[0.7rem] text-faint hover:text-foreground"
        >
          {replying ? 'Cancel' : 'Reply'}
        </button>
      ) : null}
      {replying ? (
        <div className="ml-11 mt-2">
          <CommentBox
            placeholder={`Reply to ${c.userDisplayName}…`}
            onSubmit={async (content) => {
              const ok = await onReply(content);
              if (ok) setReplying(false);
              return ok;
            }}
          />
        </div>
      ) : null}

      {replies.length > 0 ? (
        <div className="ml-11 mt-4 space-y-4 border-l border-border pl-4">
          {replies.map((r) => (
            <CommentBody key={r._id} c={r} canModerate={canModerate(r)} onDelete={onDelete} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CommentBody({
  c,
  canModerate,
  onDelete,
}: {
  c: CommentRow;
  canModerate: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {c.userImageUrl ? (
        <Image
          src={c.userImageUrl}
          alt=""
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-full border border-line-strong"
        />
      ) : (
        <span className="size-8 shrink-0 rounded-full border border-line-strong bg-accent" />
      )}
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2 text-sm">
          <span className="font-medium">{c.userDisplayName}</span>
          <span className="font-mono text-[0.7rem] text-faint">{formatDate(c.createdAt)}</span>
          {canModerate ? (
            <button
              type="button"
              onClick={() => onDelete(c._id)}
              className="font-mono text-[0.7rem] text-faint hover:text-destructive"
            >
              delete
            </button>
          ) : null}
        </p>
        <p className="mt-1 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-foreground">
          {c.content}
        </p>
      </div>
    </div>
  );
}

function CommentBox({
  onSubmit,
  placeholder,
}: {
  onSubmit: (content: string) => Promise<boolean>;
  placeholder: string;
}) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!value.trim() || busy) return;
        setBusy(true);
        const ok = await onSubmit(value.trim());
        setBusy(false);
        if (ok) setValue('');
      }}
      className="space-y-2"
    >
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        maxLength={2000}
        className="min-h-20"
      />
      <Button type="submit" size="sm" disabled={busy || !value.trim()}>
        {busy ? 'Posting…' : 'Post'}
      </Button>
    </form>
  );
}
