import { marked } from "marked"

marked.setOptions({ gfm: true, breaks: true })

export function renderPostContent(value: string, stripLeadingTitle?: string): string {
  let content = value.trim()

  if (stripLeadingTitle) {
    const lines = content.split("\n")
    const firstNonEmptyIdx = lines.findIndex((l) => l.trim().length > 0)
    if (firstNonEmptyIdx >= 0) {
      const match = lines[firstNonEmptyIdx].trim().match(/^#{1,2}\s+(.+)$/)
      if (match && match[1].trim().toLowerCase() === stripLeadingTitle.trim().toLowerCase()) {
        lines.splice(firstNonEmptyIdx, 1)
        content = lines.join("\n").trim()
      }
    }
  }

  const result = marked.parse(content)
  if (typeof result !== "string") {
    return value
  }
  return result
}
