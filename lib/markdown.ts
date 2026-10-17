import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import type { Faq, Source } from "./types";

// architecture.md §7.4 step 4: Markdown → sanitised HTML with a fixed allowlist.
const ALLOWED_TAGS = ["h2", "h3", "p", "ul", "ol", "li", "a", "strong", "em", "table", "thead", "tbody", "tr", "th", "td", "blockquote", "figure", "figcaption", "img", "br", "hr", "code"];

export function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false, gfm: true }) as string;
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["scope"],
      td: ["colspan"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const external = /^https?:\/\//i.test(href) && !href.includes("ayurvedachalam.com");
        return { tagName, attribs: external ? { ...attribs, rel: "noopener", target: "_blank" } : attribs };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
  });
}

/** Minimal front matter parser: `key: value`, `key: [a, b]`, quoted strings. */
export function splitFrontMatter(raw: string): { meta: Record<string, unknown>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!mm) continue;
    let v: unknown = mm[2].replace(/\s+#.*$/, "").trim();
    const s = String(v);
    if (s.startsWith("[") && s.endsWith("]")) v = s.slice(1, -1).split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    else if (/^(["']).*\1$/.test(s)) v = s.slice(1, -1);
    else if (s === "null") v = null;
    else if (s === "true") v = true;
    else if (s === "false") v = false;
    meta[mm[1]] = v;
  }
  return { meta, body: m[2] };
}

/** Pull "**Q?**\nA" pairs out of a "## Frequently asked questions" section. */
export function extractFaqs(md: string): Faq[] {
  const sec = md.split(/(?:^|\n)## Frequently asked questions\s*\n/i)[1];
  if (!sec) return [];
  const block = sec.split(/\n---|\n## /)[0];
  const out: Faq[] = [];
  const re = /\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\*\*|\s*$)/g;
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(block))) out.push({ q: mm[1].trim(), a: mm[2].trim() });
  return out;
}

/** Pull "- Publisher, [Title](url) — note" lines out of a "## Sources" section. */
export function extractSources(md: string): Source[] {
  const sec = md.split(/(?:^|\n)## Sources\s*\n/i)[1];
  if (!sec) return [];
  const block = sec.split(/\n---|\n## /)[0];
  const out: Source[] = [];
  const accessed = (block.match(/accessed (\d{1,2} \w+ \d{4})/i) || [])[1];
  for (const line of block.split("\n")) {
    const mm = line.match(/^- (?:(.+?),\s*)?\[(.+?)\]\((https?:\/\/[^)]+)\)/);
    if (mm) out.push({ publisher: mm[1]?.trim(), title: mm[2].trim(), url: mm[3].trim(), accessed });
  }
  return out;
}

export function wordCount(md: string): number {
  return md.replace(/[#*_>`\[\]()|-]/g, " ").split(/\s+/).filter(Boolean).length;
}
