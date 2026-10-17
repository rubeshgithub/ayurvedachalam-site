import Link from "next/link";
import { getDb } from "@/lib/db";
import type { Article, Page } from "@/lib/types";

export default async function Overview() {
  const db = await getDb();
  const [pages, articles, review, scheduled, leads, subs, log] = await Promise.all([
    db.collection<Page>("pages").aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]).toArray(),
    db.collection<Article>("articles").aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]).toArray(),
    db.collection<Article>("articles").find({ status: "review" }).sort({ updated_at: -1 }).limit(10).toArray(),
    db.collection<Article>("articles").find({ status: "scheduled" }).sort({ publish_at: 1 }).limit(10).toArray(),
    db.collection("leads").countDocuments(), db.collection("subscribers").countDocuments({ unsubscribed_at: null }),
    db.collection("ingest_log").find().sort({ created_at: -1 }).limit(8).toArray(),
  ]);
  const count = (arr: { _id: string; n: number }[], s: string) => arr.find((x) => x._id === s)?.n ?? 0;
  return (
    <div className="space-y-10">
      <h1>Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["Pages published", count(pages, "published"), "/cms/pages/?status=published"], ["Pages in draft", count(pages, "draft") + count(pages, "review"), "/cms/pages/?status=draft"], ["Articles awaiting review", count(articles, "review"), "/cms/articles/?status=review"], ["Articles scheduled", count(articles, "scheduled"), "/cms/articles/?status=scheduled"], ["Articles published", count(articles, "published"), "/cms/articles/?status=published"], ["Enquiries", leads, "#"], ["Subscribers", subs, "#"]].map(([l, n, h]) => (
          <Link key={String(l)} href={String(h)} className="card p-5 no-underline"><p className="small">{l}</p><p className="font-display text-[36px] text-neem tabular">{n}</p></Link>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <section><h2 className="mb-4 text-[22px]">Awaiting review</h2>{review.length ? <ul className="card divide-y divide-line">{review.map((a) => <li key={a.slug} className="p-4 flex justify-between gap-4"><div><Link href={`/cms/articles/edit/?slug=${a.slug}`} className="font-medium">{a.h1}</Link><p className="small">{a.category} · {a.origin} · {a.lint?.errors.length ?? 0} lint errors</p></div><span className="small">{a.updated_at?.slice(0, 10)}</span></li>)}</ul> : <p className="text-stone">Nothing waiting.</p>}</section>
        <section><h2 className="mb-4 text-[22px]">Scheduled</h2>{scheduled.length ? <ul className="card divide-y divide-line">{scheduled.map((a) => <li key={a.slug} className="p-4 flex justify-between gap-4"><Link href={`/cms/articles/edit/?slug=${a.slug}`} className="font-medium">{a.h1}</Link><span className="small">{a.publish_at ? new Date(a.publish_at).toLocaleString("en-CA", { timeZone: "America/Edmonton" }) : ""}</span></li>)}</ul> : <p className="text-stone">Nothing scheduled.</p>}</section>
      </div>
      <section><h2 className="mb-4 text-[22px]">Recent ingest log</h2><table className="price-table text-[14px]"><thead><tr><th>When</th><th>Run</th><th>Slug</th><th>Result</th></tr></thead><tbody>{log.map((l) => <tr key={String(l._id)}><td>{new Date(l.created_at).toLocaleString("en-CA", { timeZone: "America/Edmonton" })}</td><td>{l.run_id}</td><td>{l.slug ?? "—"}</td><td>{l.result}</td></tr>)}</tbody></table></section>
    </div>
  );
}
