export type PostStatus = "draft" | "published"

export type PostSource = "blog" | "twitter" | "linkedin" | "reddit" | "patreon"

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  slug: string
  source: PostSource
  sourceUrl?: string
  heroImage?: string
  tags: string[]
  readTime: string
  readTimeMinutes: number
  status: PostStatus
  createdAt: string
  updatedAt: string
  author: string
}

export type BlogPostSummary = Omit<BlogPost, "content">

type UpsertPostInput = {
  title?: string
  excerpt?: string
  content?: string
  slug?: string
  source?: PostSource
  sourceUrl?: string
  heroImage?: string
  tags?: string[]
  readTimeMinutes?: number
  status?: PostStatus
  author?: string
}

const STATUS_VALUES: PostStatus[] = ["draft", "published"]
const SOURCE_VALUES: PostSource[] = ["blog", "reddit", "twitter", "linkedin", "patreon"]

const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    excerpt:
      "Learn how to build modern web applications with the latest features in Next.js 15, including improved performance and developer experience.",
    content: `
      <h2>Introduction</h2>
      <p>Next.js 15 brings exciting new features and improvements that make building modern web applications even more enjoyable. In this comprehensive guide, we'll explore the key features and how to get started.</p>

      <h2>What's New in Next.js 15</h2>
      <p>The latest version of Next.js introduces several groundbreaking features:</p>
      <ul>
        <li><strong>Improved Performance:</strong> Faster build times and optimized runtime performance</li>
        <li><strong>Enhanced Developer Experience:</strong> Better error messages and debugging tools</li>
        <li><strong>New App Router Features:</strong> More flexible routing and layout options</li>
        <li><strong>Server Components:</strong> Better server-side rendering capabilities</li>
      </ul>

      <h2>Getting Started</h2>
      <p>To create a new Next.js 15 project, run the following command:</p>
      <pre><code>npx create-next-app@latest my-app --typescript --tailwind --eslint</code></pre>

      <h2>Key Features to Explore</h2>
      <p>Once you have your project set up, here are some key areas to focus on:</p>
      <ol>
        <li>Understanding the App Router</li>
        <li>Working with Server and Client Components</li>
        <li>Implementing dynamic routing</li>
        <li>Optimizing performance with built-in features</li>
      </ol>

      <h2>Conclusion</h2>
      <p>Next.js 15 continues to push the boundaries of what's possible with React applications. Whether you're building a simple blog or a complex web application, Next.js provides the tools and performance you need.</p>
    `,
    slug: "getting-started-nextjs-15",
    source: "blog",
    sourceUrl: "https://yourblog.com/getting-started-nextjs-15",
    heroImage: "/modern-web-development.png",
    tags: ["nextjs", "react", "tutorial"],
    readTime: "5 min read",
    readTimeMinutes: 5,
    status: "published",
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-18T00:00:00.000Z",
    author: "John Doe",
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS for Modern UI",
    excerpt:
      "Discover advanced Tailwind CSS techniques to create beautiful, responsive user interfaces with utility-first CSS framework.",
    content: `
      <h2>Why Tailwind CSS?</h2>
      <p>Tailwind CSS has revolutionized how we approach styling in modern web development. Its utility-first approach allows for rapid prototyping and consistent design systems.</p>

      <h2>Advanced Techniques</h2>
      <p>Let's explore some advanced Tailwind CSS techniques that will elevate your UI development:</p>

      <h3>Custom Color Palettes</h3>
      <p>Creating custom color palettes in Tailwind allows you to maintain brand consistency across your application.</p>

      <h3>Responsive Design Patterns</h3>
      <p>Tailwind's responsive utilities make it easy to create designs that work across all device sizes:</p>
      <ul>
        <li>Mobile-first approach</li>
        <li>Breakpoint-specific utilities</li>
        <li>Container queries</li>
      </ul>

      <h3>Component Composition</h3>
      <p>Learn how to compose reusable components while maintaining the utility-first philosophy.</p>

      <h2>Best Practices</h2>
      <ol>
        <li>Use semantic class names for complex components</li>
        <li>Leverage Tailwind's configuration for consistency</li>
        <li>Optimize for production with purging</li>
      </ol>
    `,
    slug: "mastering-tailwind-css",
    source: "twitter",
    sourceUrl: "https://twitter.com/",
    heroImage: "/design-system-components.png",
    tags: ["tailwind", "css", "design"],
    readTime: "8 min read",
    readTimeMinutes: 8,
    status: "published",
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-12T00:00:00.000Z",
    author: "Jane Smith",
  },
  {
    id: 3,
    title: "Building Scalable React Applications",
    excerpt:
      "Best practices and patterns for building large-scale React applications that are maintainable and performant.",
    content: `
      <h2>Architecture Principles</h2>
      <p>Building scalable React applications requires careful consideration of architecture from the start. Here are the key principles to follow:</p>

      <h3>Component Organization</h3>
      <p>Organize your components in a logical hierarchy that promotes reusability and maintainability.</p>

      <h3>State Management</h3>
      <p>Choose the right state management solution for your application's complexity:</p>
      <ul>
        <li>Local state for simple components</li>
        <li>Context API for shared state</li>
        <li>Redux or Zustand for complex applications</li>
      </ul>

      <h2>Performance Optimization</h2>
      <p>Performance is crucial for user experience. Key optimization techniques include:</p>
      <ol>
        <li>Code splitting and lazy loading</li>
        <li>Memoization with React.memo and useMemo</li>
        <li>Virtual scrolling for large lists</li>
        <li>Image optimization</li>
      </ol>

      <h2>Testing Strategy</h2>
      <p>A comprehensive testing strategy ensures your application remains reliable as it grows.</p>
    `,
    slug: "scalable-react-applications",
    source: "linkedin",
    sourceUrl: "https://linkedin.com/",
    heroImage: "/ai-coding-assistant.jpg",
    tags: ["react", "architecture", "development"],
    readTime: "12 min read",
    readTimeMinutes: 12,
    status: "draft",
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-07T00:00:00.000Z",
    author: "Mike Johnson",
  },
  {
    id: 4,
    title: "TypeScript Best Practices in 2024",
    excerpt:
      "Essential TypeScript patterns and practices that every developer should know for writing better, more maintainable code.",
    content: `
      <h2>Modern TypeScript Features</h2>
      <p>TypeScript continues to evolve with new features that improve developer experience and code safety.</p>

      <h3>Advanced Type Patterns</h3>
      <p>Master these advanced TypeScript patterns:</p>
      <ul>
        <li>Conditional types</li>
        <li>Mapped types</li>
        <li>Template literal types</li>
        <li>Utility types</li>
      </ul>

      <h2>Configuration Best Practices</h2>
      <p>Proper TypeScript configuration is essential for a good development experience:</p>
      <pre><code>{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}</code></pre>

      <h2>Error Handling</h2>
      <p>TypeScript's type system can help you handle errors more effectively and catch issues at compile time.</p>
    `,
    slug: "typescript-best-practices-2024",
    source: "blog",
    sourceUrl: "https://yourblog.com/typescript-best-practices-2024",
    heroImage: "/typescript-code.png",
    tags: ["typescript", "javascript", "development"],
    readTime: "10 min read",
    readTimeMinutes: 10,
    status: "published",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
    author: "Sarah Wilson",
  },
  {
    id: 5,
    title: "Modern CSS Grid Layouts",
    excerpt:
      "Master CSS Grid to create complex, responsive layouts with ease. Learn the fundamentals and advanced techniques.",
    content: `
      <h2>CSS Grid Fundamentals</h2>
      <p>CSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease.</p>

      <h3>Grid Container Properties</h3>
      <p>Understanding the key properties of grid containers:</p>
      <ul>
        <li>display: grid</li>
        <li>grid-template-columns</li>
        <li>grid-template-rows</li>
        <li>gap</li>
      </ul>

      <h2>Advanced Grid Techniques</h2>
      <p>Take your grid skills to the next level with these advanced techniques:</p>

      <h3>Named Grid Lines</h3>
      <p>Use named grid lines to create more semantic and maintainable layouts.</p>

      <h3>Grid Areas</h3>
      <p>Define grid areas for complex layouts that are easy to understand and modify.</p>

      <h2>Responsive Grid Patterns</h2>
      <p>Create responsive layouts that adapt to different screen sizes without media queries.</p>
    `,
    slug: "modern-css-grid-layouts",
    source: "reddit",
    sourceUrl: "https://reddit.com/",
    heroImage: "/modern-web-development-abstract.jpg",
    tags: ["css", "grid", "layout"],
    readTime: "7 min read",
    readTimeMinutes: 7,
    status: "draft",
    createdAt: "2023-12-28T00:00:00.000Z",
    updatedAt: "2023-12-28T00:00:00.000Z",
    author: "Alex Chen",
  },
  {
    id: 6,
    title: "API Design with Node.js and Express",
    excerpt:
      "Learn how to design and build robust RESTful APIs using Node.js and Express with best practices and security considerations.",
    content: `
      <h2>RESTful API Design Principles</h2>
      <p>Building robust APIs requires following established design principles and best practices.</p>

      <h3>Resource-Based URLs</h3>
      <p>Design your API endpoints around resources rather than actions:</p>
      <ul>
        <li>GET /api/users - Get all users</li>
        <li>GET /api/users/:id - Get specific user</li>
        <li>POST /api/users - Create new user</li>
        <li>PUT /api/users/:id - Update user</li>
        <li>DELETE /api/users/:id - Delete user</li>
      </ul>

      <h2>Express.js Best Practices</h2>
      <p>Key practices for building maintainable Express applications:</p>
      <ol>
        <li>Use middleware for cross-cutting concerns</li>
        <li>Implement proper error handling</li>
        <li>Structure your application with routers</li>
        <li>Use environment variables for configuration</li>
      </ol>

      <h2>Security Considerations</h2>
      <p>Security should be built into your API from the ground up:</p>
      <ul>
        <li>Input validation and sanitization</li>
        <li>Authentication and authorization</li>
        <li>Rate limiting</li>
        <li>CORS configuration</li>
      </ul>
    `,
    slug: "api-design-nodejs-express",
    source: "patreon",
    sourceUrl: "https://patreon.com/",
    heroImage: "/website-performance-metrics.jpg",
    tags: ["nodejs", "express", "api"],
    readTime: "15 min read",
    readTimeMinutes: 15,
    status: "published",
    createdAt: "2023-12-20T00:00:00.000Z",
    updatedAt: "2023-12-22T00:00:00.000Z",
    author: "David Brown",
  },
]

