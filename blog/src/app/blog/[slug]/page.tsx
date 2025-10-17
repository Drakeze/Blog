"use client";

import Link from 'next/link';
import { notFound } from 'next/navigation';

// Sample blog posts data - in a real app, this would come from a CMS or API
const allPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    excerpt: "Learn how to build modern web applications with the latest features in Next.js 15, including improved performance and developer experience.",
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
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Tutorial",
    slug: "getting-started-nextjs-15",
    tags: ["nextjs", "react", "tutorial"],
    author: "John Doe"
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS for Modern UI",
    excerpt: "Discover advanced Tailwind CSS techniques to create beautiful, responsive user interfaces with utility-first CSS framework.",
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
    date: "2024-01-10",
    readTime: "8 min read",
    category: "Design",
    slug: "mastering-tailwind-css",
    tags: ["tailwind", "css", "design"],
    author: "Jane Smith"
  },
  {
    id: 3,
    title: "Building Scalable React Applications",
    excerpt: "Best practices and patterns for building large-scale React applications that are maintainable and performant.",
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
    date: "2024-01-05",
    readTime: "12 min read",
    category: "Development",
    slug: "scalable-react-applications",
    tags: ["react", "architecture", "development"],
    author: "Mike Johnson"
  },
  {
    id: 4,
    title: "TypeScript Best Practices in 2024",
    excerpt: "Essential TypeScript patterns and practices that every developer should know for writing better, more maintainable code.",
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
    date: "2024-01-01",
    readTime: "10 min read",
    category: "Development",
    slug: "typescript-best-practices-2024",
    tags: ["typescript", "javascript", "development"],
    author: "Sarah Wilson"
  },
  {
    id: 5,
    title: "Modern CSS Grid Layouts",
    excerpt: "Master CSS Grid to create complex, responsive layouts with ease. Learn the fundamentals and advanced techniques.",
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
    date: "2023-12-28",
    readTime: "7 min read",
    category: "Design",
    slug: "modern-css-grid-layouts",
    tags: ["css", "grid", "layout"],
    author: "Alex Chen"
  },
  {
    id: 6,
    title: "API Design with Node.js and Express",
    excerpt: "Learn how to design and build robust RESTful APIs using Node.js and Express with best practices and security considerations.",
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
    date: "2023-12-20",
    readTime: "15 min read",
    category: "Backend",
    slug: "api-design-nodejs-express",
    tags: ["nodejs", "express", "api"],
    author: "David Brown"
  }
];

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Find index of current post for navigation
  const postIndex = allPosts.findIndex(p => p.slug === params.slug);
  const previousPost = allPosts[postIndex - 1];
  const nextPost = allPosts[postIndex + 1];

  // Get current URL for share links
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-700">
          <li>
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <Link href="/blog" className="hover:text-gray-700 transition-colors">
              Blog
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li className="text-gray-900 font-medium truncate">
            {post.title}
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <div className="mb-4">
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
            {post.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700 border-b border-gray-200 pb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-semibold">
                {post.author?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author}</p>
              <p className="text-gray-700">Author</p>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-900">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-gray-700">Published</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">{post.readTime}</p>
            <p className="text-gray-700">Read time</p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{
          '--tw-prose-body': 'rgb(55 65 81)',
          '--tw-prose-headings': 'rgb(17 24 39)',
          '--tw-prose-links': 'rgb(37 99 235)',
          '--tw-prose-bold': 'rgb(17 24 39)',
          '--tw-prose-counters': 'rgb(107 114 128)',
          '--tw-prose-bullets': 'rgb(209 213 219)',
          '--tw-prose-hr': 'rgb(229 231 235)',
          '--tw-prose-quotes': 'rgb(17 24 39)',
          '--tw-prose-quote-borders': 'rgb(229 231 235)',
          '--tw-prose-captions': 'rgb(107 114 128)',
          '--tw-prose-code': 'rgb(17 24 39)',
          '--tw-prose-pre-code': 'rgb(229 231 235)',
          '--tw-prose-pre-bg': 'rgb(17 24 39)',
          '--tw-prose-th-borders': 'rgb(209 213 219)',
          '--tw-prose-td-borders': 'rgb(229 231 235)',
        } as React.CSSProperties}
      />

      {/* Tags */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex justify-between items-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <div className="text-right">
            <p className="text-sm text-gray-700 mb-1">Share this article</p>
            <div className="flex space-x-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <span className="sr-only">Share on Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                <span className="sr-only">Share on LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-12 text-sm">
          {previousPost && (
            <Link href={`/blog/${previousPost.slug}`} className="text-blue-600 hover:underline">
              ← {previousPost.title}
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className="text-blue-600 hover:underline ml-auto">
              {nextPost.title} →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
