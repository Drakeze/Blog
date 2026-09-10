import { requireAdminApi } from '@/lib/auth';
import { getPostBySlug } from '@/lib/domains/posts/service';
import { renderNewsletterHtml } from '@/lib/email/newsletter';

/** Admin-only: the rendered newsletter HTML for a post, for the send screen's preview pane. */
export async function GET(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const slug = new URL(req.url).searchParams.get('slug')?.trim();
  if (!slug) return new Response('Missing slug', { status: 400 });

  const post = await getPostBySlug(slug);
  if (!post || post.status !== 'published') return new Response('Published post not found', { status: 404 });

  return new Response(await renderNewsletterHtml(post), {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
