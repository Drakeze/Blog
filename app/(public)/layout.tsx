/**
 * Minimal wrapper for the functional public pages built in Phase 3a
 * (`/confirm`, `/unsubscribe`). The real nav, footer, and reading chrome are
 * the Phase 5 design build — deliberately bare here.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-12">
      <main className="flex-1">{children}</main>
      <footer className="mt-16 pt-6 text-sm opacity-60">
        <a href="https://drakeze.com" className="hover:underline">
          drakeze.com
        </a>
      </footer>
    </div>
  );
}
