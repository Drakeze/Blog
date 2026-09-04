import { expect, mock, test } from "bun:test"

// A connect() that fails once, then succeeds — mimics a transient Atlas blip.
let attempts = 0
const fakeClient = { db: () => ({ name: "blog_db" }) }

mock.module("mongodb", () => ({
  MongoClient: class {
    connect() {
      attempts += 1
      return attempts === 1
        ? Promise.reject(new Error("transient"))
        : Promise.resolve(fakeClient)
    }
  },
}))

test("a failed connect is not cached — the next call retries", async () => {
  const { getDb } = await import("./mongo")

  await expect(getDb()).rejects.toThrow("transient")

  // Must NOT re-throw the cached rejection; a fresh connect should happen.
  const db = await getDb()
  expect((db as unknown as { name: string }).name).toBe("blog_db")
  expect(attempts).toBe(2)
})
