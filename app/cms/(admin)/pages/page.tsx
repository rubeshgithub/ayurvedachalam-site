import Link from "next/link";
import { getDb } from "@/lib/db";
import type { Page } from "@/lib/types";
import { Status } from "@/app/cms/_ui/Status";

const SECTIONS = ["core", "consultations", "therapies", "massage-therapy", "spiritual-healing", "concerns", "calgary", "online", "learn", "policies"];

export default async function PagesList({ searchParams }: { searchParams: Promise<{ status?: string; section?: string; wave?: string }> }) {
  const sp = await searchParams;
  const q: Record<string, unknown> = {};
  if (sp.status) q.status = sp.status;
  if (sp.section) q.section = sp.section;
  if (sp.wave) q.wave = sp.wave === "A" ? "A" : Number(sp.wave);
  const pages = await (await getDb()).collection<Page>("pages").find(q).sort({ map_row: 1 }).toArray();
  const link = (k: string, v: string) => { const p = new URLSearchParams(sp as Record<string, string>); if (p.get(k) === v) p.delete(k); else p.set(k, v); return `/cms/pages/?${p}`; };
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6"><h1>Pages <span className="small">({pages.length})</span></h1><Link href="/cms/pages/edit/" className="btn btn-primary">New page</Link></div>
      <div className="flex flex-wrap gap-2 mb-2 text-[13px]">{["draft", "review", "published", "archived"].map((s) => <Link key={s} href={link("status", s)} className={`btn !min-h-0 !py-1.5 !px-3 ${sp.status === s ? "btn-primary" : "btn-secondary"}`}>{s}</Link>)}<span className="mx-2 text-line">|</span>{["1", "2", "3"].map((w) => <Link key={w} href={link("wave", w)} className={`btn !min-h-0 !py-1.5 !px-3 ${sp.wave === w ? "btn-primary" : "btn-secondary"}`}>Wave {w}</Link>)}</div>
      <div className="flex flex-wrap gap-2 mb-6 text-[13px]">{SECTIONS.map((s) => <Link key={s} href={link("section", s)} className={`btn !min-h-0 !py-1.5 !px-3 ${sp.section === s ? "btn-primary" : "btn-secondary"}`}>{s}</Link>)}</div>
      <table className="price-table text-[14px] bg-white card"><thead><tr><th>#</th><th>Page</th><th>Template</th><th>Wave</th><th>Status</th><th>Title ≤60</th><th>Meta ≤155</th><th></th></tr></thead><tbody>
        {pages.map((p) => <tr key={p.slug}><td className="tabular">{p.map_row}</td><td><Link href={`/cms/pages/edit/?slug=${encodeURIComponent(p.slug)}`} className="font-medium">{p.h1 || p.slug}</Link><br /><span className="small">{p.slug}{p.legal_check && <span className="text-copper-deep font-semibold"> · LEGAL CHECK</span>}</span></td><td>{p.template}</td><td>{p.wave}</td><td><Status s={p.status} /></td><td className={`tabular ${p.title_tag.length > 60 ? "text-error" : ""}`}>{p.title_tag.length}</td><td className={`tabular ${!p.meta_description || p.meta_description.length > 155 ? "text-error" : ""}`}>{p.meta_description?.length ?? 0}</td><td><a href={`/api/cms/preview?to=${encodeURIComponent(p.slug)}`} className="small">preview</a></td></tr>)}
      </tbody></table>
    </div>
  );
}

