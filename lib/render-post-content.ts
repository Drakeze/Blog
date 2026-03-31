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

export function renderPostContent(value: string) {
  const normalized = value.trim().replace(/\r\n/g, "\n")
  if (!normalized) {
    return ""
  }

  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${renderInlineContent(paragraph.trim())}</p>`)
    .join("")
}
