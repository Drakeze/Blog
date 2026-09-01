import { marked } from "marked"
import DOMPurify from "isomorphic-dompurify"

/**
 * Render post markdown to sanitized HTML.
 *
 * `marked` passes raw HTML through untouched, so its output must never hit
 * `dangerouslySetInnerHTML` without sanitization — even though authoring is
 * admin-only, there's no CSP enforced yet and the draft API is another entry
 * point. Runs in both the RSC (server) and the editor preview (client) via
 * isomorphic-dompurify.
 */
export function renderMarkdown(md: string): string {
  const rawHtml = marked.parse(md, { async: false }) as string
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ["target"], // allow links opened in a new tab
  })
}
