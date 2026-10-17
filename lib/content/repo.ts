import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { hasDb, getDb } from "@/lib/db";
import type { Article, ArticleCategory, Author, Page, Review, Settings } from "@/lib/types";

/**
 * Content repository.
 *
 * Production: MongoDB (architecture.md §6).
 * Development / CI without a database: content/seed/*.json, produced by
 * `npm run seed` and committed so the site always builds. The JSON backend is
 * read-only; writes (ingest, publish) require MongoDB.
 */

const SEED_DIR = path.join(process.cwd(), "content", "seed");

async function readSeed<T>(name: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(SEED_DIR, `${name}.json`), "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function readSeedOne<T>(name: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(SEED_DIR, `${name}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const strip = <T extends object>(doc: T | null): T | null => {
  if (!doc) return null;
  const { _id: _omit, ...rest } = doc as T & { _id?: unknown };
  void _omit;
  return rest as T;
};

/* ------------------------------------------------------------------ pages */

export async function getPage(slug: string): Promise<Page | null> {
  if (hasDb()) {
    const db = await getDb();
    return strip(await db.collection<Page>("pages").findOne({ slug }));
  }
  const pages = await readSeed<Page>("pages");
  return pages.find((p) => p.slug === slug) ?? null;
}

export async function listPages(filter: { section?: string; status?: Page["status"] | "any"; template?: Page["template"] } = {}): Promise<Page[]> {
  const status = filter.status ?? "published";
  if (hasDb()) {
    const db = await getDb();
    const q: Record<string, unknown> = {};
    if (status !== "any") q.status = status;
    if (filter.section) q.section = filter.section;
    if (filter.template) q.template = filter.template;
    const docs = await db.collection<Page>("pages").find(q).sort({ map_row: 1 }).toArray();
    return docs.map((d) => strip(d) as Page);
  }
  let pages = await readSeed<Page>("pages");
  if (status !== "any") pages = pages.filter((p) => p.status === status);
  if (filter.section) pages = pages.filter((p) => p.section === filter.section);
  if (filter.template) pages = pages.filter((p) => p.template === filter.template);
  return pages.sort((a, b) => (a.map_row ?? 0) - (b.map_row ?? 0));
}

/** Children of a hub: published pages whose slug starts with the hub slug. */
export async function listChildren(hubSlug: string): Promise<Page[]> {
  const all = await listPages({ status: "published" });
  return all.filter((p) => p.slug !== hubSlug && p.slug.startsWith(hubSlug) && p.slug.slice(hubSlug.length).split("/").filter(Boolean).length === 1);
}

export async function pageExists(slug: string): Promise<boolean> {
  const p = await getPage(slug);
  return !!p && p.status === "published";
}

/* --------------------------------------------------------------- articles */

export async function getArticle(slug: string): Promise<Article | null> {
  if (hasDb()) {
    const db = await getDb();
    return strip(await db.collection<Article>("articles").findOne({ slug }));
  }
  const arts = await readSeed<Article>("articles");
  return arts.find((a) => a.slug === slug) ?? null;
}

export async function listArticles(opts: { category?: ArticleCategory; status?: Article["status"] | "any"; limit?: number; skip?: number } = {}): Promise<Article[]> {
  const status = opts.status ?? "published";
  if (hasDb()) {
    const db = await getDb();
    const q: Record<string, unknown> = {};
    if (status !== "any") q.status = status;
    if (opts.category) q.category = opts.category;
    const cur = db.collection<Article>("articles").find(q).sort({ published_at: -1, updated_at: -1 });
    if (opts.skip) cur.skip(opts.skip);
    if (opts.limit) cur.limit(opts.limit);
    return (await cur.toArray()).map((d) => strip(d) as Article);
  }
  let arts = await readSeed<Article>("articles");
  if (status !== "any") arts = arts.filter((a) => a.status === status);
  if (opts.category) arts = arts.filter((a) => a.category === opts.category);
  arts.sort((a, b) => (b.published_at ?? b.updated_at ?? "").localeCompare(a.published_at ?? a.updated_at ?? ""));
  const skip = opts.skip ?? 0;
  return arts.slice(skip, opts.limit ? skip + opts.limit : undefined);
}

export async function countArticles(category?: ArticleCategory): Promise<number> {
  return (await listArticles({ category, status: "published" })).length;
}

export async function articleExists(slug: string): Promise<boolean> {
  const a = await getArticle(slug);
  return !!a && a.status === "published";
}

/* ----------------------------------------------------------------- others */

export async function getSettings(): Promise<Settings> {
  if (hasDb()) {
    const db = await getDb();
    const s = strip(await db.collection<Settings>("settings").findOne({}));
    if (s) return s;
  }
  const s = await readSeedOne<Settings>("settings");
  if (!s) throw new Error("No settings found (content/seed/settings.json missing)");
  return s;
}

export async function getAuthor(id: string): Promise<Author | null> {
  if (hasDb()) {
    const db = await getDb();
    const a = strip(await db.collection<Author>("authors").findOne({ id }));
    if (a) return a;
  }
  const authors = await readSeed<Author>("authors");
  return authors.find((a) => a.id === id) ?? null;
}

export async function listReviews(limit = 6): Promise<Review[]> {
  if (hasDb()) {
    const db = await getDb();
    return (await db.collection<Review>("reviews").find({ consent: true }).sort({ date: -1 }).limit(limit).toArray()).map((d) => strip(d) as Review);
  }
  return (await readSeed<Review>("reviews")).filter((r) => r.consent).slice(0, limit);
}

export async function findRedirect(from: string): Promise<{ to: string; code: 301 | 302 } | null> {
  if (hasDb()) {
    const db = await getDb();
    const r = await db.collection<{ from: string; to: string; code: 301 | 302 }>("redirects").findOne({ from });
    return r ? { to: r.to, code: r.code } : null;
  }
  const rs = await readSeed<{ from: string; to: string; code: 301 | 302 }>("redirects");
  const r = rs.find((x) => x.from === from);
  return r ? { to: r.to, code: r.code } : null;
}

/** Every primary keyword in use, for the linter's uniqueness check. */
export async function allPrimaryKeywords(): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  for (const p of await listPages({ status: "any" })) if (p.primary_keyword) out.set(p.primary_keyword.toLowerCase(), p.slug);
  for (const a of await listArticles({ status: "any" })) if (a.primary_keyword) out.set(a.primary_keyword.toLowerCase(), `/learn/${a.slug}/`);
  return out;
}

/* ----------------------------------------------------------------- prices */

export interface PriceRow { slug: string; service: string; detail?: string; price: string; duration?: string; price_from?: string }
export interface PriceBook { groups: { heading: string; section: string; rows: PriceRow[] }[]; packages: { service: string; detail?: string; price: string }[]; package_terms: string }

/** Approved price list (product.md §5, D-18). In MongoDB it lives in `settings.prices`; the seed file is the fallback. */
export async function getPrices(): Promise<PriceBook> {
  if (hasDb()) {
    const db = await getDb();
    const s = await db.collection<{ prices?: PriceBook }>("settings").findOne({});
    if (s?.prices) return s.prices;
  }
  const p = await readSeedOne<PriceBook>("prices");
  if (!p) throw new Error("content/seed/prices.json missing");
  return p;
}

export async function priceFor(slug: string): Promise<PriceRow | null> {
  const book = await getPrices();
  for (const g of book.groups) for (const r of g.rows) if (r.slug === slug) return r;
  return null;
}
