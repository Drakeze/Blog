import "./globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import type React from "react"

import { authConfig, publicEnv } from "@/lib/env"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Thoughts | A Collection of Ideas",
  description: "Writing about technology, development, and ideas from across the web",
  generator: "SorenIdeas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const app = <Providers>{children}</Providers>

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ClerkProvider publishableKey={publicEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} signInUrl={authConfig.signInUrl}>
          {app}
        </ClerkProvider>
      </body>
    </html>
  )
}
