import { expect, test } from "bun:test"

import { renderMarkdown } from "./markdown"

test("renders markdown formatting", () => {
  expect(renderMarkdown("**bold**")).toContain("<strong>bold</strong>")
})

test("strips <script> tags", () => {
  const html = renderMarkdown("hi\n\n<script>alert(1)</script>")
  expect(html).not.toContain("<script")
})

test("drops javascript: link schemes", () => {
  const html = renderMarkdown("[x](javascript:alert(1))")
  expect(html).not.toContain("javascript:")
})

test("forces rel=noopener on target=_blank links", () => {
  const html = renderMarkdown('<a href="https://example.com" target="_blank">link</a>')
  expect(html).toContain('target="_blank"')
  expect(html).toContain("noopener")
})
