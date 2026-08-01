#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const BASE_URL = process.env.BLOG_API_BASE_URL ?? "http://localhost:3000"
const API_KEY = process.env.BLOG_API_KEY

if (!API_KEY) {
  console.error("BLOG_API_KEY is required (set it in the MCP server's env config).")
  process.exit(1)
}

async function callApi(path: string, init: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body && !(init.body instanceof FormData) ? { "content-type": "application/json" } : {}),
      authorization: `Bearer ${API_KEY}`,
      ...init.headers,
    },
  })
  const text = await res.text()
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    body = text
  }
  if (!res.ok) {
    throw new Error(`Blog API ${res.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`)
  }
  return body
}

function toolResult(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] }
}

const server = new McpServer({ name: "blog-mcp-server", version: "0.1.0" })

server.registerTool(
  "list_posts",
  {
    description: "List blog posts. Pass status='all' to include drafts.",
    inputSchema: {
      status: z.enum(["all", "published", "draft"]).optional(),
      tag: z.string().optional(),
      page: z.number().int().positive().optional(),
      limit: z.number().int().positive().max(100).optional(),
    },
  },
  async ({ status, tag, page, limit }) => {
    const params = new URLSearchParams()
    if (status) params.set("status", status)
    if (tag) params.set("tag", tag)
    if (page) params.set("page", String(page))
    if (limit) params.set("limit", String(limit))
    return toolResult(await callApi(`/api/posts?${params.toString()}`))
  },
)

server.registerTool(
  "get_post",
  {
    description: "Get a single post by slug, including drafts.",
    inputSchema: { slug: z.string() },
  },
  async ({ slug }) => toolResult(await callApi(`/api/posts/${encodeURIComponent(slug)}`)),
)

server.registerTool(
  "create_draft_post",
  {
    description: "Create a new draft post.",
    inputSchema: {
      title: z.string(),
      content: z.string(),
      excerpt: z.string().optional(),
      coverImage: z.string().optional(),
      tags: z.array(z.string()).optional(),
      authorName: z.string().optional(),
    },
  },
  async ({ title, content, excerpt, coverImage, tags, authorName }) =>
    toolResult(
      await callApi("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt ?? content.replace(/[#*`[\]]/g, "").slice(0, 160).trim(),
          coverImage,
          tags,
          authorName,
          status: "draft",
        }),
      }),
    ),
)

server.registerTool(
  "update_post",
  {
    description: "Update fields on an existing post (identified by its current slug).",
    inputSchema: {
      slug: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      coverImage: z.string().optional(),
      tags: z.array(z.string()).optional(),
    },
  },
  async ({ slug, ...updates }) =>
    toolResult(
      await callApi(`/api/posts/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    ),
)

server.registerTool(
  "publish_post",
  {
    description: "Publish a draft post by slug.",
    inputSchema: { slug: z.string() },
  },
  async ({ slug }) =>
    toolResult(
      await callApi(`/api/posts/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "published" }),
      }),
    ),
)

server.registerTool(
  "delete_post",
  {
    description: "Permanently delete a post by slug.",
    inputSchema: { slug: z.string() },
  },
  async ({ slug }) => toolResult(await callApi(`/api/posts/${encodeURIComponent(slug)}`, { method: "DELETE" })),
)

server.registerTool(
  "list_comments",
  {
    description: "List comments for a post.",
    inputSchema: { postId: z.string() },
  },
  async ({ postId }) => toolResult(await callApi(`/api/comments?postId=${encodeURIComponent(postId)}`)),
)

server.registerTool(
  "delete_comment",
  {
    description: "Delete (moderate) a comment by id. Cascades to its replies.",
    inputSchema: { id: z.string() },
  },
  async ({ id }) => toolResult(await callApi(`/api/comments/${encodeURIComponent(id)}`, { method: "DELETE" })),
)

server.registerTool(
  "list_subscribers",
  { description: "List all newsletter subscribers.", inputSchema: {} },
  async () => toolResult(await callApi("/api/subscribers")),
)

server.registerTool(
  "upload_image",
  {
    description: "Upload an image (base64-encoded) to R2 and get back its public URL.",
    inputSchema: {
      filename: z.string(),
      contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]),
      base64Data: z.string().describe("Raw base64 file content, no data: prefix"),
    },
  },
  async ({ filename, contentType, base64Data }) => {
    const bytes = Buffer.from(base64Data, "base64")
    const formData = new FormData()
    formData.append("file", new Blob([bytes], { type: contentType }), filename)
    return toolResult(await callApi("/api/upload", { method: "POST", body: formData }))
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
