import type { BlogPost } from "@/data/posts"

const now = new Date().toISOString()

export const starterPosts: BlogPost[] = [
  {
    id: "starter-patreon-update",
    title: "Patreon Update: Building Soren Tech in Public",
    slug: "patreon-update-building-soren-tech-in-public",
    excerpt:
      "A full Patreon update on what is changing at Soren Tech, what supporters can expect next, and why community-backed development is the focus moving forward.",
    content: `# Patreon Update: Building Soren Tech in Public\n\nI wanted to share a direct update about Patreon and what comes next for Soren Tech.\n\n## What's changing\n\nI'm using Patreon as the main place for behind-the-scenes development updates, roadmap previews, and early technical write-ups.\n\n## What supporters can expect\n\n- Weekly build logs\n- Monthly roadmap snapshots\n- Early technical breakdowns\n\n## Why this matters\n\nSoren Tech is being built as a long-term product and engineering brand.`,
    category: "Announcements",
    tags: ["patreon", "soren-tech", "update"],
    readTimeMinutes: 2,
    readTime: "2 min read",
    source: "blog",
    status: "published",
    featured: true,
    createdAt: now,
    updatedAt: now,
    externalId: null,
    externalUrl: null,
    heroImage: null,
  },
  {
    id: "starter-discord-launch",
    title: "Soren Tech Public Discord Is Live",
    slug: "soren-tech-public-discord-is-live",
    excerpt:
      "The public Soren Tech Discord is now open: a place for build updates, community Q&A, roadmap discussion, and shared learning.",
    content: `# Soren Tech Public Discord Is Live\n\nThe Soren Tech community now has an official public Discord server.\n\n## Why launch a Discord\n\nI wanted one place where people can follow product updates in real time and connect with other builders.\n\n## What you'll find inside\n\n- Release announcements\n- Engineering discussion\n- Feedback threads\n\nThis project is being built in public, and community feedback is core to the process.`,
    category: "Community",
    tags: ["discord", "community", "soren-tech"],
    readTimeMinutes: 2,
    readTime: "2 min read",
    source: "blog",
    status: "published",
    featured: true,
    createdAt: now,
    updatedAt: now,
    externalId: null,
    externalUrl: null,
    heroImage: null,
  },
]
