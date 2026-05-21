import { MongoClient } from "mongodb"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set")

const now = new Date()

function daysAgo(n: number) {
  const d = new Date(now)
  d.setDate(d.getDate() - n)
  return d
}

const posts = [
  {
    title: "Thinking Outside the Box: Why Conventional Wisdom Holds Us Back",
    slug: "thinking-outside-the-box",
    excerpt:
      "Most people follow the same mental frameworks they were handed in school. Here's why questioning those defaults is the most underrated skill you can build.",
    content: `# Thinking Outside the Box: Why Conventional Wisdom Holds Us Back

We're taught from a young age to follow the rules. Stay in line. Do what works. Don't reinvent the wheel.

And for most things, that's fine advice. But when it becomes the *only* mode of thinking, it quietly caps your ceiling.

## The Problem with "Best Practices"

Best practices are snapshots. They're what worked for someone, somewhere, under a specific set of conditions — then written down and repeated until they became gospel.

The dangerous part isn't following them. It's following them without asking *why*.

> "The person who says it cannot be done should not interrupt the person doing it." — Chinese proverb

## What Lateral Thinking Actually Means

Edward de Bono coined the term *lateral thinking* in 1967. The idea is simple: instead of digging deeper in the same hole, sometimes you need to start digging in a different place.

In practice that looks like:

- **Reversing assumptions** — instead of "how do we get more customers?" ask "what would make us lose all of them?"
- **Random entry** — take an unrelated concept and force a connection
- **Provocation** — state something deliberately wrong and work backwards from it

## A Real Example

When Southwest Airlines was struggling in the early days, they asked the wrong question for a while: *how do we compete with other airlines?*

The right question turned out to be: *what are we actually competing with?* The answer was the car. That reframe changed their entire strategy — short routes, no assigned seats, fast turnarounds, low prices.

Same industry. Completely different map.

## How to Practice This

You don't need to be a genius. You need a habit.

1. **Read across domains** — the best ideas come from collisions between fields that don't usually talk to each other
2. **Keep a "why does this exist?" journal** — pick one thing per day and trace it back to its origin
3. **Find the person in the room who disagrees** — not to argue, but to understand a different prior

The box isn't your enemy. Forgetting you're in one is.`,
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=675&fit=crop",
    tags: ["thinking", "mindset", "productivity"],
    status: "published",
    authorId: "seed_author",
    authorName: "Drakeze",
    authorImageUrl: undefined,
    publishedAt: daysAgo(14),
    createdAt: daysAgo(15),
    updatedAt: daysAgo(14),
  },
  {
    title: "Building in Public: The Case for Radical Transparency",
    slug: "building-in-public",
    excerpt:
      "Sharing your work before it's ready feels terrifying. But the creators who grow fastest are the ones willing to show the process, not just the result.",
    content: `# Building in Public: The Case for Radical Transparency

There's a version of success that looks polished. A finished product, a press release, a launch day. Everything revealed only once it's perfect.

Then there's the other version — where you share the messy middle and let people come along for the ride.

## Why Most People Wait

Waiting until it's ready feels safe. You control the narrative. You avoid criticism during the vulnerable phase.

But that safety comes at a cost: **you're invisible until you're not**, and by then the compounding effect of building an audience is lost.

## What "Building in Public" Actually Means

It doesn't mean oversharing. It means narrating decisions, sharing failures alongside wins, and inviting people into your thinking process.

The format can be anything:
- A weekly update thread on X
- A short post about what you learned this week
- A video showing a feature you just shipped (and what broke)

The medium matters less than the consistency and the honesty.

## The Compounding Effect

When you share your process:

1. You attract people who are interested in *you*, not just your finished product
2. Feedback comes early, when it's actually useful
3. You build accountability that makes you ship faster
4. You create content as a byproduct of work you're already doing

None of this requires a big audience to start. In fact, the smaller the audience, the more intimate the feedback.

## The Vulnerability Trap

The one mistake people make with building in public is performing vulnerability rather than actually being vulnerable.

Posting "today was hard" without saying *why* is performance. Posting "I spent three hours on a bug that turned out to be a missing semicolon and now I question my entire career" is actually useful to someone.

Specificity is what makes it real.

## Where to Start

Pick one thing you're working on. Write one sentence about what you did on it today. Post it somewhere.

That's it. The rest builds from there.`,
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=675&fit=crop",
    tags: ["creators", "indie", "building"],
    status: "published",
    authorId: "seed_author",
    authorName: "Drakeze",
    authorImageUrl: undefined,
    publishedAt: daysAgo(7),
    createdAt: daysAgo(8),
    updatedAt: daysAgo(7),
  },
  {
    title: "The Quiet Advantage: Why Slow Readers Win Long-Term",
    slug: "slow-readers-win",
    excerpt:
      "In a world optimizing for speed — 2x playback, summaries, highlights — the person who actually reads slowly and thinks deeply has a compounding edge.",
    content: `# The Quiet Advantage: Why Slow Readers Win Long-Term

Speed reading is sold as a superpower. Get through more books, absorb more ideas, optimize your inputs.

But there's something the speed-reading crowd doesn't talk about: comprehension doesn't scale with speed. And neither does wisdom.

## What Reading Fast Actually Does

At high speeds, your brain skims for keywords and fills in the gaps with what it already knows. You're not reading — you're confirming.

This works fine for skimming a contract or scanning a news article. It's terrible for anything that's trying to shift how you think.

## The Retention Problem

Studies on reading retention consistently show that slower reading with active engagement retains dramatically more than fast passive reading.

Not just more facts. More *structure*. The mental model that holds the facts together.

Reading a book twice slowly beats reading it four times quickly — every time.

## What Slow Reading Looks Like

- Reading a paragraph and then pausing
- Writing a note in the margin (or a digital equivalent)
- Stopping when something contradicts what you thought you knew
- Re-reading a sentence that didn't land the first time

It feels inefficient. That friction is the point. Friction is where understanding happens.

## The Compounding Edge

Here's what makes this a long-term advantage: most people optimize for volume because volume is visible and measurable.

"I read 52 books this year" is a flex. "I deeply changed how I think about three things this year" doesn't fit in a year-end recap.

But the second person — the slow reader who actually integrated what they read — compounds faster. Their decisions improve. Their models update correctly. They stop making the same mistakes.

## A Simple Practice

Pick one book. Read it slowly. Stop when something surprises you and write down why it surprised you.

That note is worth more than 10 books skimmed.`,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=675&fit=crop",
    tags: ["reading", "learning", "mindset"],
    status: "published",
    authorId: "seed_author",
    authorName: "Drakeze",
    authorImageUrl: undefined,
    publishedAt: daysAgo(3),
    createdAt: daysAgo(4),
    updatedAt: daysAgo(3),
  },
  {
    title: "On Consistency: The Most Boring Success Strategy That Actually Works",
    slug: "on-consistency",
    excerpt:
      "Nobody wants to hear that the secret is showing up every day. But compounding applies to skills, relationships, and reputation just as much as it does to money.",
    content: `# On Consistency: The Most Boring Success Strategy That Actually Works

Self-improvement content loves the dramatic. The morning routine that changed everything. The one book. The pivotal moment.

What it underplays — because it doesn't make for good content — is the thing that actually explains most long-term outcomes: **boring, unremarkable consistency**.

## Why We Resist It

Consistency feels like settling. Like you're not doing enough, not optimizing, not finding the shortcut.

It also doesn't provide the dopamine hit of a fresh start. Day 1 of a new habit feels meaningful. Day 47 of the same habit feels like nothing.

That gap between the feeling and the reality is exactly where most people fall off.

## The Compounding Proof

James Clear's *Atomic Habits* popularized the 1% better every day math: 1.01^365 ≈ 37.

But you don't need the math. You just need to look around.

The people who are unusually good at things — at writing, at coding, at building relationships, at staying fit — almost universally got there through unremarkable reps over a long time. Not a single breakthrough. Accumulation.

## What Consistency Is Not

Consistency is not perfection. Missing one day doesn't break a streak in any meaningful way. The rule that actually matters is: **never miss twice**.

One miss is variance. Two misses is the start of a new pattern.

## The Identity Shift

The reason most habit advice fails is it focuses on outcomes ("I want to write a book") rather than identity ("I am someone who writes").

Outcomes are fragile. Identity is self-reinforcing. Every rep is a vote for who you are.

The goal isn't to do the thing. The goal is to become the kind of person who does the thing — and then the doing becomes automatic.

## Where to Start

Pick something small enough that it's embarrassing to skip. Write one sentence. Do five minutes. Send one message.

The bar should feel too low. That's correct. Lower it until it does.

Then show up tomorrow.`,
    coverImage: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1200&h=675&fit=crop",
    tags: ["habits", "productivity", "mindset"],
    status: "published",
    authorId: "seed_author",
    authorName: "Drakeze",
    authorImageUrl: undefined,
    publishedAt: daysAgo(1),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
]

async function seed() {
  const client = new MongoClient(DATABASE_URL!)
  await client.connect()
  const db = client.db()
  const col = db.collection("posts")

  // Remove existing seed posts so re-running is safe
  await col.deleteMany({ authorId: "seed_author" })

  const result = await col.insertMany(posts as any)
  console.log(`✓ Inserted ${result.insertedCount} seed posts into blog_db.posts`)

  await client.close()
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
