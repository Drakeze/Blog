import { notFound } from 'next/navigation';

import PostEditor from '@/components/admin/PostEditor';
import { getPostById } from '@/data/posts';

type EditPageParams = { id: string };

type EditPageProps = { params: Promise<EditPageParams> };

export default async function EditPostPage({ params }: EditPageProps) {
  const { id } = await params;
  const postId = Number(id);
  const post = Number.isFinite(postId) ? getPostById(postId) : undefined;

  if (!post) {
    return notFound();
  }

  return <PostEditor mode="edit" initialPost={post} />;
}
