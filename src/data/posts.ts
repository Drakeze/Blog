export type PostStatus = 'draft' | 'published';

export interface SocialLinks {
  reddit?: string;
  twitter?: string;
  linkedin?: string;
  patreon?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  updatedAt?: string;
  readTime: string;
  readTimeMinutes: number;
  category: string;
  slug: string;
  tags: string[];
  author: string;
  originalUrl: string;
  socialLinks?: SocialLinks;
  status: PostStatus;
}

export type BlogPostSummary = Omit<BlogPost, 'content'>;

type UpsertPostInput = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  readTimeMinutes: number;
  date?: string;
  socialLinks?: SocialLinks;
  status?: PostStatus;
  slug?: string;
  originalUrl?: string;
};

const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Getting Started with Next.js 15',
    excerpt:
      'Learn how to build modern web applications with the latest features in Next.js 15, including improved performance and developer experience.',
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
    date: '2024-01-15',
    updatedAt: '2024-01-18',
    readTime: '5 min read',
    readTimeMinutes: 5,
    category: 'Tutorial',
    slug: 'getting-started-nextjs-15',
    tags: ['nextjs', 'react', 'tutorial'],
    author: 'John Doe',
    originalUrl: 'https://yourblog.com/getting-started-nextjs-15',
    socialLinks: {
      reddit: 'https://reddit.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
      patreon: 'https://patreon.com/',
    },
    status: 'published',
  },
  {
    id: 2,
    title: 'Mastering Tailwind CSS for Modern UI',
    excerpt:
      'Discover advanced Tailwind CSS techniques to create beautiful, responsive user interfaces with utility-first CSS framework.',
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
    date: '2024-01-10',
    updatedAt: '2024-01-12',
    readTime: '8 min read',
    readTimeMinutes: 8,
    category: 'Design',
    slug: 'mastering-tailwind-css',
    tags: ['tailwind', 'css', 'design'],
    author: 'Jane Smith',
    originalUrl: 'https://yourblog.com/mastering-tailwind-css',
    socialLinks: {
      reddit: 'https://reddit.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
      patreon: 'https://patreon.com/',
    },
    status: 'published',
  },
  {
    id: 3,
    title: 'Building Scalable React Applications',
    excerpt:
      'Best practices and patterns for building large-scale React applications that are maintainable and performant.',
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
    date: '2024-01-05',
    updatedAt: '2024-01-07',
    readTime: '12 min read',
    readTimeMinutes: 12,
    category: 'Development',
    slug: 'scalable-react-applications',
    tags: ['react', 'architecture', 'development'],
    author: 'Mike Johnson',
    originalUrl: 'https://yourblog.com/scalable-react-applications',
    socialLinks: {
      reddit: 'https://reddit.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
      patreon: 'https://patreon.com/',
    },
    status: 'draft',
  },
  {
    id: 4,
    title: 'TypeScript Best Practices in 2024',
    excerpt:
      'Essential TypeScript patterns and practices that every developer should know for writing better, more maintainable code.',
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
    date: '2024-01-01',
    updatedAt: '2024-01-02',
    readTime: '10 min read',
    readTimeMinutes: 10,
    category: 'Development',
    slug: 'typescript-best-practices-2024',
    tags: ['typescript', 'javascript', 'development'],
    author: 'Sarah Wilson',
    originalUrl: 'https://yourblog.com/typescript-best-practices-2024',
    socialLinks: {
      reddit: 'https://reddit.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
      patreon: 'https://patreon.com/',
    },
    status: 'published',
  },
  {
    id: 5,
    title: 'Modern CSS Grid Layouts',
    excerpt:
      'Master CSS Grid to create complex, responsive layouts with ease. Learn the fundamentals and advanced techniques.',
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
    date: '2023-12-28',
    updatedAt: '2023-12-28',
    readTime: '7 min read',
    readTimeMinutes: 7,
    category: 'Design',
    slug: 'modern-css-grid-layouts',
    tags: ['css', 'grid', 'layout'],
    author: 'Alex Chen',
    originalUrl: 'https://yourblog.com/modern-css-grid-layouts',
    socialLinks: {
      reddit: 'https://reddit.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
      patreon: 'https://patreon.com/',
    },
    status: 'draft',
  },
  {
    id: 6,
    title: 'API Design with Node.js and Express',
    excerpt:
      'Learn how to design and build robust RESTful APIs using Node.js and Express with best practices and security considerations.',
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
    date: '2023-12-20',
    updatedAt: '2023-12-22',
    readTime: '15 min read',
    readTimeMinutes: 15,
    category: 'Backend',
    slug: 'api-design-nodejs-express',
    tags: ['nodejs', 'express', 'api'],
    author: 'David Brown',
    originalUrl: 'https://yourblog.com/api-design-nodejs-express',
    socialLinks: {
      reddit: 'https://reddit.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
      patreon: 'https://patreon.com/',
    },
    status: 'published',
  },
];

