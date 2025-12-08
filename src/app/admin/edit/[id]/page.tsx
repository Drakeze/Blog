import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminEditPage({ params }: { params: { id: string } }) {
  // Mock data - in real app, fetch post by ID
  const post = {
    id: params.id,
    title: "The Future of Web Development: Trends to Watch in 2025",
    slug: "future-of-web-development",
    excerpt: "Exploring the latest innovations in web technology and what they mean for developers.",
    content: "<p>The web development landscape continues to evolve at a rapid pace...</p>",
    source: "blog",
    sourceUrl: "",
    tags: "web development, trends, technology",
    image: "/placeholder.svg?height=400&width=600",
    status: "published",
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Link>
          </Button>
          <h1 className="text-4xl font-serif font-bold">Edit Post</h1>
        </div>

        <form className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter post title"
              className="h-12 text-lg"
              defaultValue={post.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-base">
              Slug *
            </Label>
            <Input
              id="slug"
              type="text"
              placeholder="url-friendly-slug"
              className="h-12 font-mono text-sm"
              defaultValue={post.slug}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-base">
              Excerpt *
            </Label>
            <Textarea
              id="excerpt"
              placeholder="Brief description of the post"
              className="min-h-[100px] text-base"
              defaultValue={post.excerpt}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-base">
              Content *
            </Label>
            <Textarea
              id="content"
              placeholder="Write your post content (HTML supported)"
              className="min-h-[400px] font-mono text-sm"
              defaultValue={post.content}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-base">
                Source *
              </Label>
              <Select defaultValue={post.source} required>
                <SelectTrigger id="source" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="patreon">Patreon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceUrl" className="text-base">
                Source URL (optional)
              </Label>
              <Input
                id="sourceUrl"
                type="url"
                placeholder="https://..."
                className="h-12"
                defaultValue={post.sourceUrl}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-base">
              Tags *
            </Label>
            <Input
              id="tags"
              type="text"
              placeholder="web development, technology, design (comma separated)"
              className="h-12"
              defaultValue={post.tags}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-base">
              Hero Image URL *
            </Label>
            <Input
              id="image"
              type="url"
              placeholder="https://..."
              className="h-12"
              defaultValue={post.image}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-base">
              Status *
            </Label>
            <Select defaultValue={post.status} required>
              <SelectTrigger id="status" className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button type="submit" size="lg" className="flex-1">
              Update Post
            </Button>
            <Button type="button" variant="outline" size="lg" className="flex-1 bg-transparent">
              Save Draft
            </Button>
          </div>
        </form>
      </main>

      <BlogFooter />
    </div>
  )
}
