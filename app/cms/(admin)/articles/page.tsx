import Link from "next/link";
import { getDb } from "@/lib/db";
import type { Article } from "@/lib/types";
import { Flash, Status } from "@/app/cms/_ui/Status";

const STATUSES = ["review", "scheduled", "published", "draft", "rejected", "archived"];

export default async function ArticlesQueue({ searchParams }: { searchParams: Promise<{ status?: string; error?: string }> }) {
  const sp = await searchParams;
  const q = sp.status ? { status: sp.status as Article["status"] } : {};
  const arts = await (await getDb()).collection<Article>("articles").find(q).sort({ updated_at: -1 }).limit(200).toArray();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6"><h1>Articles <span className="small">({arts.length})</span></h1><Link href="/cms/articles/edit/" className="btn btn-primary">New article</Link></div>
      <Flash error={sp.error} />
      <div className="flex flex-wrap gap-2 mb-6 text-[13px]">{STATUSES.map((s) => <Link key={s} href={sp.status === s ? "/cms/articles/" : `/cms/articles/?status=${s}`} className={`btn !min-h-0 !py-1.5 !px-3 ${sp.status === s ? "btn-primary" : "btn-secondary"}`}>{s}</Link>)}</div>
      <table className="price-table text-[14px] bg-white card"><thead><tr><th>Article</th><th>Category</th><th>Origin</th><th>Status</th><th>Lint</th><th>Words</th><th>When</th></tr></thead><tbody>
        {arts.map((a) => <tr key={a.slug}><td><Link href={`/cms/articles/edit/?slug=${a.slug}`} className="font-medium">{a.h1}</Link><br /><span className="small">/learn/{a.slug}/</span></td><td>{a.category}</td><td>{a.origin}{a.run_id ? <span className="small block">{a.run_id}</span> : null}</td><td><Status s={a.status} /></td><td>{a.lint ? <span className={a.lint.passed ? "text-success" : "text-error font-semibold"}>{a.lint.passed ? "pass" : `${a.lint.errors.length} error${a.lint.errors.length === 1 ? "" : "s"}`}{a.lint.warnings.length ? <span className="small block">{a.lint.warnings.length} warning(s)</span> : null}</span> : "—"}</td><td className="tabular">{a.word_count}</td><td className="small">{a.status === "scheduled" && a.publish_at ? `publishes ${new Date(a.publish_at).toLocaleString("en-CA", { timeZone: "America/Edmonton" })}` : a.published_at?.slice(0, 10) ?? a.updated_at?.slice(0, 10)}</td></tr>)}
      </tbody></table>
    </div>
  );
}
