import PostEditor from '@/components/admin/PostEditor';

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Content</p>
        <h1 className="text-2xl font-semibold text-gray-900">Create post</h1>
      </div>
      <PostEditor mode="create" />
    </div>
  );
}