let postStore: BlogPost[] = [...initialPosts]

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function sanitizeTags(tags?: unknown[]): string[] {
  if (!Array.isArray(tags)) return []
  const unique = new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))
  return Array.from(unique)
}

function isValidUrl(value?: string | null) {
  if (!value) return false
  if (value.startsWith("/")) return true
  try {
    // eslint-disable-next-line no-new
    new URL(value)
    return true
  } catch (error) {
    return false
  }
}

function ensureUniqueSlug(slug: string, currentId?: number) {
  const baseSlug = normalizeSlug(slug)
  let candidate = baseSlug
  let suffix = 2

  while (postStore.some((post) => post.slug === candidate && post.id !== currentId)) {
    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }

  return candidate
}

function buildReadTime(minutes?: number) {
  if (!minutes || Number.isNaN(minutes)) return "5 min read"
  return `${Math.max(1, Math.round(minutes))} min read`
}

function getNextId() {
  return postStore.reduce((max, post) => Math.max(max, post.id), 0) + 1
}

function parseStatus(value?: PostStatus | string | null): PostStatus | undefined {
  if (!value) return undefined
  return STATUS_VALUES.includes(value as PostStatus) ? (value as PostStatus) : undefined
}

function parseSource(value?: PostSource | string | null): PostSource | undefined {
  if (!value) return undefined
  return SOURCE_VALUES.includes(value as PostSource) ? (value as PostSource) : undefined
}

