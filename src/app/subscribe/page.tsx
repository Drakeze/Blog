import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Linkedin, Twitter } from "lucide-react"

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

        <div className="mb-12 p-8 bg-muted/50 rounded-2xl border border-border">
          <h2 className="text-2xl font-serif font-bold mb-4">About</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            I'm Zen — documenting my journey building Soren Tech, Earth Plus, and mastering full-stack engineering. This
            blog collects my posts from Twitter, Reddit, LinkedIn, Patreon, and my personal writing into one place. If
            you want more behind-the-scenes updates or want to support the work, Patreon is where everything connects.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Name (optional)
              </Label>
              <Input id="name" type="text" placeholder="Your name" className="h-12 text-base" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email *
              </Label>
              <Input id="email" type="email" placeholder="your@email.com" required className="h-12 text-base" />
            </div>

            <Button type="submit" size="lg" className="w-full h-12 text-base">
              Subscribe
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              I respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">You'll receive updates from:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 bg-muted rounded-full text-sm">Personal Blog</div>
            <div className="px-4 py-2 bg-[#FF4500]/10 text-[#FF4500] rounded-full text-sm">Reddit</div>
            <div className="px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full text-sm">Twitter/X</div>
            <div className="px-4 py-2 bg-[#0A66C2]/10 text-[#0A66C2] rounded-full text-sm">LinkedIn</div>
            <div className="px-4 py-2 bg-[#FF424D]/10 text-[#FF424D] rounded-full text-sm">Patreon</div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">Connect with me:</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter/X</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent" asChild>
              <a href="https://reddit.com" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
                <span className="sr-only">Reddit</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent" asChild>
              <a href="https://patreon.com" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003" />
                </svg>
                <span className="sr-only">Patreon</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-transparent" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center p-6 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-sm text-muted-foreground">
            Want more?{" "}
            <a href="https://patreon.com" className="text-primary hover:underline font-medium">
              Join the Patreon community
            </a>{" "}
            for deeper insights and exclusive updates.
          </p>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
