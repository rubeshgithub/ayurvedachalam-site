import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { listArticles, listPages } from "@/lib/content/repo";
import { SECTION_LABELS } from "@/templates/shared";

export const metadata: Metadata = { title: "Preview index — Ayurvedachalam", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ORDER = ["core", "consultations", "therapies", "massage-therapy", "spiritual-healing", "concerns", "calgary", "online", "learn", "policies"];
const STATUS: Record<string, string> = { published: "bg-neem-soft text-neem", review: "bg-turmeric-soft", draft: "bg-sandal text-stone", archived: "bg-line" };

/** Review index for the owner and the practitioner: every page and article with its status. Dev, PREVIEW_DRAFTS or draft mode only. */
export default async function PreviewIndex() {
  const allowed = process.env.NODE_ENV !== "production" || process.env.PREVIEW_DRAFTS === "1" || (await draftMode()).isEnabled;
  if (!allowed) notFound();
  const [pages, articles] = await Promise.all([listPages({ status: "any" }), listArticles({ status: "any" })]);
  const withCopy = pages.filter((p) => (p.blocks?.length ?? 0) > 0).length;
  return (
    <div className="container py-12">
      <p className="eyebrow mb-3">Review index · not public</p>
      <h1>All pages and articles</h1>
      <p className="lead mt-4">{withCopy} of {pages.length} pages have copy; {articles.length} articles. Yellow = written, awaiting review. Grey = headline only, copy not yet written.</p>
      {ORDER.map((sec) => {
        const rows = pages.filter((p) => p.section === sec);
        if (!rows.length) return null;
        return (
          <section key={sec} className="mt-10">
            <h2 className="mb-4">{SECTION_LABELS[sec] || (sec === "core" ? "Core and trust" : sec === "policies" ? "Policies" : sec)}</h2>
            <table className="price-table text-[15px] bg-white card">
              <thead><tr><th>#</th><th>Page</th><th>Template</th><th>Wave</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.slug}>
                    <td className="tabular">{p.map_row}</td>
                    <td><Link href={p.slug} className="font-medium">{p.h1 || p.slug}</Link><span className="small block">{p.slug}{p.legal_check ? " · LEGAL CHECK" : ""}</span></td>
                    <td>{p.template}</td>
                    <td>{p.wave}</td>
                    <td><span className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${STATUS[p.status] ?? ""}`}>{(p.blocks?.length ?? 0) > 0 || p.template === "home" ? p.status : "draft · no copy"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
      <section className="mt-10">
        <h2 className="mb-4">Articles</h2>
        <table className="price-table text-[15px] bg-white card">
          <thead><tr><th>Article</th><th>Category</th><th>Words</th><th>Status</th></tr></thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.slug}><td><Link href={`/learn/${a.slug}/`} className="font-medium">{a.h1}</Link><span className="small block">/learn/{a.slug}/</span></td><td>{a.category}</td><td className="tabular">{a.word_count}</td><td><span className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${STATUS[a.status] ?? ""}`}>{a.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
