"use client"

import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Platform = "reddit" | "linkedin" | "patreon" | "dailydev" | "twitter"

interface SyncResult {
  success: boolean
  synced?: number
  failed?: number
  message?: string
  error?: string
}

type SyncResponse = {
  enabled: boolean
  integration?: Platform
  synced?: number
  failed?: number
  total?: number
  note?: string
  error?: string
}

function useIntegrationMutation(
  platform: Platform,
  setResults: Dispatch<SetStateAction<Record<Platform, SyncResult | null>>>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/integrations/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = (await response.json()) as SyncResponse
      if (!response.ok) {
        throw new Error(data.error || "Sync failed")
      }
      return data
    },
    onMutate: () => {
      setResults((prev) => ({ ...prev, [platform]: null }))
    },
    onSuccess: (data) => {
      if (!data.enabled) {
        setResults((prev) => ({
          ...prev,
          [platform]: { success: false, error: "Integration is disabled." },
        }))
        return
      }

      setResults((prev) => ({
        ...prev,
        [platform]: {
          success: true,
          synced: data.synced,
          failed: data.failed,
          message: data.note,
        },
      }))

      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
    },
    onError: (error) => {
      setResults((prev) => ({
        ...prev,
        [platform]: { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      }))
    },
  })
}

export function IntegrationSync() {
  const [results, setResults] = useState<Record<Platform, SyncResult | null>>({
    reddit: null,
    linkedin: null,
    patreon: null,
    dailydev: null,
    twitter: null,
  })

  const redditMutation = useIntegrationMutation("reddit", setResults)
  const linkedinMutation = useIntegrationMutation("linkedin", setResults)
  const patreonMutation = useIntegrationMutation("patreon", setResults)
  const dailydevMutation = useIntegrationMutation("dailydev", setResults)
  const twitterMutation = useIntegrationMutation("twitter", setResults)

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
          <Button
            onClick={() => redditMutation.mutate()}
            disabled={redditMutation.isPending}
            className="w-full rounded-full"
          >
            {redditMutation.isPending ? (
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
          <Button
            onClick={() => linkedinMutation.mutate()}
            disabled={linkedinMutation.isPending}
            className="w-full rounded-full"
          >
            {linkedinMutation.isPending ? (
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
          <Button
            onClick={() => patreonMutation.mutate()}
            disabled={patreonMutation.isPending}
            className="w-full rounded-full"
          >
            {patreonMutation.isPending ? (
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

      {/* Daily.dev */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#0B4CFF]" />
            Daily.dev
          </CardTitle>
          <CardDescription>Stub integration for Daily.dev content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => dailydevMutation.mutate()}
            disabled={dailydevMutation.isPending}
            className="w-full rounded-full"
          >
            {dailydevMutation.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              "Sync Daily.dev Posts"
            )}
          </Button>
          {results.dailydev && (
            <div
              className={`rounded-lg border p-3 text-sm ${
                results.dailydev.success
                  ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {results.dailydev.success ? (
                <>
                  ✓ Synced {results.dailydev.synced} post(s)
                  {results.dailydev.failed ? ` • ${results.dailydev.failed} failed` : ""}
                </>
              ) : (
                <>✗ {results.dailydev.error}</>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Twitter/X */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#1DA1F2]" />
            Twitter/X
          </CardTitle>
          <CardDescription>Stub integration for future Twitter/X ingestion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => twitterMutation.mutate()}
            disabled={twitterMutation.isPending}
            className="w-full rounded-full"
          >
            {twitterMutation.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              "Sync Twitter/X Posts"
            )}
          </Button>
          {results.twitter && (
            <div
              className={`rounded-lg border p-3 text-sm ${
                results.twitter.success
                  ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {results.twitter.success ? (
                <>
                  ✓ Synced {results.twitter.synced} post(s)
                  {results.twitter.failed ? ` • ${results.twitter.failed} failed` : ""}
                </>
              ) : (
                <>✗ {results.twitter.error}</>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
