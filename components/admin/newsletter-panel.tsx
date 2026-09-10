'use client';

import { Loader2, Send, TestTube2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';

export interface NewsletterPost {
  slug: string;
  title: string;
  excerpt: string;
  sentAt: string | null;
}

type SendResult = { sent: number; failed: number; total: number };

export function NewsletterPanel({
  posts,
  confirmedCount,
}: {
  posts: NewsletterPost[];
  confirmedCount: number;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(posts[0]?.slug ?? null);
  const [busy, setBusy] = useState<null | 'test' | 'send'>(null);
  const [result, setResult] = useState<SendResult | null>(null);

  const post = posts.find((p) => p.slug === selected) ?? null;

  async function callSend(body: Record<string, unknown>) {
    const res = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { res, json: await res.json().catch(() => ({})) };
  }

  async function sendTest() {
    if (!post) return;
    setBusy('test');
    try {
      const { res, json } = await callSend({ slug: post.slug, test: true });
      if (!res.ok) throw new Error(json.message ?? 'Test send failed');
      toast.success(`Test sent to ${json.to ?? 'you'}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Test send failed');
    } finally {
      setBusy(null);
    }
  }

  async function sendReal() {
    if (!post) return;
    if (!confirm(`Send "${post.title}" to ${confirmedCount} confirmed subscriber(s)?`)) return;
    setBusy('send');
    setResult(null);
    try {
      let { res, json } = await callSend({ slug: post.slug });
      if (res.status === 409) {
        if (!confirm('This post was already emailed. Send it again to the full list?')) {
          setBusy(null);
          return;
        }
        ({ res, json } = await callSend({ slug: post.slug, force: true }));
      }
      if (!res.ok) throw new Error(json.message ?? 'Send failed');
      setResult(json as SendResult);
      toast.success(`Sent to ${json.sent}/${json.total}${json.failed ? ` (${json.failed} failed)` : ''}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Send failed');
    } finally {
      setBusy(null);
    }
  }

  if (posts.length === 0) {
    return (
      <Card className="p-10 text-center text-sm text-muted-foreground">
        Publish a post first — the newsletter sends a published post to your list.
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-2">
        {posts.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => {
              setSelected(p.slug);
              setResult(null);
            }}
            className={cn(
              'w-full rounded-md border p-3 text-left transition-colors',
              selected === p.slug
                ? 'border-primary bg-accent/50'
                : 'border-border hover:bg-muted/50'
            )}
          >
            <span className="line-clamp-1 text-sm font-medium">{p.title}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {p.sentAt ? (
                <Badge variant="secondary">emailed {formatDate(p.sentAt)}</Badge>
              ) : (
                'not sent'
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {post ? (
          <>
            <Card>
              <CardContent className="flex flex-wrap items-center gap-2 p-4">
                <Button variant="outline" size="sm" disabled={!!busy} onClick={sendTest}>
                  {busy === 'test' ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <TestTube2 className="size-4" />
                  )}
                  Send test to me
                </Button>
                <Button size="sm" disabled={!!busy} onClick={sendReal}>
                  {busy === 'send' ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Send to {confirmedCount} confirmed
                </Button>
                {result ? (
                  <span className="text-xs text-muted-foreground">
                    {result.sent} sent · {result.failed} failed · {result.total} total
                  </span>
                ) : null}
              </CardContent>
            </Card>

            <div className="overflow-hidden rounded-md border border-border bg-white">
              <iframe
                key={post.slug}
                title="Newsletter preview"
                src={`/api/newsletter/preview?slug=${encodeURIComponent(post.slug)}`}
                className="h-[38rem] w-full"
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
