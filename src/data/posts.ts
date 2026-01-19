export type PostSource = "blog" | "reddit" | "twitter" | "linkedin" | "patreon"
export type PostStatus = "draft" | "published"

export const postSources: PostSource[] = ["blog", "reddit", "twitter", "linkedin", "patreon"]
export const postStatuses: PostStatus[] = ["draft", "published"]

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTimeMinutes: number
  readTime: string
  source: PostSource
  status: PostStatus
  slug: string
  createdAt: string
  updatedAt: string
  externalId?: string | null
  externalUrl?: string | null
  heroImage?: string | null
}

export type BlogPostSummary = Omit<BlogPost, "content">

export class PostValidationError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

export async function getAllPosts(_includeDrafts = false): Promise<BlogPost[]> {
  return []
}

export async function getPostBySlug(_slug: string, _includeDrafts = false): Promise<BlogPost | undefined> {
  return undefined
}

export async function getPostById(_id: string): Promise<BlogPost | undefined> {
  return undefined
}

export async function getPostSummaries(_limit?: number, _includeDrafts = false): Promise<BlogPostSummary[]> {
  return []
}

export async function filterPosts(
  _filters?: {
    tag?: string
    readTimeMinutes?: number
    createdAt?: string
    source?: PostSource
    status?: PostStatus
  },
  _includeDrafts = false,
): Promise<BlogPost[]> {
  return []
}

export async function addPost(_input: unknown): Promise<BlogPost> {
  throw new PostValidationError("Post creation is disabled.", 501)
}

export async function updatePost(_id: string, _updates: unknown): Promise<BlogPost | undefined> {
  return undefined
}

export async function removePost(_id: string): Promise<boolean> {
  return false
}

export async function upsertExternalPost(_input: unknown): Promise<BlogPost> {
  throw new PostValidationError("External post upserts are disabled.", 501)
}
