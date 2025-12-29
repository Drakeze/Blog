type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

const memoryStore = new Map<string, { hits: number; resetAt: number }>()

export async function rateLimitByIp({
  request,
  maxRequests,
  windowSeconds,
}: {
  request: Request
  maxRequests: number
  windowSeconds: number
}): Promise<RateLimitResult> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  const existing = memoryStore.get(ip)
  if (existing && now < existing.resetAt) {
    if (existing.hits >= maxRequests) {
      return { allowed: false, remaining: 0, resetAt: existing.resetAt }
    }

    existing.hits += 1
    memoryStore.set(ip, existing)
    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - existing.hits),
      resetAt: existing.resetAt,
    }
  }

  const resetAt = now + windowMs
  memoryStore.set(ip, { hits: 1, resetAt })

  return { allowed: true, remaining: maxRequests - 1, resetAt }
}
