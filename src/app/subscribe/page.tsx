import { BlogFooter } from "@/components/blog-footer"
import { BlogHeader } from "@/components/blog-header"
export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="container mx-auto px-4 py-24 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">Subscribe for updates</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Get notified when I publish new content across my platforms
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-base">
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="h-12 w-full rounded-lg border border-border bg-background px-4 text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-base">
                Email *
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                className="h-12 w-full rounded-lg border border-border bg-background px-4 text-base"
              />
            </div>

            <button type="submit" className="h-12 w-full rounded-lg bg-foreground text-base font-semibold text-background">
              Subscribe
            </button>

            <p className="text-sm text-muted-foreground text-center">
              I respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">You&apos;ll receive updates from:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 bg-muted rounded-full text-sm">Personal Blog</div>
            <div className="px-4 py-2 bg-[#FF4500]/10 text-[#FF4500] rounded-full text-sm">Reddit</div>
            <div className="px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full text-sm">Twitter/X</div>
            <div className="px-4 py-2 bg-[#0A66C2]/10 text-[#0A66C2] rounded-full text-sm">LinkedIn</div>
            <div className="px-4 py-2 bg-[#FF424D]/10 text-[#FF424D] rounded-full text-sm">Patreon</div>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
