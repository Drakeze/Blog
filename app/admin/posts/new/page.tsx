import { currentUser } from '@clerk/nextjs/server';

import { PostEditor } from '@/components/admin/post-editor';

export default async function NewPostPage() {
  const user = await currentUser();

  return (
    <PostEditor
      mode="new"
      author={{
        authorId: user?.id ?? 'admin',
        authorName: user?.fullName || user?.username || 'Anthony Shead',
        authorImageUrl: user?.imageUrl,
      }}
    />
  );
}
