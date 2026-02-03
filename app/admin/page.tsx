import Link from "next/link"

import { IntegrationSync } from "@/components/admin/IntegrationSync"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth"

export default async function AdminIndex() {
  await requireAdmin()
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Admin</p>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage posts and publishing workflow.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Start a new article with the latest schema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full rounded-full">
              <Link href="/admin/create">Create post</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>View All Posts</CardTitle>
            <CardDescription>Search, sort, and manage every entry.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/admin/posts">Open posts table</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold tracking-tight">Social Media Integrations</h2>
          <p className="text-sm text-muted-foreground">
            Sync content from external platforms to your blog.
          </p>
        </div>
        <IntegrationSync />
      </div>
    </div>
  )
}
