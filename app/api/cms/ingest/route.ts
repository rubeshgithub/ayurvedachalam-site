import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDb, hasDb } from "@/lib/db";
import { allPrimaryKeywords, articleExists, getSettings, listArticles, pageExists } from "@/lib/content/repo";
import { lint, touchesLegalCheck } from "@/lib/compliance/linter";
import { renderMarkdown, wordCount } from "@/lib/markdown";
import { abs } from "@/lib/seo";
import { notifyOwner, previewLink } from "@/lib/notify";
import type { Article } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* architecture.md §7.3 payload schema 1 and §7.4 ingest steps. */

const Payload = z.object({
  schema: z.literal(1),
  run_id: z.string().min(3).max(64),
  kind: z.enum(["cornerstone", "feed"]),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: lowercase words joined by hyphens, no /learn/ prefix"),
  category: z.enum(["therapies", "calgary-wellness", "ayurveda-basics", "food-and-routine", "herbs-and-safety", "spiritual-healing", "practice-and-trust"]),
  tags: z.array(z.string()).max(10).default([]),
  title_tag: z.string().min(10).max(80),
  meta_description: z.string().min(40).max(200),
  h1: z.string().min(10).max(120),
  excerpt: z.string().max(200).optional(),
  primary_keyword: z.string().min(3),
  secondary_keywords: z.array(z.string()).default([]),
  body_md: z.string().min(1000),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  sources: z.array(z.object({ title: z.string(), url: z.string().url(), publisher: z.string().optional(), accessed: z.string().optional() })).default([]),
  internal_links: z.array(z.string()).default([]),
  hero_image: z.object({ src: z.string().optional(), brief: z.string().optional(), alt: z.string().optional() }).optional(),
  author: z.string().default("practitioner"),
  needs_human: z.boolean().default(false),
  linter_allow: z.array(z.string()).max(12).default([]),
});

const buckets = new Map<string, { n: number; reset: number }>();
function rateLimited(key: string, limit = 10): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) { buckets.set(key, { n: 1, reset: now + 3600_000 }); return false; }
  b.n += 1;
  return b.n > limit;
}

function keyOk(req: NextRequest): boolean {
  const expected = process.env.INGEST_KEY || "";
  const given = req.headers.get("x-ingest-key") || "";
  if (!expected || expected.length !== given.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(given));
}

export async function POST(req: NextRequest) {
  // 1. Authenticate + rate limit
  if (!keyOk(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  if (!hasDb()) return NextResponse.json({ error: "no_database", detail: "Ingest needs MONGODB_URI" }, { status: 503 });

  // 2. Validate shape
  const raw = await req.text();
  let parsed: z.infer<typeof Payload>;
  try {
    parsed = Payload.parse(JSON.parse(raw));
  } catch (e) {
    return NextResponse.json({ error: "invalid_payload", detail: e instanceof z.ZodError ? e.issues : String(e) }, { status: 422 });
  }

  const db = await getDb();
  const articles = db.collection<Article>("articles");
  const payload_hash = createHash("sha256").update(raw).digest("hex");
  const log = async (result: string, extra: Record<string, unknown> = {}) =>
    db.collection("ingest_log").insertOne({ run_id: parsed.run_id, slug: parsed.slug, result, created_at: new Date(), ...extra });

  // 3. Idempotency
  const same = await articles.findOne({ payload_hash });
  if (same) { await log("duplicate"); return NextResponse.json({ id: same.slug, status: same.status, preview_url: abs(`/learn/${same.slug}/`), duplicate: true }, { status: 200 }); }
  const existing = await articles.findOne({ slug: parsed.slug });
  if (existing) { await log("conflict"); return NextResponse.json({ error: "slug_exists", status: existing.status }, { status: 409 }); }

  // 4. Sanitise
  const body_html = renderMarkdown(parsed.body_md);

  // 5. Lint
  const [keywords, published] = await Promise.all([allPrimaryKeywords(), listArticles({ status: "published" })]);
  const resolves = new Map<string, boolean>();
  for (const l of parsed.internal_links) {
    resolves.set(l, l === "/" || l === "/book/" || l === "/learn/" || (l.startsWith("/learn/") ? await articleExists(l.replace(/^\/learn\//, "").replace(/\/$/, "")) : await pageExists(l)));
  }
  const existingSentences = new Set<string>();
  for (const a of published) for (const s of a.body_md.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/)) if (s.length > 20) existingSentences.add(s.trim().toLowerCase());
  const result = lint(
    { ...parsed, slug: `/learn/${parsed.slug}/`, author_id: parsed.author, hero_image: parsed.hero_image ?? null },
    { existingKeywords: keywords, linkResolves: (h) => resolves.get(h) ?? false, existingSentences, kind: "article" },
  );

  // 6. Store with status per §7.2
  const settings = await getSettings();
  const forceReview = !result.passed || parsed.needs_human || touchesLegalCheck(`/learn/${parsed.slug}/`, parsed.internal_links);
  let status: Article["status"] = "review";
  let publish_at: string | null = null;
  if (!forceReview) {
    if (settings.publish_mode === "immediate") status = "published";
    else if (settings.publish_mode === "timed") { status = "scheduled"; publish_at = new Date(Date.now() + settings.hold_hours * 3600_000).toISOString(); }
  }
  const wc = wordCount(parsed.body_md);
  const now = new Date().toISOString();
  const doc: Article = {
    slug: parsed.slug, kind: parsed.kind, category: parsed.category, tags: parsed.tags,
    title_tag: parsed.title_tag, meta_description: parsed.meta_description, h1: parsed.h1,
    excerpt: parsed.excerpt ?? parsed.meta_description, primary_keyword: parsed.primary_keyword, secondary_keywords: parsed.secondary_keywords,
    body_md: parsed.body_md, body_html, faqs: parsed.faqs, sources: parsed.sources, internal_links: parsed.internal_links,
    hero_image: parsed.hero_image, author_id: parsed.author, reviewed_by: null, reviewed_at: null,
    status, publish_at, published_at: status === "published" ? now : null, updated_at: now,
    origin: "pipeline", run_id: parsed.run_id, payload_hash, lint: result, word_count: wc, reading_minutes: Math.max(1, Math.round(wc / 220)),
    linter_allow: parsed.linter_allow,
  };
  await articles.insertOne(doc);
  await log(status, { lint: result, forced_review: forceReview });
  const cms = abs(`/cms/articles/edit/?slug=${parsed.slug}`);
  await notifyOwner(
    `New article ${status === "review" ? "needs review" : status}: ${parsed.h1}`,
    `"${parsed.h1}" arrived from the pipeline (run ${parsed.run_id}).\nStatus: ${status}${publish_at ? `, publishes ${publish_at}` : ""}.\nLint: ${result.passed ? "passed" : result.errors.length + " error(s)"}${result.warnings.length ? `, ${result.warnings.length} warning(s)` : ""}.\n\nPreview: ${previewLink(`/learn/${parsed.slug}/`)}\nEdit: ${cms}`,
  );

  // 7. Respond
  return NextResponse.json({ id: parsed.slug, status, preview_url: abs(`/learn/${parsed.slug}/`), publish_at, lint: result }, { status: 201 });
}
