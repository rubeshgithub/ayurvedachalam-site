/**
 * B-06 — Import the page map and article drafts.
 *
 *   npm run seed            → writes content/seed/pages.json and articles.json
 *   MONGODB_URI=… npm run seed → also upserts into MongoDB (never overwrites a page
 *                              whose status is not "draft", so edits in the CMS survive).
 *
 * Source of truth for slugs, titles, H1s and keywords: content/seed/page-map.xlsx
 * (a copy of Ayurvedachalam_100_Page_SEO_Map.xlsx). Article drafts:
 * content/learn/<slug>.md with YAML-ish front matter.
 */
import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";
import type { Article, Page, PageTemplate } from "../lib/types";
import { renderMarkdown, extractFaqs, extractSources, splitFrontMatter, wordCount } from "../lib/markdown";

const ROOT = process.cwd();
const SEED = path.join(ROOT, "content", "seed");

function templateFor(slug: string, section: string): PageTemplate {
  if (slug === "/") return "home";
  if (slug === "/learn/") return "article-index";
  if (slug === "/about/practitioner/") return "profile";
  if (slug === "/pricing/" || slug === "/prices/") return "pricing";
  if (slug === "/book/") return "booking";
  if (slug === "/contact/") return "contact";
  if (slug.startsWith("/calgary/")) return "location";
  if (slug.startsWith("/online/")) return "region";
  if (slug.startsWith("/concerns/") && slug !== "/concerns/") return "concern";
  if (/^\/(privacy|terms|health-disclaimer|cancellation|accessibility)[^/]*\/$/.test(slug) || section.toLowerCase().startsWith("polic")) return "legal";
  const depth = slug.split("/").filter(Boolean).length;
  if (["/consultations/", "/therapies/", "/spiritual-healing/", "/concerns/", "/massage-therapy/"].includes(slug)) return "hub";
  if (depth === 2 && /^\/(consultations|therapies|spiritual-healing|massage-therapy)\//.test(slug)) return "service";
  return "utility";
}

function sectionKey(slug: string, sectionLabel: string): string {
  const first = slug.split("/").filter(Boolean)[0];
  if (!first) return "core";
  if (["consultations", "therapies", "spiritual-healing", "massage-therapy", "concerns", "calgary", "online", "learn"].includes(first)) return first;
  if (sectionLabel.toLowerCase().startsWith("polic")) return "policies";
  return "core";
}

const articleMap: { map_row: number; slug: string; title_tag: string; h1: string; primary_keyword: string; wave: string }[] = [];

function readMap(): Page[] {
  const wb = XLSX.readFile(path.join(SEED, "page-map.xlsx"));
  const ws = wb.Sheets["Page Map"];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
  const pages: Page[] = [];
  for (const r of rows) {
    const n = Number(r["#"]);
    const slug = String(r["URL slug"] ?? "").trim();
    if (!n || !slug.startsWith("/")) continue;
    const sectionLabel = String(r["Section"] ?? "");
    // /learn/* rows (except the hub and the quiz) are articles: they arrive through the
    // pipeline (tasks.md §8) and live in `articles`, not `pages`.
    if (slug.startsWith("/learn/") && slug !== "/learn/" && slug !== "/learn/dosha-quiz/") {
      articleMap.push({ map_row: n, slug, title_tag: String(r["Title tag"] ?? "").trim(), h1: String(r["H1 headline"] ?? "").trim(), primary_keyword: String(r["Primary keyword"] ?? "").trim(), wave: String(r["Wave"] ?? "").trim() });
      continue;
    }
    const section = sectionKey(slug, sectionLabel);
    const waveRaw = String(r["Wave"] ?? "").trim();
    const wave: number | "A" = waveRaw === "A" ? "A" : Number(waveRaw) || 3;
    const secondary = String(r["Secondary keywords"] ?? "").split(";").map((s) => s.trim()).filter(Boolean);
    pages.push({
      slug,
      template: templateFor(slug, sectionLabel),
      section,
      wave,
      title_tag: String(r["Title tag"] ?? "").trim(),
      meta_description: "",
      h1: String(r["H1 headline"] ?? "").trim(),
      primary_keyword: String(r["Primary keyword"] ?? "").trim() || undefined,
      secondary_keywords: secondary,
      status: "draft",
      map_row: n,
      legal_check: /legal check/i.test(String(r["Notes"] ?? "")),
    });
  }
  return pages;
}

function readArticles(): Article[] {
  const dir = path.join(ROOT, "content", "learn");
  if (!fs.existsSync(dir)) return [];
  const out: Article[] = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const { meta, body } = splitFrontMatter(raw);
    const published = body.split(/\n## Editor/)[0]; // editor's notes are never published
    const bodyNoH1 = published.replace(/^#\s.*\n/m, "").replace(/^\*By .*\n/m, "");
    const faqs = extractFaqs(bodyNoH1);
    const sources = extractSources(bodyNoH1);
    const bodyMd = bodyNoH1.split(/\n## Sources/)[0].split(/\n## Frequently asked questions/)[0].trim();
    const slugFull = String(meta.slug ?? `/learn/${f.replace(/\.md$/, "")}/`);
    const slug = slugFull.replace(/^\/learn\//, "").replace(/\/$/, "");
    const wc = wordCount(bodyMd);
    out.push({
      slug,
      kind: "cornerstone",
      category: (String(meta.category ?? "practice-and-trust") === "trust" ? "practice-and-trust" : String(meta.category)) as Article["category"],
      tags: [],
      title_tag: String(meta.title_tag ?? meta.h1 ?? ""),
      meta_description: String(meta.meta_description ?? ""),
      h1: String(meta.h1 ?? ""),
      excerpt: String(meta.meta_description ?? ""),
      primary_keyword: meta.primary_keyword ? String(meta.primary_keyword) : undefined,
      secondary_keywords: Array.isArray(meta.secondary_keywords) ? (meta.secondary_keywords as string[]) : [],
      body_md: bodyMd,
      body_html: renderMarkdown(bodyMd),
      faqs,
      sources,
      internal_links: meta.links_to_service ? [String(meta.links_to_service), "/book/"] : ["/book/"],
      author_id: "practitioner",
      reviewed_at: null,
      status: String(meta.status ?? "").startsWith("draft") ? "review" : "published",
      publish_at: null,
      published_at: null,
      updated_at: String(meta.drafted ?? new Date().toISOString().slice(0, 10)),
      origin: "manual",
      word_count: wc,
      reading_minutes: Math.max(1, Math.round(wc / 220)),
      linter_allow: Array.isArray(meta.linter_allow) ? (meta.linter_allow as string[]) : [],
    });
  }
  return out;
}

async function main() {
  const pages = readMap();
  const articles = readArticles();
  fs.writeFileSync(path.join(SEED, "pages.json"), JSON.stringify(pages, null, 2));
  fs.writeFileSync(path.join(SEED, "articles.json"), JSON.stringify(articles, null, 2));
  fs.writeFileSync(path.join(SEED, "article-map.json"), JSON.stringify(articleMap, null, 2));
  console.log(`seed: ${pages.length} pages, ${articles.length} articles, ${articleMap.length} mapped article slugs → content/seed/`);

  if (process.env.MONGODB_URI) {
    const { getDb, ensureIndexes } = await import("../lib/db");
    const db = await getDb();
    await ensureIndexes();
    let inserted = 0, skipped = 0;
    for (const p of pages) {
      const existing = await db.collection("pages").findOne({ slug: p.slug });
      if (existing && existing.status !== "draft") { skipped++; continue; }
      await db.collection("pages").updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
      inserted++;
    }
    for (const a of articles) {
      const existing = await db.collection("articles").findOne({ slug: a.slug });
      if (existing && !["draft", "review"].includes(existing.status)) continue;
      await db.collection("articles").updateOne({ slug: a.slug }, { $set: a }, { upsert: true });
    }
    const settings = JSON.parse(fs.readFileSync(path.join(SEED, "settings.json"), "utf8"));
    if (!(await db.collection("settings").findOne({}))) await db.collection("settings").insertOne(settings);
    for (const au of JSON.parse(fs.readFileSync(path.join(SEED, "authors.json"), "utf8"))) {
      await db.collection("authors").updateOne({ id: au.id }, { $setOnInsert: au }, { upsert: true });
    }
    console.log(`mongo: ${inserted} pages upserted, ${skipped} kept (not draft)`);
    process.exit(0);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
