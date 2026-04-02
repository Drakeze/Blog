"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SyncResult {
  success: boolean
  synced?: number
  failed?: number
  message?: string
  error?: string
  failures?: Array<{ externalId?: string; error?: string }>
  troubleshooting?: string[]
}

interface RedditStatus {
  enabled: boolean
  missingKeys: string[]
  defaultUsername: string | null
}

export function IntegrationSync() {
  const [redditUsername, setRedditUsername] = useState("")
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)
  const [status, setStatus] = useState<RedditStatus | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadStatus() {
      try {
        const response = await fetch("/api/integrations/reddit", { method: "GET" })
        const data = (await response.json()) as RedditStatus

        if (cancelled) {
          return
        }

        setStatus(data)
        if (data.defaultUsername) {
          setRedditUsername(data.defaultUsername)
        }
      } catch {
        if (!cancelled) {
          setStatus(null)
        }
      } finally {
        if (!cancelled) {
          setLoadingStatus(false)
        }
      }
    }

    void loadStatus()

    return () => {
      cancelled = true
    }
  }, [])

  const handleRedditSync = async () => {
    if (!redditUsername.trim()) return

    setSyncing(true)
    setResult(null)

    try {
      const response = await fetch("/api/integrations/reddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: redditUsername, limit: 25 }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({
          success: false,
          error: data.error || "Sync failed",
          troubleshooting: data.troubleshooting,
        })
      } else {
        setResult({
          success: true,
          synced: data.synced,
          failed: data.failed,
          message: data.message,
          failures: data.failures,
        })
      }
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FF4500]" />
          Reddit Sync
        </CardTitle>
        <CardDescription>
          Reddit is the only external source. Sync recent posts from a Reddit user profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!loadingStatus && status && !status.enabled ? (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-800">
            <p className="font-medium">Reddit credentials are incomplete.</p>
            <p className="mt-1">Missing: {status.missingKeys.join(", ")}</p>
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="reddit-username">Username</Label>
          <Input
            id="reddit-username"
            placeholder="e.g. SorenIdeas"
            value={redditUsername}
            onChange={(e) => setRedditUsername(e.target.value)}
            disabled={syncing || (!loadingStatus && status?.enabled === false)}
          />
        </div>
        <Button
          onClick={handleRedditSync}
          disabled={!redditUsername.trim() || syncing || (!loadingStatus && status?.enabled === false)}
          className="w-full rounded-full"
        >
          {syncing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            "Sync Reddit Posts"
          )}
        </Button>
        {result && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              result.success
                ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
            }`}
          >
            {result.success ? (
              <>
                ✓ Synced {result.synced} post(s)
                {result.failed ? ` • ${result.failed} failed` : ""}
                {result.failures?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {result.failures.map((failure, index) => (
                      <li key={`${failure.externalId ?? "unknown"}-${index}`}>
                        {failure.externalId ?? "unknown"}: {failure.error ?? "Unknown error"}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
              <>
                <p>✗ {result.error}</p>
                {result.troubleshooting?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {result.troubleshooting.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
