function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function isSafeExternalUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function renderInlineContent(value: string) {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/g
  let result = ""
  let lastIndex = 0

  for (const match of value.matchAll(pattern)) {
    const [fullMatch, markdownLabel, markdownUrl, rawUrl] = match
    const start = match.index ?? 0
    result += escapeHtml(value.slice(lastIndex, start))

    const url = markdownUrl ?? rawUrl
    const label = markdownLabel ?? rawUrl

    result +=
      url && isSafeExternalUrl(url)
        ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label ?? url)}</a>`
        : escapeHtml(fullMatch)

    lastIndex = start + fullMatch.length
  }

  result += escapeHtml(value.slice(lastIndex))
  return result.replace(/\n/g, "<br />")
}

function renderList(items: string[]) {
  const children = items
    .map((item) => item.replace(/^[-*]\s+/, ""))
    .map((item) => `<li>${renderInlineContent(item)}</li>`)
    .join("")

  return `<ul>${children}</ul>`
}

function renderBlock(block: string) {
  const trimmed = block.trim()
  if (!trimmed) {
    return ""
  }

  if (trimmed.startsWith("### ")) {
    return `<h3>${renderInlineContent(trimmed.slice(4))}</h3>`
  }

  if (trimmed.startsWith("## ")) {
    return `<h2>${renderInlineContent(trimmed.slice(3))}</h2>`
  }

  if (trimmed.startsWith("# ")) {
    return `<h1>${renderInlineContent(trimmed.slice(2))}</h1>`
  }

  if (trimmed.split("\n").every((line) => /^[-*]\s+/.test(line))) {
    return renderList(trimmed.split("\n"))
  }

  if (trimmed.startsWith("> ")) {
    return `<blockquote>${renderInlineContent(trimmed.replace(/^>\s+/gm, ""))}</blockquote>`
  }

  return `<p>${renderInlineContent(trimmed)}</p>`
}

export function renderPostContent(value: string) {
  const normalized = value.trim().replace(/\r\n/g, "\n")
  if (!normalized) {
    return ""
  }

  return normalized
    .split(/\n{2,}/)
    .map(renderBlock)
    .join("")
}
