import Link from "next/link";
import { getDb } from "@/lib/db";
import { ARTICLE_CATEGORIES, type Article } from "@/lib/types";
import { saveArticle, setArticleStatus } from "@/app/cms/actions";
import { Field, Flash, Status } from "@/app/cms/_ui/Status";

export default async function EditArticle({ searchParams }: { searchParams: Promise<{ slug?: string; saved?: string; error?: string }> }) {
  const sp = await searchParams;
  const a = sp.slug ? await (await getDb()).collection<Article>("articles").findOne({ slug: sp.slug }) : null;
  const p: Partial<Article> = a ?? { kind: "feed", category: "ayurveda-basics", status: "draft" };
  const defaultWhen = new Date(Date.now() + 24 * 3600_000).toISOString().slice(0, 16);
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form action={saveArticle} className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between gap-4"><h1 className="text-[30px]">{a ? a.h1 : "New article"}</h1>{a && <Status s={a.status} />}</div>
        <Flash saved={sp.saved} error={sp.error} />
        {a?.lint && (
          <div className={`notice ${a.lint.passed ? "" : "notice-copper"} text-[14px]`}>
            <strong>Linter: {a.lint.passed ? "passed" : `${a.lint.errors.length} error(s)`}</strong>
            {a.lint.errors.length > 0 && <ul className="list-disc pl-5 mt-1">{a.lint.errors.map((e) => <li key={e}>{e}</li>)}</ul>}
            {a.lint.warnings.length > 0 && <ul className="list-disc pl-5 mt-1 text-stone">{a.lint.warnings.map((e) => <li key={e}>{e}</li>)}</ul>}
          </div>
        )}
        <div className="card p-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Slug (without /learn/)" name="slug" value={p.slug} required />
            <div><label className="label" htmlFor="category">Category</label><select className="field" id="category" name="category" defaultValue={p.category}>{Object.entries(ARTICLE_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
          </div>
          <Field label="H1" name="h1" value={p.h1} required />
          <Field label="Title tag" name="title_tag" value={p.title_tag} max={60} required />
          <Field label="Meta description" name="meta_description" value={p.meta_description} rows={2} max={155} required />
          <Field label="Excerpt (≤200; blank = meta description)" name="excerpt" value={p.excerpt} rows={2} max={200} />
          <div className="grid gap-5 sm:grid-cols-3"><Field label="Primary keyword" name="primary_keyword" value={p.primary_keyword} required /><Field label="Secondary keywords (one per line)" name="secondary_keywords" value={p.secondary_keywords?.join("\n")} rows={2} /><Field label="Tags (one per line)" name="tags" value={p.tags?.join("\n")} rows={2} /></div>
          <div><label className="label" htmlFor="kind">Kind</label><select className="field" id="kind" name="kind" defaultValue={p.kind}><option value="feed">feed</option><option value="cornerstone">cornerstone</option></select></div>
        </div>
        <div className="card p-6 space-y-5">
          <Field label="Body (Markdown; H2/H3 only, no H1)" name="body_md" value={p.body_md} rows={28} required />
          <Field label="FAQ (question line, answer lines, blank line between; 3–5)" name="faqs" value={(p.faqs ?? []).map((f) => `${f.q}\n${f.a}`).join("\n\n")} rows={8} />
          <Field label="Sources (one per line: Title | https://url | Publisher | accessed date)" name="sources" value={(p.sources ?? []).map((s) => [s.title, s.url, s.publisher ?? "", s.accessed ?? ""].join(" | ")).join("\n")} rows={6} />
          <Field label="Internal links (one per line; include one service page and /book/)" name="internal_links" value={p.internal_links?.join("\n")} rows={3} />
          <Field label="Linter allow-list (words quoted from the law or warned against; one per line)" name="linter_allow" value={p.linter_allow?.join("\n")} rows={2} />
          <div className="grid gap-5 sm:grid-cols-3"><Field label="Hero image path" name="hero_src" value={p.hero_image?.src} /><Field label="Hero alt text (required with an image)" name="hero_alt" value={p.hero_image?.alt} /><Field label="Credit" name="hero_credit" value={p.hero_image?.credit} /></div>
          {p.hero_image?.brief && <p className="small">Pipeline brief for the editor: {p.hero_image.brief}</p>}
        </div>
        <div className="flex items-center gap-4"><button className="btn btn-primary" type="submit">Save and re-lint</button><label className="flex gap-2 text-[15px]"><input type="checkbox" name="reviewed" /> Reviewed by the practitioner</label>{a && <a href={`/api/cms/preview?to=/learn/${a.slug}/`} className="btn btn-secondary" target="_blank">Preview ↗</a>}</div>
      </form>
      <aside className="lg:col-span-4"><div className="sticky top-6 space-y-4">
        {a && (
          <div className="card p-5 space-y-3">
            <h2 className="text-[18px]">Publish</h2>
            <p className="small">Reviewed: {a.reviewed_at?.slice(0, 10) ?? "not yet"} · Words: {a.word_count} · {a.reading_minutes} min</p>
            <form action={setArticleStatus} className="space-y-2"><input type="hidden" name="slug" value={a.slug} /><input type="hidden" name="action" value="publish" /><button className="btn btn-primary w-full" disabled={!a.lint?.passed}>Publish now</button></form>
            <form action={setArticleStatus} className="space-y-2"><input type="hidden" name="slug" value={a.slug} /><input type="hidden" name="action" value="schedule" /><label className="label" htmlFor="publish_at">Schedule for</label><input className="field" id="publish_at" name="publish_at" type="datetime-local" defaultValue={a.publish_at ? a.publish_at.slice(0, 16) : defaultWhen} /><button className="btn btn-secondary w-full" disabled={!a.lint?.passed}>Schedule</button></form>
            <form action={setArticleStatus}><input type="hidden" name="slug" value={a.slug} /><input type="hidden" name="action" value="review" /><button className="btn btn-ghost w-full">Send back to review</button></form>
            <form action={setArticleStatus} className="space-y-2"><input type="hidden" name="slug" value={a.slug} /><input type="hidden" name="action" value="reject" /><input className="field" name="note" placeholder="Reason (optional)" /><button className="btn btn-ghost w-full">Reject</button></form>
            <form action={setArticleStatus}><input type="hidden" name="slug" value={a.slug} /><input type="hidden" name="action" value="archive" /><button className="btn btn-ghost w-full text-stone">Archive</button></form>
            {!a.lint?.passed && <p className="small text-error">Fix the lint errors (save re-runs the linter) before publishing.</p>}
          </div>
        )}
        <Link href="/cms/articles/" className="small">← All articles</Link>
      </div></aside>
    </div>
  );
}
