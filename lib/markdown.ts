import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/**
 * Render post markdown to sanitized HTML.
 *
 * `marked` passes raw HTML through untouched, so its output must never hit
 * `dangerouslySetInnerHTML` without sanitization - even though authoring is
 * admin-only, the draft/MCP API is another entry point. Runs in both the RSC
 * (server) and the editor preview (client).
 *
 * Uses `sanitize-html` (pure JS, htmlparser2-based) rather than a DOMPurify that
 * needs `jsdom` on the server - jsdom breaks under Next's serverless bundling.
 *
 * TODO(phase5): add Shiki syntax highlighting for fenced code blocks. Shiki is
 * async, so `renderMarkdown` becomes async and the post page + editor preview
 * both need updating - do it when the post render path is built.
 */
const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'img'],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    code: ['class'], // language-* classes, for the Shiki pass
    span: ['class', 'style'], // Shiki emits styled spans
    pre: ['class', 'style', 'tabindex'],
  },
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
};

export function renderMarkdown(md: string): string {
  const rawHtml = marked.parse(md, { async: false }) as string;
  return sanitizeHtml(rawHtml, SANITIZE);
}
