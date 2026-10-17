import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { lint } from "@/lib/compliance/linter";
import { abs } from "@/lib/seo";
import type { Article } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* architecture.md §7.6 — runs every 15 minutes (system cron: curl -H "authorization: Bearer $CRON_SECRET" $SITE_URL/api/cron/publish). */

function authorized(req: NextRequest): boolean {
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  const given = req.headers.get("authorization") || "";
  return !!process.env.CRON_SECRET && expected.length === given.length && timingSafeEqual(Buffer.from(expected), Buffer.from(given));
}

async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || !urls.length) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ host: new URL(abs("/")).host, key, keyLocation: abs(`/${key}.txt`), urlList: urls }) });
  } catch { /* best effort */ }
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ error: "no_database" }, { status: 503 });
  const db = await getDb();
  const col = db.collection<Article>("articles");
  const now = new Date().toISOString();
  const due = await col.find({ status: "scheduled", publish_at: { $lte: now } }).toArray();
  const published: string[] = [];
  const sentBack: string[] = [];
  for (const a of due) {
    const result = lint({ ...a, slug: `/learn/${a.slug}/` }, { kind: "article" });
    if (!result.passed) {
      await col.updateOne({ slug: a.slug }, { $set: { status: "review", lint: result, updated_at: now } });
      sentBack.push(a.slug);
      continue;
    }
    await col.updateOne({ slug: a.slug }, { $set: { status: "published", published_at: now, updated_at: now, lint: result } });
    published.push(a.slug);
    revalidatePath(`/learn/${a.slug}/`);
    revalidatePath(`/learn/category/${a.category}/`);
  }
  if (published.length) { revalidatePath("/learn/"); revalidatePath("/"); revalidatePath("/sitemap.xml"); revalidatePath("/feed.xml"); }
  await pingIndexNow(published.map((s) => abs(`/learn/${s}/`)));
  await db.collection("ingest_log").insertOne({ run_id: "cron", result: "publish", published, sent_back: sentBack, created_at: new Date() });
  return NextResponse.json({ published, sent_back: sentBack, checked: due.length });
}
