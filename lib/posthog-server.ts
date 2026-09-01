import { after } from "next/server"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null = null

/** No-op stand-in so a missing token doesn't crash a route. */
const noopClient = {
  capture: () => {},
  flush: async () => {},
  shutdown: async () => {},
} as unknown as PostHog

export function getPostHogClient(): PostHog {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  if (!token) return noopClient
  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return posthogClient
}

type CaptureArgs = Parameters<PostHog["capture"]>[0]

/**
 * Fire a server-side event and flush it after the response. `capture()` only
 * schedules an HTTP POST; on serverless the function freezes before it lands
 * unless we hold it open with `after()`.
 */
export function captureServerEvent(event: CaptureArgs): void {
  const client = getPostHogClient()
  client.capture(event)
  after(async () => {
    await client.flush()
  })
}
