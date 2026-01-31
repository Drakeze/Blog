"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Platform = "reddit" | "linkedin" | "patreon"

interface SyncResult {
  success: boolean
  synced?: number
  failed?: number
  message?: string
  error?: string
}

export function IntegrationSync() {
  const [redditUsername, setRedditUsername] = useState("")
  const [syncing, setSyncing] = useState<Platform | null>(null)
  const [results, setResults] = useState<Record<Platform, SyncResult | null>>({
    reddit: null,
    linkedin: null,
    patreon: null,
  })

  const syncPlatform = async (platform: Platform, params?: Record<string, unknown>) => {
    setSyncing(platform)
    setResults((prev) => ({ ...prev, [platform]: null }))

    try {
      const response = await fetch(`/api/integrations/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params || {}),
      })

      const data = await response.json()

      if (!response.ok) {
        setResults((prev) => ({
          ...prev,
          [platform]: { success: false, error: data.error || "Sync failed" },
        }))
      } else {
        setResults((prev) => ({
          ...prev,
          [platform]: {
            success: true,
            synced: data.synced,
            failed: data.failed,
            message: data.message,
          },
        }))
      }
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [platform]: { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      }))
    } finally {
      setSyncing(null)
    }
  }

  const handleRedditSync = () => {
    if (!redditUsername.trim()) return
    syncPlatform("reddit", { username: redditUsername, limit: 25 })
  }

  const handleLinkedInSync = () => {
    syncPlatform("linkedin", { limit: 25 })
  }

  const handlePatreonSync = () => {
    syncPlatform("patreon", { limit: 25 })
  }

  return (
    <div className="space-y-6">
      {/* Reddit */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FF4500]" />
            Reddit
          </CardTitle>
          <CardDescription>Sync posts from a Reddit user profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reddit-username">Username</Label>
            <Input
              id="reddit-username"
              placeholder="e.g. username"
              value={redditUsername}
              onChange={(e) => setRedditUsername(e.target.value)}
              disabled={syncing === "reddit"}
            />
          </div>
          <Button
            onClick={handleRedditSync}
            disabled={!redditUsername.trim() || syncing === "reddit"}
            className="w-full rounded-full"
          >
            {syncing === "reddit" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              "Sync Reddit Posts"
            )}
          </Button>
          {results.reddit && (
            <div
              className={`rounded-lg border p-3 text-sm ${
                results.reddit.success
                  ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {results.reddit.success ? (
                <>
                  ✓ Synced {results.reddit.synced} post(s)
                  {results.reddit.failed ? ` • ${results.reddit.failed} failed` : ""}
                </>
              ) : (
                <>✗ {results.reddit.error}</>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* LinkedIn */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#0A66C2]" />
            LinkedIn
          </CardTitle>
          <CardDescription>Sync posts from your LinkedIn profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleLinkedInSync} disabled={syncing === "linkedin"} className="w-full rounded-full">
            {syncing === "linkedin" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              "Sync LinkedIn Posts"
            )}
          </Button>
          {results.linkedin && (
            <div
              className={`rounded-lg border p-3 text-sm ${
                results.linkedin.success
                  ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {results.linkedin.success ? (
                <>
                  ✓ Synced {results.linkedin.synced} post(s)
                  {results.linkedin.failed ? ` • ${results.linkedin.failed} failed` : ""}
                </>
              ) : (
                <>✗ {results.linkedin.error}</>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patreon */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FF424D]" />
            Patreon
          </CardTitle>
          <CardDescription>Sync posts from your Patreon campaign.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handlePatreonSync} disabled={syncing === "patreon"} className="w-full rounded-full">
            {syncing === "patreon" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              "Sync Patreon Posts"
            )}
          </Button>
          {results.patreon && (
            <div
              className={`rounded-lg border p-3 text-sm ${
                results.patreon.success
                  ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {results.patreon.success ? (
                <>
                  ✓ Synced {results.patreon.synced} post(s)
                  {results.patreon.failed ? ` • ${results.patreon.failed} failed` : ""}
                </>
              ) : (
                <>✗ {results.patreon.error}</>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
