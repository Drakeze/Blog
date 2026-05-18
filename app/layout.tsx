import "./globals.css"

import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import type React from "react"

import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Thinking Outside the Box",
  description: "Thinking Outside the Box is a blog about technology, development, and ideas from across the web.",
  generator: "Thinking Outside the Box",
  icons: {
    icon: "/pen.png",
    apple: "/pen.png",
  },
}

export const runtime = "nodejs"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
