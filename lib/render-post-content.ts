import { marked } from "marked"

marked.setOptions({ gfm: true, breaks: true })

export function renderPostContent(value: string): string {
  const result = marked.parse(value.trim())
  if (typeof result !== "string") {
    return value
  }
  return result
}
