import { Collection, MongoClient } from "mongodb"

import { BLOG_DB_NAME, blogCollectionNames } from "../lib/mongo"

const databaseUrl = process.env.DATABASE_URL ?? "mongodb://localhost:27017/blog_db"

const seedPosts = [
  {
    title: "Patreon Update: Building Soren Tech in Public",
    slug: "patreon-update-building-soren-tech-in-public",
    excerpt:
      "A full Patreon update on what is changing at Soren Tech, what supporters can expect next, and why community-backed development is the focus moving forward.",
    content: `# Patreon Update: Building Soren Tech in Public

I wanted to share a direct update about Patreon and what comes next for Soren Tech.

## What's changing

I'm using Patreon as the main place for behind-the-scenes development updates, roadmap previews, and early technical write-ups. Instead of posting sporadically, updates will now follow a clear rhythm.

## What supporters can expect

- Weekly build logs with concrete progress
- Monthly roadmap snapshots and priorities
- Early access to long-form technical breakdowns
- Community voting on what gets built next

## Why this matters

Soren Tech is being built as a long-term product and engineering brand. Patreon support helps fund stable development time while keeping the process transparent.

Thanks to everyone who has supported the mission so far. The next phase is focused on consistency and shipping.
`,
    category: "Announcements",
    tags: ["patreon", "soren-tech", "update"],
    source: "blog",
    status: "published",
    featured: true,
  },
  {
    title: "Soren Tech Public Discord Is Live",
    slug: "soren-tech-public-discord-is-live",
    excerpt:
      "The public Soren Tech Discord is now open: a place for build updates, community Q&A, roadmap discussion, and shared learning.",
    content: `# Soren Tech Public Discord Is Live

The Soren Tech community now has an official public Discord server.

## Why launch a Discord

I wanted one place where people can follow product updates in real time, ask technical questions, and connect with other builders.

## What you'll find inside

- Announcement channels for releases and milestones
- General discussion for engineering and startup conversations
- Feedback threads for current features
- A space to share wins, blockers, and ideas

## Join and help shape v1

If you've been following the blog or Patreon updates, Discord is now the fastest way to stay involved.

This project is being built in public, and community feedback is part of the core process.
`,
    category: "Community",
    tags: ["discord", "community", "soren-tech"],
    source: "blog",
    status: "published",
    featured: true,
  },
]

function estimateReadTimeMinutes(content: string) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

async function ensurePostIndexes(posts: Collection) {
  const indexes = await posts.indexes()
  const externalIndex = indexes.find((index) => index.name === "externalId_1_source_1")
  const usesPartialExternalIdIndex =
    externalIndex &&
    "partialFilterExpression" in externalIndex &&
    externalIndex.partialFilterExpression?.externalId?.$type === "string"

  if (externalIndex?.name && !usesPartialExternalIdIndex) {
    await posts.dropIndex(externalIndex.name)
  }

  await posts.createIndex({ slug: 1 }, { unique: true })
  await posts.createIndex(
    {
      externalId: 1,
      source: 1,
    },
    {
      unique: true,
      partialFilterExpression: {
        externalId: { $type: "string" },
      },
    },
  )
}

async function run() {
  const client = new MongoClient(databaseUrl)
  await client.connect()

  const db = client.db(BLOG_DB_NAME)
  const posts = db.collection(blogCollectionNames.posts)

  await ensurePostIndexes(posts)

  const now = new Date()

  for (const post of seedPosts) {
    await posts.updateOne(
      { slug: post.slug },
      {
        $set: {
          ...post,
          readTimeMinutes: estimateReadTimeMinutes(post.content),
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    )
  }

  await client.close()
  console.log(`Seeded ${seedPosts.length} starter posts.`)
}

run().catch((error) => {
  console.error("Failed to seed posts", error)
  process.exit(1)
})
