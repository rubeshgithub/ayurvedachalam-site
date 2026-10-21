/** npm run lint:content — lints every seeded page and article (architecture.md §7.4; CI gate). */
import fs from "node:fs";
import path from "node:path";
import { lint } from "../lib/compliance/linter";
import type { Article, Page } from "../lib/types";

const seed = (n: string) => JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "seed", `${n}.json`), "utf8"));
const pages: Page[] = seed("pages");
const articles: Article[] = seed("articles");
// A link resolves when its target is in the page map or the article map: the whole wave publishes together.
const articleMap: { slug: string }[] = seed("article-map");
const known = new Set<string>([...pages.map((p) => p.slug), ...articles.map((a) => `/learn/${a.slug}/`), ...articleMap.map((a) => a.slug), "/", "/book/", "/learn/"]);
const keywords = new Map<string, string>();
let errors = 0;

for (const p of pages) {
  if (p.status === "draft" && !p.blocks?.length) continue; // skeleton rows from the map: nothing to lint yet
  const md = (p.blocks ?? []).map((b) => (b.type === "richtext" ? b.data.md : b.type === "intro" ? b.data.lead : b.type === "list" ? b.data.items.join("\n") : "")).join("\n");
  const r = lint({ ...p, body_md: md, internal_links: p.related, author_id: "practitioner" }, { kind: "page", existingKeywords: keywords, linkResolves: (h) => known.has(h) });
  if (p.primary_keyword) keywords.set(p.primary_keyword.toLowerCase(), p.slug);
  if (!r.passed) { errors++; console.log(`✗ ${p.slug}\n  ${r.errors.join("\n  ")}`); }
  if (r.warnings.length) console.log(`⚠ ${p.slug}\n  ${r.warnings.join("\n  ")}`);
}
for (const a of articles) {
  const r = lint({ ...a, slug: `/learn/${a.slug}/` }, { kind: "article", existingKeywords: keywords, linkResolves: (h) => known.has(h) });
  if (a.primary_keyword) keywords.set(a.primary_keyword.toLowerCase(), `/learn/${a.slug}/`);
  console.log(`${r.passed ? "✓" : "✗"} /learn/${a.slug}/`);
  if (r.errors.length) { errors++; console.log(`  errors:\n  ${r.errors.join("\n  ")}`); }
  if (r.warnings.length) console.log(`  warnings:\n  ${r.warnings.join("\n  ")}`);
}
console.log(errors ? `\n${errors} item(s) with errors` : "\nAll content passed the compliance linter");
process.exit(errors ? 1 : 0);