let postStore: BlogPost[] = [...initialPosts];

const STATUS_VALUES: PostStatus[] = ['draft', 'published'];

function normalizeSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function buildReadTime(minutes?: number) {
  if (!minutes || Number.isNaN(minutes)) return '5 min read';
  return `${Math.max(1, Math.round(minutes))} min read`;
}

function getNextId() {
  return postStore.reduce((max, post) => Math.max(max, post.id), 0) + 1;
}

export function getAllPosts(): BlogPost[] {
  return [...postStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return postStore.find((post) => post.slug === slug);
}

export function getPostById(id: number): BlogPost | undefined {
  return postStore.find((post) => post.id === id);
}

export function getPostSummaries(limit?: number): BlogPostSummary[] {
  const summaries = getAllPosts()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ content, ...summary }) => summary);
  if (typeof limit === 'number') {
    return summaries.slice(0, limit);
  }
  return summaries;
}

export function filterPosts(filters?: {
  tag?: string;
  readTimeMinutes?: number;
  date?: string;
  status?: PostStatus;
}): BlogPost[] {
  const { tag, readTimeMinutes, date, status } = filters ?? {};
  return getAllPosts().filter((post) => {
    const tagMatch = tag ? post.tags.includes(tag) : true;
    const readTimeMatch =
      typeof readTimeMinutes === 'number' ? post.readTimeMinutes <= readTimeMinutes : true;
    const dateMatch = date ? post.date.startsWith(date) : true;
    const statusMatch = status ? post.status === status : true;
    return tagMatch && readTimeMatch && dateMatch && statusMatch;
  });
}

export function addPost(input: UpsertPostInput): BlogPost {
  const now = new Date().toISOString();
  const status: PostStatus = STATUS_VALUES.includes(input.status ?? 'draft')
    ? (input.status ?? 'draft')
    : 'draft';
  const slug = input.slug ? normalizeSlug(input.slug) : normalizeSlug(input.title);
  const readTimeMinutes = Math.max(1, Math.round(input.readTimeMinutes ?? 5));

  const newPost: BlogPost = {
    id: getNextId(),
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    date: input.date ?? now,
    updatedAt: now,
    readTimeMinutes,
    readTime: buildReadTime(readTimeMinutes),
    category: input.category,
    slug,
    tags: input.tags,
    author: input.author,
    originalUrl: input.originalUrl ?? `https://example.com/blog/${slug}`,
    socialLinks: input.socialLinks,
    status,
  };

  postStore = [newPost, ...postStore];
  return newPost;
}

export function updatePost(id: number, updates: Partial<UpsertPostInput>): BlogPost | undefined {
  const existing = getPostById(id);
  if (!existing) return undefined;

  const merged = {
    ...existing,
    ...updates,
  } satisfies Partial<BlogPost>;

  const status: PostStatus =
    updates.status && STATUS_VALUES.includes(updates.status) ? updates.status : existing.status;
  const readTimeMinutes = updates.readTimeMinutes ?? existing.readTimeMinutes;
  const slug = updates.slug ? normalizeSlug(updates.slug) : existing.slug;

  const updatedPost: BlogPost = {
    ...existing,
    ...merged,
    status,
    slug,
    readTimeMinutes: Math.max(1, Math.round(readTimeMinutes)),
    readTime: buildReadTime(readTimeMinutes),
    updatedAt: new Date().toISOString(),
    tags: updates.tags ?? existing.tags,
    socialLinks: updates.socialLinks ?? existing.socialLinks,
  };

  postStore = postStore.map((post) => (post.id === id ? updatedPost : post));
  return updatedPost;
}

export function removePost(id: number): boolean {
  const exists = postStore.some((post) => post.id === id);
  if (!exists) return false;
  postStore = postStore.filter((post) => post.id !== id);
  return true;
}

export function resetPosts() {
  postStore = [...initialPosts];
}
