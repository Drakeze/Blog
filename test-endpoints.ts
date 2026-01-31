#!/usr/bin/env bun

const BASE_URL = "http://localhost:3000"

interface TestResult {
  name: string
  passed: boolean
  message: string
}

const results: TestResult[] = []

async function test(name: string, fn: () => Promise<boolean>, successMsg: string, failMsg: string) {
  try {
    const passed = await fn()
    results.push({ name, passed, message: passed ? successMsg : failMsg })
  } catch (error) {
    results.push({
      name,
      passed: false,
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

async function main() {
  console.log("🧪 Testing Blog Platform Endpoints...\n")

  // Test 1: Health check
  await test(
    "Health Check",
    async () => {
      const res = await fetch(`${BASE_URL}/api/health`)
      return res.ok
    },
    "✓ Health endpoint responding",
    "✗ Health endpoint failed",
  )

  // Test 2: Admin auth endpoint (GET)
  await test(
    "Admin Auth Status",
    async () => {
      const res = await fetch(`${BASE_URL}/api/admin/auth`)
      const data = await res.json()
      return res.ok && typeof data.authorized === "boolean"
    },
    "✓ Admin auth status endpoint working",
    "✗ Admin auth status endpoint failed",
  )

  // Test 3: Integration endpoints (GET)
  const platforms = ["reddit", "linkedin", "patreon", "twitter"]
  for (const platform of platforms) {
    await test(
      `${platform} Integration Info`,
      async () => {
        const res = await fetch(`${BASE_URL}/api/integrations/${platform}`)
        const data = await res.json()
        return res.ok && data.integration === platform
      },
      `✓ ${platform} integration endpoint responding`,
      `✗ ${platform} integration endpoint failed`,
    )
  }

  // Test 4: Mock sync tests
  await test(
    "Reddit Mock Sync",
    async () => {
      const res = await fetch(`${BASE_URL}/api/integrations/reddit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "test", mockMode: true }),
      })
      const data = await res.json()
      return res.ok && data.mockMode === true
    },
    "✓ Reddit mock sync validated",
    "✗ Reddit mock sync failed",
  )

  await test(
    "LinkedIn Mock Sync",
    async () => {
      const res = await fetch(`${BASE_URL}/api/integrations/linkedin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockMode: true }),
      })
      const data = await res.json()
      return res.ok && data.mockMode === true
    },
    "✓ LinkedIn mock sync validated",
    "✗ LinkedIn mock sync failed",
  )

  await test(
    "Patreon Mock Sync",
    async () => {
      const res = await fetch(`${BASE_URL}/api/integrations/patreon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockMode: true }),
      })
      const data = await res.json()
      return res.ok && data.mockMode === true
    },
    "✓ Patreon mock sync validated",
    "✗ Patreon mock sync failed",
  )

  // Print results
  console.log("\n" + "=".repeat(60))
  console.log("📊 Test Results")
  console.log("=".repeat(60) + "\n")

  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length

  results.forEach((result) => {
    console.log(result.message)
  })

  console.log("\n" + "=".repeat(60))
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`)
  console.log("=".repeat(60))

  if (failed > 0) {
    process.exit(1)
  }
}

main().catch(console.error)
