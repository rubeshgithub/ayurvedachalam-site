import Link from "next/link";
import { getDb } from "@/lib/db";
import type { Page } from "@/lib/types";
import { savePage } from "@/app/cms/actions";
import { Field, Flash, Status } from "@/app/cms/_ui/Status";

const TEMPLATES = ["home", "hub", "service", "concern", "location", "region", "article-index", "profile", "pricing", "booking", "contact", "legal", "utility"];

const BLOCK_HELP = `[
  { "type": "intro", "data": { "lead": "One or two sentences that answer the search." } },
  { "type": "richtext", "data": { "md": "## What it is\\n\\nMarkdown here." } },
  { "type": "list", "data": { "heading": "Who it suits", "items": ["…"], "tone": "suits" } },
  { "type": "list", "data": { "heading": "Who should avoid this", "items": ["Pregnancy", "Fever", "Open wounds"], "tone": "avoid" } },
  { "type": "steps", "data": { "heading": "What happens", "items": [{ "title": "Arrive", "text": "…" }] } },
  { "type": "notice", "data": { "text": "…", "tone": "turmeric" } }
]`;

export default async function EditPage({ searchParams }: { searchParams: Promise<{ slug?: string; saved?: string; error?: string }> }) {
  const sp = await searchParams;
  const page = sp.slug ? await (await getDb()).collection<Page>("pages").findOne({ slug: sp.slug }) : null;
  const p: Partial<Page> = page ?? { slug: "", template: "utility", status: "draft", blocks: [], faqs: [] };
  return (
    <form action={savePage} className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between gap-4"><h1 className="text-[30px]">{page ? page.h1 || page.slug : "New page"}</h1>{page && <Status s={page.status} />}</div>
        <Flash saved={sp.saved} error={sp.error} />
        <div className="card p-6 space-y-5">
          <Field label="Slug" name="slug" value={p.slug} hint="Lowercase, hyphens, leading and trailing slash. Never changes after publication (add a redirect instead)." required />
          <Field label="H1" name="h1" value={p.h1} required />
          <Field label="Title tag" name="title_tag" value={p.title_tag} max={60} required />
          <Field label="Meta description" name="meta_description" value={p.meta_description} rows={2} max={155} required />
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Primary keyword" name="primary_keyword" value={p.primary_keyword} /><Field label="Secondary keywords (one per line)" name="secondary_keywords" value={p.secondary_keywords?.join("\n")} rows={2} /></div>
        </div>
        <div className="card p-6 space-y-5">
          <h2 className="text-[20px]">Blocks</h2>
          <p className="small">A JSON array; each block renders in order. Types: intro, richtext (Markdown), cards, steps, list (tone suits / avoid / neutral), notice, pricing, faq, cta. Service pages must include a list with tone <code>avoid</code>; concern pages a list headed “When to see a physician”.</p>
          <textarea className="field font-mono text-[13px]" name="blocks" rows={18} defaultValue={JSON.stringify(p.blocks ?? [], null, 2)} />
          <details><summary className="small cursor-pointer">Example</summary><pre className="text-[12px] bg-sandal p-3 rounded mt-2 overflow-auto">{BLOCK_HELP}</pre></details>
          <Field label="FAQ (question line, answer lines, blank line between)" name="faqs" value={(p.faqs ?? []).map((f) => `${f.q}\n${f.a}`).join("\n\n")} rows={8} />
          <Field label="Related slugs (one per line)" name="related" value={p.related?.join("\n")} rows={3} />
        </div>
        <div className="card p-6 space-y-5">
          <h2 className="text-[20px]">Summary box (service pages)</h2>
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Length" name="s_duration" value={p.summary?.duration} hint="Blank = from the price list" /><Field label="Price from" name="s_price_from" value={p.summary?.price_from} hint="Blank = from the price list" /><Field label="Price note" name="s_price_note" value={p.summary?.price_note} /><Field label="Location text" name="s_location" value={p.summary?.location} /></div>
          <div className="flex gap-6 text-[15px]"><label className="flex gap-2"><input type="checkbox" name="s_mode_in-person" defaultChecked={p.summary?.mode?.includes("in-person") ?? true} /> In person</label><label className="flex gap-2"><input type="checkbox" name="s_mode_online" defaultChecked={p.summary?.mode?.includes("online")} /> Online</label></div>
        </div>
      </div>
      <aside className="lg:col-span-4"><div className="sticky top-6 space-y-4">
        <div className="card p-5 space-y-4">
          <div><label className="label" htmlFor="status">Status</label><select className="field" id="status" name="status" defaultValue={p.status}>{["draft", "review", "published", "archived"].map((s) => <option key={s}>{s}</option>)}</select></div>
          <div><label className="label" htmlFor="template">Template</label><select className="field" id="template" name="template" defaultValue={p.template}>{TEMPLATES.map((t) => <option key={t}>{t}</option>)}</select></div>
          <label className="flex gap-2 text-[15px]"><input type="checkbox" name="reviewed" /> Mark as reviewed by the practitioner today</label>
          <label className="flex gap-2 text-[15px]"><input type="checkbox" name="noindex" defaultChecked={p.noindex} /> noindex</label>
          <label className="flex gap-2 text-[15px]"><input type="checkbox" name="legal_check" defaultChecked={p.legal_check} /> LEGAL CHECK page</label>
          <Field label="Legal-check note" name="legal_check_note" value={p.legal_check_note} rows={2} />
          <button className="btn btn-primary w-full" type="submit">Save</button>
          {page && <a href={`/api/cms/preview?to=${encodeURIComponent(page.slug)}`} className="btn btn-secondary w-full" target="_blank">Preview ↗</a>}
          <p className="small">Publishing runs the compliance linter; errors block the save. Reviewed: {p.reviewed_at?.slice(0, 10) ?? "not yet"}. Updated: {p.updated_at?.slice(0, 10) ?? "—"}.</p>
        </div>
        <Link href="/cms/pages/" className="small">← All pages</Link>
      </div></aside>
    </form>
  );
}
