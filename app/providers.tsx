"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { useState } from "react"
import { Toaster } from "sonner"

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
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