function validateAndNormalizeInput(input: UpsertPostInput, existing?: BlogPost) {
  const title = (input.title ?? existing?.title ?? "").trim()
  if (!title) throw new Error("Title is required")

  const excerpt = (input.excerpt ?? existing?.excerpt ?? "").trim()
  if (!excerpt) throw new Error("Excerpt is required")

  const content = (input.content ?? existing?.content ?? "").trim()
  if (!content) throw new Error("Content is required")

  const source = parseSource(input.source ?? existing?.source)
  if (!source) throw new Error("Source must be one of blog, twitter, linkedin, reddit, or patreon")

  const status = parseStatus(input.status ?? existing?.status) ?? "draft"

  const sourceUrl = (input.sourceUrl ?? existing?.sourceUrl)?.trim()
  if (sourceUrl && !isValidUrl(sourceUrl)) {
    throw new Error("Source URL must be a valid URL")
  }

  const heroImage = (input.heroImage ?? existing?.heroImage)?.trim()
  if (heroImage && !isValidUrl(heroImage)) {
    throw new Error("Hero image must be a valid URL")
  }

  const readTimeMinutes = Number.isFinite(input.readTimeMinutes)
    ? Math.max(1, Math.round(Number(input.readTimeMinutes)))
    : existing?.readTimeMinutes ?? 5

  const tags = sanitizeTags(input.tags ?? existing?.tags)

  const author = (input.author ?? existing?.author ?? "Content Team").trim()

  const providedSlug = input.slug ?? existing?.slug
  const slugBase = providedSlug && providedSlug.trim().length > 0 ? providedSlug : normalizeSlug(title)
  const slug = ensureUniqueSlug(slugBase, existing?.id)

  const createdAt = existing?.createdAt ?? new Date().toISOString()

  return {
    title,
    excerpt,
    content,
    slug,
    source,
    sourceUrl: sourceUrl || undefined,
    heroImage: heroImage || undefined,
    tags,
    readTimeMinutes,
    readTime: buildReadTime(readTimeMinutes),
    status,
    author,
    createdAt,
    updatedAt: new Date().toISOString(),
  }
}

