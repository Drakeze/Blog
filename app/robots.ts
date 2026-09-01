import type { MetadataRoute } from "next"
import { publicEnv } from "@/lib/env"

const base = (publicEnv.NEXT_PUBLIC_SITE_URL || "https://blog.drakeze.com").replace(/\/$/, "")

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
