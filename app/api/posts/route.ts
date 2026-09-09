import { after } from 'next/server';

import { apiError, apiOk } from '@/lib/api';
import { isAdmin, requireAdminApi } from '@/lib/auth';
import { createPost, listPosts } from '@/lib/domains/posts/service';
import { listPostsQuerySchema, postInputSchema } from '@/lib/domains/posts/validators';
import { sendNewsletterToConfirmedSubscribers } from '@/lib/email/newsletter';
import { env } from '@/lib/env';
import { captureServerEvent } from '@/lib/posthog-server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = listPostsQuerySchema.parse(Object.fromEntries(searchParams));

    // Public callers only ever see published posts. `?status=draft|all` is
    // honored only for admins.
    let status: 'draft' | 'published' | 'all' = q.status ?? 'published';
    if (status !== 'published' && !(await isAdmin())) status = 'published';

    return apiOk(await listPosts({ status, tag: q.tag, page: q.page, limit: q.limit }));
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const input = postInputSchema.parse(await req.json());
    const post = await createPost(input);

    if (post.status === 'published') {
      captureServerEvent({
        distinctId: post.authorId || 'admin',
        event: 'server_post_published',
        properties: { post_slug: post.slug, post_title: post.title, tags: post.tags },
      });

      if (env.AUTO_SEND_POST_EMAILS) {
        after(async () => {
          try {
            const res = await sendNewsletterToConfirmedSubscribers(post);
            console.info('Auto-send newsletter:', res);
          } catch (e) {
            console.error('Auto-send newsletter failed:', e);
          }
        });
      }
    }

    return apiOk(post, 201);
  } catch (err) {
    return apiError(err);
  }
}
