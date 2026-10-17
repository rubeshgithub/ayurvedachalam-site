import Link from "next/link";
import type { Article as ArticleT, Author, Settings } from "@/lib/types";
import { ARTICLE_CATEGORIES } from "@/lib/types";
import { Breadcrumbs, Button, CardGrid, Disclaimer, Eyebrow, FaqList, Notice } from "@/components/ui";
import { ArticleCard } from "./Generic";

const fmt = (d?: string | null) => d ? new Date(d).toLocaleDateString("en-CA", { day: "numeric", month: "long", year: "numeric" }) : null;

export function Article({ article: a, author, settings, related }: { article: ArticleT; author: Author; settings: Settings; related: ArticleT[] }) {
  const serviceLink = a.internal_links?.find((l) => /^\/(consultations|therapies|spiritual-healing|massage-therapy)\/[^/]+\/$/.test(l));
  return (
    <div data-section="learn">
      <div className="container pt-2">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Learn", href: "/learn/" }, { name: ARTICLE_CATEGORIES[a.category], href: `/learn/category/${a.category}/` }, { name: a.h1, href: `/learn/${a.slug}/` }]} />
        {a.status !== "published" && <p className="notice notice-turmeric mb-4 text-[14px]"><strong>Preview</strong> · status {a.status}{a.lint && !a.lint.passed ? ` · lint errors: ${a.lint.errors.length}` : ""}</p>}
      </div>
      <header className="container pb-10 max-w-4xl">
        <Eyebrow className="mb-3">{ARTICLE_CATEGORIES[a.category]}</Eyebrow>
        <h1>{a.h1}</h1>
        <p className="small mt-5 flex flex-wrap gap-x-3 gap-y-1">
          <span>By <Link href="/about/practitioner/" className="font-semibold text-ink">{author.name}</Link>, {author.job_title}</span>
          {a.reviewed_at ? <span>· Reviewed {fmt(a.reviewed_at)}</span> : <span>· Awaiting practitioner review</span>}
          {a.published_at && <span>· Published {fmt(a.published_at)}</span>}
          <span>· {a.reading_minutes ?? 5} min read</span>
        </p>
      </header>

      <div className="container grid gap-12 lg:grid-cols-12 pb-16">
        <article className="lg:col-span-8">
          {a.hero_image?.src && <figure className="mb-10"><img src={a.hero_image.src} alt={a.hero_image.alt ?? ""} className="rounded-lg w-full" width={1200} height={675} />{a.hero_image.credit && <figcaption className="small mt-2">{a.hero_image.credit}</figcaption>}</figure>}
          <div className="prose" dangerouslySetInnerHTML={{ __html: a.body_html ?? "" }} />
          {a.faqs?.length ? <div className="mt-14"><FaqList items={a.faqs} /></div> : null}
          {a.sources?.length ? (
            <section className="mt-14">
              <h2 className="mb-4">Sources</h2>
              <ol className="list-decimal pl-6 space-y-2 text-[15px] measure">
                {a.sources.map((s) => <li key={s.url}>{s.publisher ? `${s.publisher}, ` : ""}<a href={s.url} rel="noopener" target="_blank">{s.title}</a>{s.accessed ? ` (accessed ${s.accessed})` : ""}</li>)}
              </ol>
            </section>
          ) : null}
          <Disclaimer text={settings.notices.complementary} />
          {a.category === "spiritual-healing" && <div className="mt-6 space-y-3"><Notice>{settings.notices.spiritual}</Notice><Notice tone="turmeric">{settings.notices.crisis}</Notice></div>}
          {a.category === "herbs-and-safety" && <div className="mt-6"><Notice>{settings.notices.npn}</Notice></div>}

          <div className="card p-6 mt-12 flex gap-5 items-start">
            <div className="w-16 h-16 rounded-full bg-neem-soft shrink-0 overflow-hidden">{author.photo && <img src={author.photo} alt="" className="w-full h-full object-cover" />}</div>
            <div><p className="font-semibold">{author.name}</p><p className="small">{author.credentials}</p><p className="text-[15px] mt-2 text-stone">{author.bio}</p><Link href="/about/practitioner/" className="text-[15px] font-semibold text-copper-deep inline-block mt-2">About the practitioner →</Link></div>
          </div>
        </article>

        <aside className="lg:col-span-4">
          <div className="sticky-summary space-y-5">
            <div className="card card-accent p-6">
              <p className="eyebrow mb-2">Next step</p>
              <p className="text-[15px] text-stone">Questions about your own situation? Start with a free 15-minute call.</p>
              <div className="mt-4 grid gap-2">
                <Button href="/book/#discovery" data-event="discovery_call_click">Free 15-minute call</Button>
                {serviceLink && <Button href={serviceLink} variant="secondary">See the service</Button>}
              </div>
            </div>
            <form action="/api/forms/newsletter" method="post" className="card p-6">
              <p className="eyebrow mb-2">Monthly letter</p>
              <p className="text-[15px] text-stone mb-3">Seasonal routines, Canadian-kitchen Ayurveda, and new articles. One email a month.</p>
              <label className="label" htmlFor="nl-email">Email</label>
              <input className="field" id="nl-email" name="email" type="email" required />
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <input type="hidden" name="source" value={`/learn/${a.slug}/`} />
              <label className="flex gap-2 text-[14px] mt-3"><input type="checkbox" name="consent" value="yes" required className="mt-1" /><span>Yes, send me Ayurvedachalam’s monthly email. I can unsubscribe at any time.</span></label>
              <button type="submit" className="btn btn-secondary mt-4 w-full" data-event="newsletter_signup">Subscribe</button>
            </form>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-sandal py-14"><div className="container"><h2 className="mb-8">Keep reading</h2><CardGrid>{related.slice(0, 3).map((r) => <ArticleCard key={r.slug} a={r} />)}</CardGrid></div></section>
      )}
    </div>
  );
}

