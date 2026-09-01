import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Providers } from "./providers"
import { Analytics } from "@vercel/analytics/next"
import { publicEnv } from "@/lib/env"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })

const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL || "https://blog.drakeze.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Drakeze Blog",
    template: "%s · Drakeze Blog",
  },
  description:
    "Writing about software, systems, and the craft of building things — by Anthony (Drakeze).",
  applicationName: "Drakeze Blog",
  authors: [{ name: "Anthony", url: "https://drakeze.com" }],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Drakeze Blog",
    title: "Drakeze Blog",
    description: "Writing about software, systems, and the craft of building things.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@SorenIdeas",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
