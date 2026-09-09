import { apiError, apiOk } from '@/lib/api';
import { add, remove } from '@/lib/domains/likes/service';
import { likeInputSchema } from '@/lib/domains/likes/validators';
import { captureServerEvent } from '@/lib/posthog-server';

export async function POST(req: Request) {
  try {
    const { postSlug, fingerprint } = likeInputSchema.parse(await req.json());
    await add({ postSlug, fingerprint });
    captureServerEvent({
      distinctId: fingerprint,
      event: 'server_post_liked',
      properties: { post_slug: postSlug },
    });
    return apiOk({ liked: true });
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { postSlug, fingerprint } = likeInputSchema.parse(Object.fromEntries(searchParams));
    await remove({ postSlug, fingerprint });
    return apiOk({ liked: false });
  } catch (err) {
    return apiError(err);
  }
}
