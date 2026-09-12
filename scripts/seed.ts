import crypto from 'crypto';
import { MongoClient } from 'mongodb';

import type { Post } from '@/models/post';
import type { Subscriber } from '@/models/subscriber';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const dbName = DATABASE_URL.match(/\/([^/?]+)(\?|$)/)?.[1] ?? '';
if (!dbName.endsWith('_dev')) {
  console.error(
    `Refusing to seed "${dbName}" — the target database name must end in "_dev".\n` +
      `Point DATABASE_URL at blog_db_dev before seeding.`
  );
  process.exit(1);
}

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000);

const author = {
  authorId: 'seed_anthony',
  authorName: 'Anthony Shead',
  authorImageUrl: undefined as string | undefined,
};

const posts: Post[] = [
  {
    ...author,
    title: 'Getting the Languages Back',
    slug: 'getting-the-languages-back',
    slugHistory: [],
    excerpt:
      "I let the portfolio sit for a few months. Coming back, the concepts were all there - the fluency wasn't. This is the log of getting it back.",
    content: `The concepts were all still there. The **fluency** was gone.

I'd stall on things that used to be automatic - the shape of a generic, where a
lifetime goes, which trait to reach for.

## The rule: ship the small thing

Small console apps, one language at a time, each finished and committed before
the next.

- A translator in Python
- A todo list in C++
- An alarm clock, also C++

\`\`\`cpp
bool Alarm::isDue(const std::tm& now) const {
  return now.tm_hour == hour_ && now.tm_min == minute_ && !fired_;
}
\`\`\`

> Fluency isn't knowledge. It's the tax you pay for not practising.

The [NOTES.md walkthrough](https://drakeze.com) in each repo is the real
deliverable - writing the explanation is what proved I understood it.`,
    coverImage: undefined,
    tags: ['dev journey', 'portfolio', 'learning'],
    status: 'published',
    publishedAt: daysAgo(2),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
  {
    ...author,
    title: 'Escaping the Hotkey Trap',
    slug: 'escaping-the-hotkey-trap',
    slugHistory: [],
    excerpt:
      "A keyboard-driven automation that kept firing the wrong macro. The fix wasn't more automation - it was changing the question.",
    content: `By changing the query, the code became valid TypeScript and the loop fell
out for free.

## What broke

The macro matched on window title. Two apps shared a prefix.

\`\`\`ts
const match = windows.find((w) => w.title.startsWith(prefix))
\`\`\`

## The reframe

Stop asking "which window is focused?" Ask "which *workspace* am I in?" - that's
a stable id, not a fuzzy string.`,
    coverImage: undefined,
    tags: ['automation', 'dev journey'],
    status: 'published',
    publishedAt: daysAgo(6),
    createdAt: daysAgo(7),
    updatedAt: daysAgo(6),
  },
  {
    ...author,
    title: 'Building in Public, Quietly',
    slug: 'building-in-public-quietly',
    slugHistory: [],
    excerpt:
      "You don't need a big audience to build in public. The smaller the audience, the more useful the feedback.",
    content: `Waiting until it's ready feels safe. That safety costs you: you're invisible
until you're not, and the compounding is gone.

1. Narrate decisions, not just launches
2. Share the failure next to the win
3. Be specifically vulnerable, not performatively vulnerable

"Today was hard" is performance. "I spent three hours on a missing semicolon and
now I question my career" is useful to someone.`,
    coverImage: undefined,
    tags: ['building in public', 'career growth'],
    status: 'published',
    publishedAt: daysAgo(12),
    createdAt: daysAgo(13),
    updatedAt: daysAgo(12),
  },
  {
    ...author,
    title: 'The Rust Calendar (Draft)',
    slug: 'the-rust-calendar',
    slugHistory: [],
    excerpt: "Starting the cycle over in a language I barely know. That's the point.",
    content: `Next small app: a calendar. I'm rewriting it in Rust, which means the fluency
cycle starts over.

\`\`\`rust
fn days_in_month(year: i32, month: u32) -> u32 {
    match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 if year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) => 29,
        2 => 28,
        _ => unreachable!(),
    }
}
\`\`\``,
    coverImage: undefined,
    tags: ['rust', 'dev journey'],
    status: 'draft',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

const subscribers: Subscriber[] = [
  {
    email: 'confirmed@seed.example',
    confirmed: true,
    confirmedAt: daysAgo(9),
    unsubscribeToken: crypto.randomUUID(),
    createdAt: daysAgo(10),
  },
  {
    email: 'pending@seed.example',
    confirmed: false,
    confirmToken: crypto.randomUUID(),
    unsubscribeToken: crypto.randomUUID(),
    createdAt: daysAgo(2),
  },
];

async function seed() {
  console.log(`Seeding ${dbName} …`);
  const client = new MongoClient(DATABASE_URL!);
  await client.connect();
  const db = client.db();

  await db.collection('posts').deleteMany({ authorId: author.authorId });
  await db.collection('subscribers').deleteMany({ email: /@seed\.example$/ });

  const p = await db.collection('posts').insertMany(posts);
  console.log(`✓ ${p.insertedCount} posts`);
  const s = await db.collection('subscribers').insertMany(subscribers);
  console.log(`✓ ${s.insertedCount} subscribers`);

  await client.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
