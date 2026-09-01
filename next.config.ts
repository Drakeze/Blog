import type { NextConfig } from "next"

// Explicit image host allowlist. Never use "**" here — the Next image optimizer
// will fetch any URL it's allowed to, which turns /_next/image into an open
// proxy (SSRF to cloud metadata / internal services).
const imageHosts = [
  "images.drakeze.com", // Cloudflare R2 public bucket (NEXT_PUBLIC_R2_PUBLIC_URL)
  "pub-196fa866c9204ea18c2dc7ae564f3bad.r2.dev", // legacy R2 public host (see DEVLOG)
  "img.clerk.com", // author + commenter avatars
  "images.unsplash.com", // seed / fallback cover images
]

// ponytail: CSP ships report-only. Clerk + PostHog need live verification on a
// deployed preview before enforcing — check the browser console for violations,
// tighten, then rename the header to "Content-Security-Policy".
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://challenges.cloudflare.com https://*.posthog.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `img-src 'self' data: blob: ${imageHosts.map((h) => `https://${h}`).join(" ")} https://*.clerk.accounts.dev https://*.posthog.com`,
  "connect-src 'self' https://*.clerk.accounts.dev https://*.posthog.com https://*.i.posthog.com",
  "worker-src 'self' blob:",
  "frame-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ")

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ]
  },
  skipTrailingSlashRedirect: true,
}

export default nextConfig
