import "./globals.css"

import type { Metadata } from "next"
import type React from "react"

import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Thinking Outside the Box",
  description: "Thinking Outside the Box is a blog about technology, development, and ideas from across the web.",
  generator: "Thinking Outside the Box",
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased"><Providers>{children}</Providers></body>
    </html>
  )
}
