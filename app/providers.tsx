"use client"

import { ClerkProvider, useUser } from "@clerk/nextjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { useEffect, useRef, useState } from "react"
import posthog from "posthog-js"
import { Toaster } from "sonner"

function PostHogIdentity() {
  const { user, isSignedIn } = useUser()
  const userId = user?.id
  const wasSignedIn = useRef(false)

  useEffect(() => {
    if (isSignedIn && user) {
      // Keyed on userId, not the `user` object — Clerk hands back a fresh
      // reference on many re-renders and we don't want to re-identify each time.
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? user.username ?? undefined,
      })
      wasSignedIn.current = true
    } else if (isSignedIn === false && wasSignedIn.current) {
      // Only reset on an actual sign-out — not on every anonymous page load,
      // which would throw away the anon distinct_id and break funnel stitching.
      posthog.reset()
      wasSignedIn.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, userId])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"}
      localization={{
        signUp: {
          start: {
            title: "Subscribe to Drakeze's Blog",
            subtitle: "Create an account to join the community",
            actionText: "Already a member?",
            actionLink: "Sign in",
          },
        },
        signIn: {
          start: {
            title: "Welcome back to Drakeze's Blog",
            subtitle: "Sign in to continue",
            actionText: "Not a member yet?",
            actionLink: "Subscribe",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PostHogIdentity />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