export function getAllPosts(): BlogPost[] {
  return [...postStore].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return postStore.find((post) => post.slug === slug)
}

export function getPostById(id: number): BlogPost | undefined {
  return postStore.find((post) => post.id === id)
}

export function getPostSummaries(limit?: number): BlogPostSummary[] {
  const summaries = getAllPosts().map(({ content, ...summary }) => summary)
  if (typeof limit === "number") {
    return summaries.slice(0, limit)
  }
  return summaries
}

export function filterPosts(filters?: {
  tag?: string
  source?: PostSource
  status?: PostStatus
  search?: string
}): BlogPost[] {
  const { tag, source, status, search } = filters ?? {}
  const normalizedSearch = search?.toLowerCase().trim() ?? ""

  return getAllPosts().filter((post) => {
    const tagMatch = tag ? post.tags.includes(tag) : true
    const sourceMatch = source ? post.source === source : true
    const statusMatch = status ? post.status === status : true
    const searchMatch =
      normalizedSearch.length === 0 ||
      post.title.toLowerCase().includes(normalizedSearch) ||
      post.excerpt.toLowerCase().includes(normalizedSearch) ||
      post.tags.some((postTag) => postTag.toLowerCase().includes(normalizedSearch))

    return tagMatch && sourceMatch && statusMatch && searchMatch
  })
}

export function addPost(input: UpsertPostInput): BlogPost {
  const normalized = validateAndNormalizeInput(input)

  const newPost: BlogPost = {
    id: getNextId(),
    ...normalized,
  }

  postStore = [newPost, ...postStore]
  return newPost
}

export function updatePost(id: number, updates: UpsertPostInput): BlogPost | undefined {
  const existing = getPostById(id)
  if (!existing) return undefined

  const normalized = validateAndNormalizeInput(updates, existing)

  const updatedPost: BlogPost = {
    ...existing,
    ...normalized,
    id: existing.id,
  }

  postStore = postStore.map((post) => (post.id === id ? updatedPost : post))
  return updatedPost
}

export function removePost(id: number): boolean {
  const exists = postStore.some((post) => post.id === id)
  if (!exists) return false
  postStore = postStore.filter((post) => post.id !== id)
  return true
}

export function resetPosts() {
  postStore = [...initialPosts]
}
