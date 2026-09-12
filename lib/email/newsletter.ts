import { render } from '@react-email/components';
import crypto from 'crypto';
import type { Db } from 'mongodb';

import { NewsletterEmail } from '@/emails/newsletter';
import { listSubscribers } from '@/lib/domains/subscribers/service';
import { env } from '@/lib/env';
import { blogCollectionNames, getDb } from '@/lib/mongo';
import type { EmailLog } from '@/models/email-log';
import type { Post } from '@/models/post';
import type { Subscriber } from '@/models/subscriber';

import { getResendClient } from './resend';
import { sendEmail } from './send';

const CHUNK = 100; // Resend batch limit

interface Rendered {
  to: string;
  html: string;
}

async function renderFor(post: Post, sub: Subscriber, db: Db): Promise<Rendered> {
  let token = sub.unsubscribeToken;
  if (!token) {
    token = crypto.randomUUID();
    await db
      .collection<Subscriber>(blogCollectionNames.subscribers)
      .updateOne({ _id: sub._id }, { $set: { unsubscribeToken: token } });
  }

  const html = await render(
    NewsletterEmail({
      postTitle: post.title,
      postExcerpt: post.excerpt,
      postUrl: `${env.SITE_URL}/${post.slug}`,
      unsubscribeUrl: `${env.SITE_URL}/api/subscribers/unsubscribe?token=${token}`,
      postImage: post.coverImage,
      authorName: post.authorName,
      authorImageUrl: post.authorImageUrl,
      siteUrl: env.SITE_URL,
    })
  );

  return { to: sub.email, html };
}

async function writeLogs(
  db: Db,
  recipients: string[],
  post: Post,
  status: 'sent' | 'failed',
  error?: string
): Promise<void> {
  if (recipients.length === 0) return;
  const now = new Date();
  await db.collection<EmailLog>(blogCollectionNames.emailLogs).insertMany(
    recipients.map((to) => ({
      to,
      template: 'newsletter',
      subject: post.title,
      status,
      error,
      meta: { postSlug: post.slug },
      createdAt: now,
    })) as EmailLog[]
  );
}

/**
 * Email a published post to every **confirmed** subscriber. Sets
 * `post.newsletterSentAt` on completion - the caller checks it first for the
 * double-send guard.
 *
 * `live` mode uses `resend.batch.send` (100/call). `log`/`off` fall back to a
 * per-recipient `sendEmail` loop so the `EmailLog` trail stays complete without
 * hitting Resend.
 *
 * ponytail: synchronous batched send is the ceiling - a real queue (Cloudflare
 * Queue / Vercel cron drain) is the upgrade path past a few thousand subscribers.
 */
export async function sendNewsletterToConfirmedSubscribers(
  post: Post
): Promise<{ sent: number; failed: number; total: number }> {
  const db = await getDb();
  const subscribers = await listSubscribers('confirmed');
  let sent = 0;
  let failed = 0;

  if (env.EMAIL_DELIVERY_MODE !== 'live') {
    for (const sub of subscribers) {
      const { to, html } = await renderFor(post, sub, db);
      try {
        await sendEmail({
          to,
          subject: post.title,
          html,
          template: 'newsletter',
          meta: { postSlug: post.slug },
        });
        sent += 1;
      } catch {
        failed += 1;
      }
    }
  } else {
    for (let i = 0; i < subscribers.length; i += CHUNK) {
      const batch = subscribers.slice(i, i + CHUNK);
      const rendered = await Promise.all(batch.map((s) => renderFor(post, s, db)));

      let ok = false;
      let errMsg: string | undefined;
      try {
        const { error } = await getResendClient().batch.send(
          rendered.map((r) => ({
            from: env.RESEND_FROM_EMAIL,
            ...(env.RESEND_REPLY_TO_EMAIL ? { replyTo: env.RESEND_REPLY_TO_EMAIL } : {}),
            to: r.to,
            subject: post.title,
            html: r.html,
          }))
        );
        ok = !error;
        errMsg = error?.message;
      } catch (err) {
        errMsg = err instanceof Error ? err.message : String(err);
      }

      sent += ok ? batch.length : 0;
      failed += ok ? 0 : batch.length;
      await writeLogs(
        db,
        rendered.map((r) => r.to),
        post,
        ok ? 'sent' : 'failed',
        errMsg
      );
      if (!ok) console.error('Newsletter batch failed:', errMsg);
    }
  }

  if (post._id) {
    await db
      .collection<Post>(blogCollectionNames.posts)
      .updateOne({ _id: post._id }, { $set: { newsletterSentAt: new Date() } });
  }

  return { sent, failed, total: subscribers.length };
}

/** Render the newsletter HTML for a post (admin preview + test send share this). */
export function renderNewsletterHtml(post: Post): Promise<string> {
  return render(
    NewsletterEmail({
      postTitle: post.title,
      postExcerpt: post.excerpt,
      postUrl: `${env.SITE_URL}/${post.slug}`,
      unsubscribeUrl: `${env.SITE_URL}/api/subscribers/unsubscribe?token=preview`,
      postImage: post.coverImage,
      authorName: post.authorName,
      authorImageUrl: post.authorImageUrl,
      siteUrl: env.SITE_URL,
    })
  );
}

/** Preview send - one copy of the newsletter to a single address, no `newsletterSentAt`. */
export async function sendNewsletterTest(post: Post, to: string): Promise<void> {
  const html = await renderNewsletterHtml(post);
  await sendEmail({
    to,
    subject: `[test] ${post.title}`,
    html,
    template: 'newsletter',
    meta: { postSlug: post.slug, test: true },
  });
}
