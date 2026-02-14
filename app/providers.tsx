"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  // useState ensures the QueryClient is created once per session
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <Analytics />
      </ThemeProvider>
    </QueryClientProvider>
  )
}