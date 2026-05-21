import { auth } from "@clerk/nextjs/server"
import { SignInButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { getDb } from "@/lib/mongo"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { Bookmark } from "@/models/bookmark"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Bookmarks" }

export default async function BookmarksPage() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        <p className="text-muted-foreground">Sign in to save and view your bookmarked posts.</p>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </div>
    )
  }

  const db = await getDb()
  const bookmarks = await db
    .collection<Bookmark>("bookmarks")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {bookmarks.length === 0
            ? "No bookmarks yet"
            : `${bookmarks.length} saved post${bookmarks.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-muted-foreground">
            Hit the bookmark icon on any post to save it here.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Browse posts</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {bookmarks.map((b) => (
            <Link
              key={b.postSlug}
              href={`/blog/${b.postSlug}`}
              className="group flex gap-4 py-5 hover:opacity-80 transition-opacity"
            >
              {b.postCoverImage && (
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={b.postCoverImage}
                    alt={b.postTitle}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center gap-1 min-w-0">
                <h2 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {b.postTitle}
                </h2>
                {b.postExcerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{b.postExcerpt}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  Saved {formatDate(b.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
