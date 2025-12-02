export default function AdminLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
    </div>
  );
}
