"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { attemptLogin, clearSessionCookie, currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { lint, touchesLegalCheck } from "@/lib/compliance/linter";
import { allPrimaryKeywords, articleExists, pageExists } from "@/lib/content/repo";
import { renderMarkdown, wordCount } from "@/lib/markdown";
import type { Article, Block, Faq, Page, Settings, Source } from "@/lib/types";

/* All CMS writes go through here. Every action checks the session first. */

async function requireUser() {
  const u = await currentUser();
  if (!u) redirect("/cms/login/");
  return u;
}

const text = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const lines = (fd: FormData, k: string) => text(fd, k).split("\n").map((s) => s.trim()).filter(Boolean);

function parseFaqs(raw: string): Faq[] {
  // "Question?\nAnswer\n\nQuestion?\nAnswer"
  return raw.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean).map((chunk) => {
    const [q, ...a] = chunk.split("\n");
    return { q: q.trim(), a: a.join("\n").trim() };
  }).filter((f) => f.q && f.a);
}

function parseSources(raw: string): Source[] {
  // "Title | https://url | Publisher | 15 October 2026"
  return raw.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [title, url, publisher, accessed] = l.split("|").map((s) => s.trim());
    return { title, url, publisher: publisher || undefined, accessed: accessed || undefined };
  }).filter((s) => s.title && /^https?:\/\//.test(s.url));
}

/* ---------------------------------------------------------------- auth */

export async function login(fd: FormData) {
  const r = await attemptLogin(text(fd, "email"), String(fd.get("password") ?? ""), text(fd, "code"));
  if (!r.ok) redirect(`/cms/login/?error=${encodeURIComponent(r.reason)}`);
  redirect("/cms/");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/cms/login/");
}

/* --------------------------------------------------------------- pages */

const PageForm = z.object({
  slug: z.string().regex(/^\/([a-z0-9-]+\/)*$/),
  title_tag: z.string().min(1).max(60),
  meta_description: z.string().min(1).max(155),
  h1: z.string().min(1),
  primary_keyword: z.string().optional(),
  template: z.string(),
  status: z.enum(["draft", "review", "published", "archived"]),
  noindex: z.boolean(),
  legal_check: z.boolean(),
  legal_check_note: z.string().optional(),
});

export async function savePage(fd: FormData) {
  const user = await requireUser();
  const data = PageForm.parse({
    slug: text(fd, "slug"), title_tag: text(fd, "title_tag"), meta_description: text(fd, "meta_description"), h1: text(fd, "h1"),
    primary_keyword: text(fd, "primary_keyword"), template: text(fd, "template"), status: text(fd, "status"),
    noindex: fd.get("noindex") === "on", legal_check: fd.get("legal_check") === "on", legal_check_note: text(fd, "legal_check_note"),
  });
  let blocks: Block[] = [];
  try { blocks = JSON.parse(text(fd, "blocks") || "[]"); if (!Array.isArray(blocks)) throw new Error(); }
  catch { redirect(`/cms/pages/edit/?slug=${encodeURIComponent(data.slug)}&error=${encodeURIComponent("Blocks must be a JSON array")}`); }
  const summary = {
    duration: text(fd, "s_duration") || undefined, price_from: text(fd, "s_price_from") || undefined, price_note: text(fd, "s_price_note") || undefined,
    location: text(fd, "s_location") || undefined, mode: (["in-person", "online"] as const).filter((m) => fd.get(`s_mode_${m}`) === "on"),
  };
  const db = await getDb();
  const existing = await db.collection<Page>("pages").findOne({ slug: data.slug });
  if (existing && existing.status === "published" && data.status !== "published" && user.role !== "owner") {
    redirect(`/cms/pages/edit/?slug=${encodeURIComponent(data.slug)}&error=${encodeURIComponent("Only the owner can unpublish")}`);
  }
  // Lint pages that are being published.
  if (data.status === "published") {
    const md = blocks.map((b) => (b.type === "richtext" ? b.data.md : b.type === "intro" ? b.data.lead : b.type === "list" ? b.data.items.join("\n") : "")).join("\n");
    const r = lint({ ...data, body_md: md, faqs: parseFaqs(text(fd, "faqs")), internal_links: lines(fd, "related"), author_id: "practitioner" }, { kind: "page", existingKeywords: await allPrimaryKeywords(), skipFigures: data.template === "legal" || data.template === "profile" });
    const err = r.errors.filter((e) => !/already used/.test(e) || !e.endsWith(data.slug));
    if (err.length) redirect(`/cms/pages/edit/?slug=${encodeURIComponent(data.slug)}&error=${encodeURIComponent("Linter: " + err.join(" · "))}`);
  }
  const now = new Date().toISOString();
  const set: Partial<Page> = {
    ...data, template: data.template as Page["template"], blocks, summary, faqs: parseFaqs(text(fd, "faqs")), related: lines(fd, "related"),
    secondary_keywords: lines(fd, "secondary_keywords"), updated_at: now, author_id: "practitioner",
    reviewed_at: fd.get("reviewed") === "on" ? now : existing?.reviewed_at ?? null,
    published_at: data.status === "published" ? existing?.published_at ?? now : existing?.published_at ?? null,
  };
  await db.collection<Page>("pages").updateOne({ slug: data.slug }, { $set: set, $setOnInsert: { section: data.slug.split("/")[1] || "core", wave: 3 } }, { upsert: true });
  revalidatePath(data.slug); revalidatePath("/"); revalidatePath("/sitemap.xml");
  redirect(`/cms/pages/edit/?slug=${encodeURIComponent(data.slug)}&saved=1`);
}

