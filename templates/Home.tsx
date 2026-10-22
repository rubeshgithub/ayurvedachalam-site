import Link from "next/link";
import type { Article, Page, Review, Settings } from "@/lib/types";
import { Button, Card, CardGrid, CtaBand, Eyebrow, Section, Steps } from "@/components/ui";
import { Blocks } from "./blocks";
import { ARTICLE_CATEGORIES } from "@/lib/types";

/* design.md §9.1 — Hero, three paths, credential strip, featured therapies, how it works,
   reviews, latest articles, CTA band. Content from the CMS record where present. */

const PATHS = [
  { section: "consultations", eyebrow: "Consultations", title: "Online across Canada, or in Calgary", text: "A 75-minute initial consultation: your history, your routine, your digestion and sleep, then a plan you can follow.", href: "/consultations/", price: "From $135" },
  { section: "therapies", eyebrow: "Therapies", title: "Shirodhara, Abhyanga, Vasti", text: "Classical warm-oil therapies in Calgary, given by a BAMS-trained practitioner who is also a Registered Massage Therapist.", href: "/therapies/", price: "From $65" },
  { section: "spiritual-healing", eyebrow: "Spiritual healing", title: "In person and at a distance", text: "Quiet, one-to-one sessions offered as support for wellbeing, by a certified spiritual healer (ASHA).", href: "/spiritual-healing/", price: "From $70" },
];

const CREDENTIALS = [
  { k: "BAMS", v: "Bachelor of Ayurveda Medicine and Surgery, Chennai (2012)" },
  { k: "14+ yrs", v: "Practising Ayurveda in India, Qatar and Canada" },
  { k: "RMT", v: "Registered Massage Therapist, insurance receipts" },
  { k: "ASHA", v: "Certified Spiritual Healer, Alberta" },
];

export function Home({ page, settings, featured, articles, reviews }: { page: Page; settings: Settings; featured: Page[]; articles: Article[]; reviews: Review[] }) {
  const lead = page.blocks?.find((b) => b.type === "intro");
  return (
    <>
      <section className="dhara relative overflow-hidden">
        <div className="container py-16 md:py-24 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <Eyebrow className="mb-4">{settings.descriptor}</Eyebrow>
            <h1 className="display">{page.h1}</h1>
            <p className="lead mt-6 max-w-2xl">{lead && lead.type === "intro" ? lead.data.lead : page.meta_description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/book/" data-event="book_click">Book an appointment</Button>
              <Button href="/book/#discovery" variant="secondary" data-event="discovery_call_click">Free 15-minute call</Button>
            </div>
            <p className="small mt-5">{settings.nap.placeholder ? "Virtual appointments now · Calgary clinic opening soon" : `${settings.nap.street}, ${settings.nap.city}`}</p>
          </div>
          <div className="md:col-span-4">
            <div className="card p-6">
              <p className="eyebrow mb-3">The practitioner</p>
              <p className="font-display text-[22px] leading-tight">Maheswari Vedhachalam</p>
              <p className="small mt-1">BAMS · Ayurveda Practitioner · RMT</p>
              <ul className="mt-4 space-y-2 text-[15px]">
                {CREDENTIALS.map((c) => <li key={c.k} className="flex gap-3"><span className="tabular font-semibold text-neem w-16 shrink-0">{c.k}</span><span className="text-stone">{c.v}</span></li>)}
              </ul>
              <Link href="/about/practitioner/" className="inline-block mt-4 text-copper-deep font-semibold text-[15px]">About the practitioner →</Link>
            </div>
          </div>
        </div>
      </section>

      <Section tone="sandal">
        <Eyebrow className="mb-3">Three ways to begin</Eyebrow>
        <h2 className="mb-8">What are you looking for?</h2>
        <CardGrid>
          {PATHS.map((p) => (
            <div key={p.href} data-section={p.section} className="h-full">
              <Card href={p.href} eyebrow={p.eyebrow} title={p.title} text={p.text} price={p.price} />
            </div>
          ))}
        </CardGrid>
      </Section>

      {featured.length > 0 && (
        <Section tone="sesame">
          <div data-section="therapies">
            <Eyebrow className="mb-3">Therapies in Calgary</Eyebrow>
            <h2 className="mb-8">Classical therapies, explained plainly</h2>
            <CardGrid>
              {featured.slice(0, 6).map((f) => <Card key={f.slug} href={f.slug} title={f.h1} text={f.meta_description} price={f.summary?.price_from} meta={f.summary?.duration} />)}
            </CardGrid>
            <p className="mt-6"><Link href="/therapies/" className="font-semibold">All therapies and prices →</Link></p>
          </div>
        </Section>
      )}

      <Section tone="white">
        <Eyebrow className="mb-3">How it works</Eyebrow>
        <h2 className="mb-10">From first call to first session</h2>
        <Steps items={[
          { title: "A free 15-minute call", text: "Tell us what brings you. We say plainly whether Ayurveda, a therapy or spiritual healing fits, or whether to see your physician first." },
          { title: "A proper consultation", text: "Seventy-five minutes on your history, routine, digestion and sleep, including pulse reading in person. You leave with a written plan." },
          { title: "Therapies and follow-up", text: "Book therapies singly or as a package. Follow-ups are 30 minutes, online or in Calgary." },
        ]} />
      </Section>

      {reviews.length > 0 && (
        <Section tone="neem-soft">
          <Eyebrow className="mb-3">What clients say</Eyebrow>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <blockquote key={r.name + r.date} className="card p-6">
                <p className="text-[16px]">“{r.text}”</p>
                <footer className="small mt-4">{r.name} · {r.source}</footer>
              </blockquote>
            ))}
          </div>
        </Section>
      )}

      {page.blocks?.some((b) => b.type !== "intro") && (
        <Section tone="sesame"><div className="max-w-3xl"><Blocks blocks={page.blocks?.filter((b) => b.type !== "intro")} /></div></Section>
      )}

      {articles.length > 0 && (
        <Section tone="sesame">
          <Eyebrow className="mb-3">Learn</Eyebrow>
          <h2 className="mb-8">Plain answers about Ayurveda in Canada</h2>
          <CardGrid>
            {articles.slice(0, 3).map((a) => <Card key={a.slug} href={`/learn/${a.slug}/`} eyebrow={ARTICLE_CATEGORIES[a.category]} title={a.h1} text={a.excerpt} meta={`${a.reading_minutes ?? 5} min read`} />)}
          </CardGrid>
        </Section>
      )}

      <CtaBand heading="Ready when you are" text="Book online in two minutes, or start with a free 15-minute call to see whether this is the right fit." primary={{ label: "Book an appointment", href: "/book/" }} secondary={{ label: "Free 15-minute call", href: "/book/#discovery" }} />
    </>
  );
}
