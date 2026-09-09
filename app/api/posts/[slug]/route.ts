import { apiError, apiOk } from '@/lib/api';
import { isAdmin, requireAdminApi } from '@/lib/auth';
import { deletePost, getPostBySlug, updatePost } from '@/lib/domains/posts/service';
import { postUpdateSchema } from '@/lib/domains/posts/validators';
import { Errors } from '@/lib/errors';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) throw Errors.notFound('Post not found');
    if (post.status === 'draft' && !(await isAdmin())) throw Errors.notFound('Post not found');
    return apiOk(post);
  } catch (err) {
    return apiError(err);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { slug } = await params;
    const input = postUpdateSchema.parse(await req.json());
    const post = await updatePost(slug, input);
    if (!post) throw Errors.notFound('Post not found');
    return apiOk(post);
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { slug } = await params;
    const ok = await deletePost(slug);
    if (!ok) throw Errors.notFound('Post not found');
    return apiOk({ success: true });
  } catch (err) {
    return apiError(err);
  }
}
