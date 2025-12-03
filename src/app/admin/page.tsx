import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-8">Create New Post</h1>

        <form className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              Title
            </Label>
            <Input id="title" type="text" placeholder="Enter post title" className="h-12 text-lg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-base">
              Excerpt
            </Label>
            <Textarea id="excerpt" placeholder="Brief description of the post" className="min-h-[80px] text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-base">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Write your post content (HTML supported)"
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-base">
                Source
              </Label>
              <Select>
                <SelectTrigger id="source" className="h-12">
                  <SelectValue placeholder="Select source" />
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
              <Input id="sourceUrl" type="url" placeholder="https://..." className="h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-base">
              Tags
            </Label>
            <Input
              id="tags"
              type="text"
              placeholder="web development, technology, design (comma separated)"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-base">
              Hero Image URL
            </Label>
            <Input id="image" type="url" placeholder="https://..." className="h-12" />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" size="lg" className="flex-1">
              Publish Post
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