/* ------------------------------------------------------------ articles */

export async function saveArticle(fd: FormData) {
  await requireUser();
  const slug = text(fd, "slug").replace(/^\/learn\//, "").replace(/\/$/, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) redirect(`/cms/articles/?error=${encodeURIComponent("Bad slug")}`);
  const db = await getDb();
  const col = db.collection<Article>("articles");
  const existing = await col.findOne({ slug });
  const body_md = String(fd.get("body_md") ?? "").trim();
  const faqs = parseFaqs(text(fd, "faqs"));
  const sources = parseSources(text(fd, "sources"));
  const internal_links = lines(fd, "internal_links");
  const linter_allow = lines(fd, "linter_allow");
  const draft: Partial<Article> = {
    slug, kind: (text(fd, "kind") as Article["kind"]) || "feed", category: text(fd, "category") as Article["category"],
    title_tag: text(fd, "title_tag"), meta_description: text(fd, "meta_description"), h1: text(fd, "h1"), excerpt: text(fd, "excerpt") || text(fd, "meta_description"),
    primary_keyword: text(fd, "primary_keyword"), secondary_keywords: lines(fd, "secondary_keywords"), tags: lines(fd, "tags"),
    body_md, body_html: renderMarkdown(body_md), faqs, sources, internal_links, linter_allow,
    hero_image: { src: text(fd, "hero_src") || undefined, alt: text(fd, "hero_alt") || undefined, credit: text(fd, "hero_credit") || undefined },
    author_id: "practitioner", updated_at: new Date().toISOString(), word_count: wordCount(body_md), reading_minutes: Math.max(1, Math.round(wordCount(body_md) / 220)),
  };
  // Re-lint on every save so the queue shows live results.
  const resolves = new Map<string, boolean>();
  for (const l of internal_links) resolves.set(l, l === "/" || l === "/book/" || l === "/learn/" || (l.startsWith("/learn/") ? await articleExists(l.replace(/^\/learn\//, "").replace(/\/$/, "")) : await pageExists(l)));
  const keywords = await allPrimaryKeywords();
  draft.lint = lint({ ...(draft as Article), slug: `/learn/${slug}/` }, { kind: "article", existingKeywords: keywords, linkResolves: (h) => resolves.get(h) ?? false });
  if (fd.get("reviewed") === "on") draft.reviewed_at = new Date().toISOString();
  await col.updateOne({ slug }, { $set: draft, $setOnInsert: { status: "draft", origin: "manual", published_at: null, publish_at: null } }, { upsert: true });
  if (existing?.status === "published") { revalidatePath(`/learn/${slug}/`); revalidatePath("/learn/"); }
  redirect(`/cms/articles/edit/?slug=${slug}&saved=1`);
}

export async function setArticleStatus(fd: FormData) {
  const user = await requireUser();
  const slug = text(fd, "slug");
  const action = text(fd, "action"); // publish | schedule | review | reject | archive
  const db = await getDb();
  const col = db.collection<Article>("articles");
  const a = await col.findOne({ slug });
  if (!a) redirect("/cms/articles/");
  const now = new Date().toISOString();
  if (action === "publish" || action === "schedule") {
    const r = lint({ ...a, slug: `/learn/${slug}/` }, { kind: "article" });
    if (!r.passed) redirect(`/cms/articles/edit/?slug=${slug}&error=${encodeURIComponent("Linter blocks publishing: " + r.errors.join(" · "))}`);
    if (touchesLegalCheck(`/learn/${slug}/`, a.internal_links) && user.role !== "owner") redirect(`/cms/articles/edit/?slug=${slug}&error=${encodeURIComponent("Touches a LEGAL CHECK page; only the owner can publish")}`);
    if (action === "publish") await col.updateOne({ slug }, { $set: { status: "published", published_at: a.published_at ?? now, updated_at: now, lint: r, reviewed_by: user.email } });
    else {
      const when = text(fd, "publish_at") ? new Date(text(fd, "publish_at")).toISOString() : new Date(Date.now() + 24 * 3600_000).toISOString();
      await col.updateOne({ slug }, { $set: { status: "scheduled", publish_at: when, updated_at: now, lint: r, reviewed_by: user.email } });
    }
  } else if (action === "review") await col.updateOne({ slug }, { $set: { status: "review", updated_at: now } });
  else if (action === "reject") await col.updateOne({ slug }, { $set: { status: "rejected", updated_at: now, reject_note: text(fd, "note") } });
  else if (action === "archive") await col.updateOne({ slug }, { $set: { status: "archived", updated_at: now } });
  revalidatePath(`/learn/${slug}/`); revalidatePath("/learn/"); revalidatePath("/"); revalidatePath("/sitemap.xml"); revalidatePath("/feed.xml");
  redirect(`/cms/articles/edit/?slug=${slug}&saved=1`);
}

/* ------------------------------------------------------------ settings */

export async function saveSettings(fd: FormData) {
  const user = await requireUser();
  if (user.role !== "owner") redirect("/cms/settings/?error=Owner+only");
  const db = await getDb();
  const cur = (await db.collection<Settings>("settings").findOne({})) as Settings | null;
  const hours = text(fd, "hours").split("\n").map((l) => l.split("|").map((s) => s.trim())).filter((p) => p[0]).map(([day, open = "", close = ""]) => ({ day, open, close }));
  const set: Partial<Settings> & { prices?: unknown } = {
    site_name: text(fd, "site_name"), descriptor: text(fd, "descriptor"), tagline: text(fd, "tagline"),
    nap: { name: text(fd, "nap_name"), street: text(fd, "nap_street"), city: text(fd, "nap_city"), region: text(fd, "nap_region"), postal: text(fd, "nap_postal"), country: "CA", phone: text(fd, "nap_phone"), email: text(fd, "nap_email"), placeholder: fd.get("nap_placeholder") === "on" },
    hours, booking_url: text(fd, "booking_url"), booking_embed_url: text(fd, "booking_embed_url"),
    publish_mode: text(fd, "publish_mode") as Settings["publish_mode"], hold_hours: Number(text(fd, "hold_hours")) || 24,
    notices: { ...(cur?.notices ?? {} as Settings["notices"]), complementary: text(fd, "n_complementary"), spiritual: text(fd, "n_spiritual"), crisis: text(fd, "n_crisis"), npn: text(fd, "n_npn"), insurance: text(fd, "n_insurance"), contact_form: text(fd, "n_contact_form") },
    prices_gst_note: text(fd, "prices_gst_note"),
  };
  if (text(fd, "prices")) {
    try { set.prices = JSON.parse(text(fd, "prices")); } catch { redirect("/cms/settings/?error=Prices+must+be+valid+JSON"); }
  }
  await db.collection("settings").updateOne({}, { $set: set }, { upsert: true });
  revalidatePath("/", "layout");
  redirect("/cms/settings/?saved=1");
}

/* ----------------------------------------------------------- redirects */

export async function addRedirect(fd: FormData) {
  await requireUser();
  const from = text(fd, "from"), to = text(fd, "to");
  if (!from.startsWith("/") || !to.startsWith("/") || from === to) redirect("/cms/redirects/?error=Both+paths+must+start+with+/");
  const db = await getDb();
  const chain = await db.collection("redirects").findOne({ from: to });
  if (chain) redirect("/cms/redirects/?error=Target+is+itself+redirected+(no+chains)");
  await db.collection("redirects").updateOne({ from }, { $set: { from, to, code: 301, created_at: new Date() } }, { upsert: true });
  redirect("/cms/redirects/?saved=1");
}

export async function deleteRedirect(fd: FormData) {
  await requireUser();
  await (await getDb()).collection("redirects").deleteOne({ from: text(fd, "from") });
  redirect("/cms/redirects/?saved=1");
}

/* --------------------------------------------------------------- media */

export async function uploadMedia(fd: FormData) {
  const user = await requireUser();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/cms/media/?error=Choose+an+image");
  try {
    const { saveUpload } = await import("@/lib/media");
    await saveUpload(file, text(fd, "alt"), text(fd, "credit"), user.email);
  } catch (e) {
    redirect(`/cms/media/?error=${encodeURIComponent(e instanceof Error ? e.message : "Upload failed")}`);
  }
  redirect("/cms/media/?saved=1");
}

export async function updateMediaAction(fd: FormData) {
  await requireUser();
  const { updateMedia } = await import("@/lib/media");
  try { await updateMedia(text(fd, "file"), text(fd, "alt"), text(fd, "credit")); } catch (e) { redirect(`/cms/media/?error=${encodeURIComponent(e instanceof Error ? e.message : "Failed")}`); }
  redirect("/cms/media/?saved=1");
}

export async function deleteMediaAction(fd: FormData) {
  const user = await requireUser();
  if (user.role !== "owner") redirect("/cms/media/?error=Owner+only");
  const { deleteMedia } = await import("@/lib/media");
  await deleteMedia(text(fd, "file"));
  redirect("/cms/media/?saved=1");
}
