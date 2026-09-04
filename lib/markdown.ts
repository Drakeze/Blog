import { marked } from "marked"
import sanitizeHtml from "sanitize-html"

/**
 * Render post markdown to sanitized HTML.
 *
 * `marked` passes raw HTML through untouched, so its output must never hit
 * `dangerouslySetInnerHTML` without sanitization — even though authoring is
 * admin-only, there's no CSP enforced yet and the draft API is another entry
 * point. Runs in both the RSC (server) and the editor preview (client).
 *
 * Uses `sanitize-html` (pure JS, htmlparser2-based) rather than a DOMPurify
 * that needs `jsdom` on the server — jsdom breaks under Next's serverless
 * bundling.
 */
const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "h1", "h2", "img"],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    code: ["class"], // language-* classes, if a highlighter is added later
    span: ["class"],
  },
  transformTags: {
    // keep the "open in a new tab" behaviour the old ADD_ATTR:["target"]
    // allowed, but force the safe rel pairing
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
}

export function renderMarkdown(md: string): string {
  const rawHtml = marked.parse(md, { async: false }) as string
  return sanitizeHtml(rawHtml, SANITIZE)
}
