import { Marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import type { Highlighter } from 'shiki';

/**
 * Rich markdown render for the **post page** - same pipeline as `renderMarkdown`
 * (marked + sanitize-html) but fenced code blocks go through Shiki first. Async
 * (Shiki is), so the editor preview keeps using the sync `renderMarkdown`.
 *
 * Dual-theme: Shiki emits `color` + `--shiki-dark` on each span; `globals.css`
 * swaps to the dark value under `.dark`.
 */

const LANGS = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'json',
  'bash',
  'shell',
  'rust',
  'python',
  'cpp',
  'c',
  'go',
  'sql',
  'html',
  'css',
  'yaml',
  'markdown',
  'diff',
] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then((shiki) =>
      shiki.createHighlighter({
        themes: ['github-light-high-contrast', 'github-dark-high-contrast'],
        langs: [...LANGS],
      })
    );
  }
  return highlighterPromise;
}

// Shiki emits inline styles + custom props on pre/code/span - allow them through.
const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'img'],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    code: ['class', 'style'],
    span: ['class', 'style'],
    pre: ['class', 'style', 'tabindex'],
  },
  allowedStyles: {
    '*': {
      color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/, /^var\(/],
      'background-color': [/^#[0-9a-fA-F]{3,8}$/, /^var\(/],
      'font-style': [/^(italic|normal)$/],
      'font-weight': [/^(bold|normal|\d{3})$/],
      '--shiki-dark': [/^#[0-9a-fA-F]{3,8}$/],
      '--shiki-dark-bg': [/^#[0-9a-fA-F]{3,8}$/],
    },
  },
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
};

export async function renderMarkdownRich(md: string): Promise<string> {
  const hl = await getHighlighter();
  const loaded = new Set(hl.getLoadedLanguages());

  const marked = new Marked({
    async: true,
    walkTokens(token) {
      if (token.type !== 'code') return;
      const lang = (token.lang || '').trim().toLowerCase();
      const useLang = lang && loaded.has(lang) ? lang : 'text';
      token.escaped = true;
      // Shiki returns a complete <pre class="shiki">…</pre>.
      token.text = hl.codeToHtml(token.text, {
        lang: useLang,
        themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
        defaultColor: 'light',
      });
    },
    renderer: {
      // The token text is already a full <pre> - emit it as-is, no <pre><code> wrap.
      code({ text }) {
        return text;
      },
    },
  });

  const raw = await marked.parse(md);
  return sanitizeHtml(raw, SANITIZE);
}
