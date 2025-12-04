import { notFound } from 'next/navigation';

import PostEditor from '@/components/admin/PostEditor';
import { getPostById } from '@/data/posts';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id);
  const post = Number.isFinite(postId) ? getPostById(postId) : null;

  if (!post) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Content</p>
        <h1 className="text-2xl font-semibold text-gray-900">Edit post</h1>
      </div>
      <PostEditor mode="edit" initialPost={post} />
    </div>
  );
}
