import "./globals.css"

import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Thoughts| A Collection of Ideas",
  description: "Writing about technology, development, and ideas from across the web",
  generator: "SorenIdeas",
  icons: {
    icon: [

    ],
    apple: [

    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