export function ArticleIndex({ articles, category, page, totalPages, settings }: { articles: ArticleT[]; category?: ArticleT["category"]; page: number; totalPages: number; settings: Settings }) {
  const base = category ? `/learn/category/${category}/` : "/learn/";
  const [featured, ...others] = page === 1 && !category ? articles : [undefined, ...articles];
  return (
    <div data-section="learn">
      <div className="container pt-2 pb-10">
        <Breadcrumbs items={category ? [{ name: "Home", href: "/" }, { name: "Learn", href: "/learn/" }, { name: ARTICLE_CATEGORIES[category], href: base }] : [{ name: "Home", href: "/" }, { name: "Learn", href: "/learn/" }]} />
        <Eyebrow className="mb-3">Learn</Eyebrow>
        <h1>{category ? ARTICLE_CATEGORIES[category] : "Plain answers about Ayurveda in Canada"}</h1>
        <p className="lead mt-5 measure">Written and reviewed by {settings.site_name}’s practitioner. Every figure is sourced; every rule is checked against Canadian law.</p>
        <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
          <Link href="/learn/" className={`btn ${!category ? "btn-primary" : "btn-secondary"} !py-2 !px-4 !min-h-0 text-[14px]`}>All</Link>
          {Object.entries(ARTICLE_CATEGORIES).map(([k, v]) => <Link key={k} href={`/learn/category/${k}/`} className={`btn ${category === k ? "btn-primary" : "btn-secondary"} !py-2 !px-4 !min-h-0 text-[14px]`}>{v}</Link>)}
        </nav>
      </div>
      <div className="container pb-16">
        {featured && (
          <Link href={`/learn/${featured.slug}/`} className="card card-accent block p-8 md:p-10 mb-8 no-underline">
            <Eyebrow className="mb-2">Featured · {ARTICLE_CATEGORIES[featured.category]}</Eyebrow>
            <h2 className="text-ink">{featured.h1}</h2>
            <p className="text-stone mt-3 measure">{featured.excerpt}</p>
            <span className="inline-block mt-4 text-copper-deep font-semibold">Read the article →</span>
          </Link>
        )}
        {others.length ? <CardGrid>{(others as ArticleT[]).map((a) => <ArticleCard key={a.slug} a={a} />)}</CardGrid> : !featured && <p className="text-stone">Articles are on their way. Three new ones every week once we launch.</p>}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex gap-2 justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => <Link key={n} href={n === 1 ? base : `${base}page/${n}/`} aria-current={n === page ? "page" : undefined} className={`btn ${n === page ? "btn-primary" : "btn-secondary"} !min-h-0 !py-2 !px-4`}>{n}</Link>)}
          </nav>
        )}
      </div>
    </div>
  );
}
