import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown, extractFaqs, splitFrontMatter } from "../lib/markdown";

test("markdown is sanitised", () => {
  const html = renderMarkdown("## Hi\n\n<script>alert(1)</script><p onclick=\"x\">a</p>\n\n[ext](https://example.org)");
  assert.ok(!html.includes("<script"));
  assert.ok(!html.includes("onclick"));
  assert.ok(html.includes('rel="noopener"'));
});
test("front matter and FAQs parse", () => {
  const { meta, body } = splitFrontMatter('---\nslug: /learn/x/\nlinter_allow: ["cure", "Dr."]\n---\n## Frequently asked questions\n\n**Is it legal?**\nYes.\n\n**Is it covered?**\nUsually not.\n');
  assert.equal(meta.slug, "/learn/x/");
  assert.deepEqual(meta.linter_allow, ["cure", "Dr."]);
  assert.equal(extractFaqs(body).length, 2);
});
