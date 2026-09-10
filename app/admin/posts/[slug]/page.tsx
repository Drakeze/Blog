import { notFound } from 'next/navigation';

import { PostEditor } from '@/components/admin/post-editor';
import { getPostBySlug } from '@/lib/domains/posts/service';

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return <PostEditor mode="edit" post={JSON.parse(JSON.stringify(post))} />;
}
