import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Edit, Trash2, Search, Plus } from "lucide-react"

const posts = [
  {
    id: "1",
    slug: "future-of-web-development",
    title: "The Future of Web Development: Trends to Watch in 2025",
    source: "blog" as const,
    createdAt: "2025-12-01",
    updatedAt: "2025-12-01",
    status: "published" as const,
  },
  {
    id: "2",
    slug: "design-systems-at-scale",
    title: "Building Design Systems at Scale",
    source: "linkedin" as const,
    createdAt: "2025-11-28",
    updatedAt: "2025-11-28",
    status: "published" as const,
  },
  {
    id: "3",
    slug: "typescript-best-practices",
    title: "TypeScript Best Practices for 2025",
    source: "blog" as const,
    createdAt: "2025-11-25",
    updatedAt: "2025-11-26",
    status: "published" as const,
  },
]

export default function AdminPage() {
  const sourceColors = {
    blog: "bg-foreground text-background",
    reddit: "bg-[#FF4500] text-white",
    twitter: "bg-[#1DA1F2] text-white",
    linkedin: "bg-[#0A66C2] text-white",
    patreon: "bg-[#FF424D] text-white",
  }

  const sourceLabels = {
    blog: "Blog",
    reddit: "Reddit",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    patreon: "Patreon",
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif font-bold">All Posts</h1>
          <Button size="lg" asChild>
            <Link href="/admin/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Link>
          </Button>
        </div>

        <div className="mb-8 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search posts..." className="pl-10 h-12" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold">Title</th>
                  <th className="text-left p-4 font-semibold">Slug</th>
                  <th className="text-left p-4 font-semibold">Source</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Created</th>
                  <th className="text-left p-4 font-semibold">Updated</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <Link href={`/blog/${post.slug}`} className="font-medium hover:text-primary">
                        {post.title}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{post.slug}</td>
                    <td className="p-4">
                      <Badge className={`${sourceColors[post.source]} text-xs`}>{sourceLabels[post.source]}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-xs">
                        {post.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{post.createdAt}</td>
                    <td className="p-4 text-sm text-muted-foreground">{post.updatedAt}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/admin/edit/${post.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
