import "./globals.css"

import type { Metadata } from "next"
import type React from "react"
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
