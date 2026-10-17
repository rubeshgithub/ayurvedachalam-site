import Link from "next/link";
import type { Article, Author, Page, Settings } from "@/lib/types";
import type { PriceBook } from "@/lib/content/repo";
import { Button, Card, CardGrid, CtaBand, Disclaimer, Eyebrow, FaqList, Notice, PriceTable, Section } from "@/components/ui";
import { Blocks } from "./blocks";
import { PageHead, PlaceholderNotice, RelatedList, SECTION_LABELS } from "./shared";
import { ARTICLE_CATEGORIES } from "@/lib/types";

/* The remaining templates (architecture.md §5). Each is small; they share PageHead and Blocks. */

const leadOf = (p: Page) => { const b = p.blocks?.find((x) => x.type === "intro"); return b?.type === "intro" ? b.data.lead : undefined; };
const rest = (p: Page) => p.blocks?.filter((x) => x.type !== "intro" && x.type !== "faq");

export function Hub({ page, settings, children }: { page: Page; settings: Settings; children: Page[] }) {
  const isSpiritual = page.section === "spiritual-healing";
  return (
    <div data-section={page.section}>
      <PageHead page={page} eyebrow={SECTION_LABELS[page.section]} lead={leadOf(page) ?? page.meta_description}><PlaceholderNotice settings={settings} /></PageHead>
      <Section tone={isSpiritual ? "dusk" : "sandal"}>
        {children.length ? (
          <CardGrid>{children.map((c) => <Card key={c.slug} href={c.slug} title={c.h1} text={c.meta_description} price={c.summary?.price_from} meta={c.summary?.duration} />)}</CardGrid>
        ) : <p className={isSpiritual ? "text-white/85" : "text-stone"}>Pages in this section are being prepared.</p>}
      </Section>
      <div className="container py-14"><Blocks blocks={rest(page)} />{page.faqs?.length ? <div className="mt-14"><FaqList items={page.faqs} /></div> : null}
        {isSpiritual && <div className="mt-10 space-y-3"><Notice>{settings.notices.spiritual}</Notice><Notice tone="turmeric">{settings.notices.crisis}</Notice></div>}
        {page.section === "massage-therapy" && <div className="mt-10"><Notice>{settings.notices.insurance}</Notice></div>}
        <Disclaimer text={settings.notices.complementary} /></div>
      <CtaBand tone={isSpiritual ? "dusk" : "neem-deep"} heading="Not sure where to start?" text="A free 15-minute call is the simplest first step." primary={{ label: "Book a free call", href: "/book/#discovery" }} secondary={{ label: "Book an appointment", href: "/book/" }} />
    </div>
  );
}

export function Concern({ page, settings, related }: { page: Page; settings: Settings; related: { href: string; name: string }[] }) {
  const hasRedFlags = page.blocks?.some((b) => b.type === "list" && /physician/i.test(b.data.heading));
  return (
    <div data-section="concerns">
      <PageHead page={page} eyebrow="Wellness concerns" lead={leadOf(page)} />
      <div className="container pb-16 grid gap-10 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <Blocks blocks={rest(page)} />
          {!hasRedFlags && page.status !== "published" && <Notice tone="copper">Editor: every concern page needs a “When to see a physician” section with red flags (rules.md R1.5).</Notice>}
          {page.faqs?.length ? <div className="mt-14"><FaqList items={page.faqs} /></div> : null}
          <div className="mt-14"><RelatedList items={related} /></div>
          <Disclaimer text={settings.notices.complementary} />
        </article>
        <aside className="lg:col-span-4"><div className="sticky-summary card p-6"><p className="eyebrow mb-3">Talk it through</p><p className="text-[15px] text-stone">A free 15-minute call is the easiest way to find out whether a consultation or a therapy fits.</p><div className="mt-5 grid gap-2"><Button href="/book/#discovery" data-event="discovery_call_click">Book a free call</Button><Button href="/consultations/" variant="secondary">See consultations</Button></div></div></aside>
      </div>
    </div>
  );
}

export function Location({ page, settings, services }: { page: Page; settings: Settings; services: Page[] }) {
  return (
    <div data-section="calgary">
      <PageHead page={page} eyebrow="Calgary" lead={leadOf(page) ?? page.meta_description} />
      <div className="container pb-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Blocks blocks={rest(page)} />
          <h2 className="mt-12 mb-6">Services in Calgary</h2>
          <CardGrid cols={2}>{services.slice(0, 6).map((s) => <Card key={s.slug} href={s.slug} title={s.h1} price={s.summary?.price_from} meta={s.summary?.duration} />)}</CardGrid>
          {page.faqs?.length ? <div className="mt-14"><FaqList items={page.faqs} /></div> : null}
          <Disclaimer text={settings.notices.complementary} />
        </div>
        <aside className="lg:col-span-4"><NapCard settings={settings} /></aside>
      </div>
    </div>
  );
}

export function NapCard({ settings }: { settings: Settings }) {
  return (
    <div className="sticky-summary card p-6">
      <p className="eyebrow mb-3">Find us</p>
      <address className="not-italic text-[15px] space-y-1">
        <p className="font-semibold">{settings.nap.name}</p>
        <p>{settings.nap.placeholder ? "Clinic address to be announced" : settings.nap.street}</p>
        <p>{settings.nap.city}, {settings.nap.region} {settings.nap.postal}</p>
        <p><a href={`mailto:${settings.nap.email}`}>{settings.nap.email}</a></p>
        {!settings.nap.placeholder && <p><a href={`tel:${settings.nap.phone}`} data-event="phone_click">{settings.nap.phone}</a></p>}
      </address>
      <h3 className="mt-6 mb-2 text-[17px]">Hours</h3>
      <dl className="text-[15px]">{settings.hours.map((h) => <div key={h.day} className="flex justify-between gap-3"><dt className="text-stone">{h.day}</dt><dd className="tabular">{h.open}{h.close ? `–${h.close}` : ""}</dd></div>)}</dl>
      {settings.nap.placeholder && <p className="small mt-4">Hours shown are planned hours for the clinic.</p>}
      <div className="mt-5 grid gap-2"><Button href="/book/" data-event="book_click">Book</Button></div>
    </div>
  );
}

export function Region({ page, settings, services }: { page: Page; settings: Settings; services: Page[] }) {
  return (
    <div data-section="consultations">
      <PageHead page={page} eyebrow="Online across Canada" lead={leadOf(page) ?? page.meta_description} />
      <div className="container pb-16">
        <Blocks blocks={rest(page)} />
        <h2 className="mt-12 mb-6">Available online</h2>
        <CardGrid>{services.filter((s) => s.summary?.mode?.includes("online")).slice(0, 6).map((s) => <Card key={s.slug} href={s.slug} title={s.h1} price={s.summary?.price_from} meta={s.summary?.duration} />)}</CardGrid>
        {page.faqs?.length ? <div className="mt-14"><FaqList items={page.faqs} /></div> : null}
        <Disclaimer text={settings.notices.complementary} />
      </div>
      <CtaBand heading="Book an online consultation" text="Video sessions across Canada, in your time zone." primary={{ label: "Book online", href: "/book/" }} secondary={{ label: "Free 15-minute call", href: "/book/#discovery" }} />
    </div>
  );
}

export function Profile({ page, settings, author }: { page: Page; settings: Settings; author: Author }) {
  return (
    <div data-section="core">
      <PageHead page={page} eyebrow="About" />
      <div className="container pb-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="card overflow-hidden">
            <div className="aspect-[4/5] bg-neem-soft flex items-center justify-center text-stone small">{author.photo ? <img src={author.photo} alt={author.name} className="w-full h-full object-cover" /> : "Portrait to come"}</div>
            <div className="p-6"><p className="font-display text-[22px]">{author.name}</p><p className="small mt-1">{author.job_title}</p></div>
          </div>
        </div>
        <article className="lg:col-span-8">
          <h2 className="mb-4">Credentials</h2>
          <table className="price-table mb-10"><tbody>
            <tr><th scope="row" className="normal-case tracking-normal text-ink text-[15px] font-semibold">Degree</th><td>Bachelor of Ayurveda Medicine and Surgery (BAMS), Dr. M.G.R. Medical University, Chennai, India, 2012 — 5½ years of study and a hospital internship at the Government General Hospital, Chennai</td></tr>
            <tr><th scope="row" className="normal-case tracking-normal text-ink text-[15px] font-semibold">Experience</th><td>Over 14 years practising Ayurveda in India, Qatar and Canada</td></tr>
            <tr><th scope="row" className="normal-case tracking-normal text-ink text-[15px] font-semibold">Registrations</th><td>Registered with AYUSH (India); member, Indian Medical Association; credentials evaluated by WES Canada</td></tr>
            <tr><th scope="row" className="normal-case tracking-normal text-ink text-[15px] font-semibold">Massage therapy</th><td>Registered Massage Therapist (association and member number to be shown here)</td></tr>
            <tr><th scope="row" className="normal-case tracking-normal text-ink text-[15px] font-semibold">Spiritual healing</th><td>Certified Spiritual Healer, Association of Spiritual Healers of Alberta (ASHA)</td></tr>
            <tr><th scope="row" className="normal-case tracking-normal text-ink text-[15px] font-semibold">Herbs</th><td>Certified Herbalist (Alberta)</td></tr>
          </tbody></table>
          <Notice>BAMS is a university degree in Ayurvedic medicine from India. It is not a medical doctor qualification in Canada, and Ayurveda is not a regulated health profession in any province. <Link href="/learn/is-ayurveda-regulated-in-canada/">Read what that means</Link>.</Notice>
          <div className="mt-10"><Blocks blocks={rest(page)} /></div>
          {page.faqs?.length ? <div className="mt-14"><FaqList items={page.faqs} /></div> : null}
          <Disclaimer text={settings.notices.complementary} />
        </article>
      </div>
    </div>
  );
}

export function Pricing({ page, settings, prices }: { page: Page; settings: Settings; prices: PriceBook }) {
  return (
    <div data-section="core">
      <PageHead page={page} eyebrow="Prices" lead={leadOf(page) ?? `${settings.prices_gst_note} Packages are prepaid.`} />
      <div className="container pb-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-12">
          {prices.groups.map((g) => (
            <div key={g.heading} data-section={g.section}>
              <h2 className="mb-4">{g.heading}</h2>
              <PriceTable rows={g.rows.filter((r) => r.price !== "$0" || r.slug === "/book/")} />
            </div>
          ))}
          <div><h2 className="mb-4">Packages</h2><PriceTable rows={prices.packages} /><p className="small mt-3">{prices.package_terms}</p></div>
          <Blocks blocks={rest(page)} />
          {page.faqs?.length ? <FaqList items={page.faqs} /> : null}
          <Notice>{settings.notices.insurance}</Notice>
          <Disclaimer text={settings.notices.complementary} />
        </div>
        <aside className="lg:col-span-4"><div className="sticky-summary card p-6"><p className="eyebrow mb-3">Book</p><p className="text-[15px] text-stone">{settings.prices_gst_note} Pay at the time of your session; packages are prepaid.</p><div className="mt-5 grid gap-2"><Button href="/book/" data-event="book_click">Book an appointment</Button><Button href="/book/#discovery" variant="secondary">Free 15-minute call</Button></div></div></aside>
      </div>
    </div>
  );
}

export function Booking({ page, settings }: { page: Page; settings: Settings }) {
  return (
    <div data-section="core">
      <PageHead page={page} eyebrow="Book" lead={leadOf(page) ?? "Choose a service and a time. Intake forms, reminders and receipts are handled securely by our booking system."} />
      <div className="container pb-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {settings.booking_embed_url ? (
            <iframe src={settings.booking_embed_url} title="Online booking" className="w-full min-h-[720px] card" loading="lazy" />
          ) : (
            <div className="card p-8"><h2 className="mb-3">Online booking</h2><p className="text-stone mb-6">Our booking page opens in a new tab.</p><Button href={settings.booking_url} data-event="book_click">Open booking</Button></div>
          )}
          <div id="discovery" className="card card-accent p-8 mt-8 scroll-mt-28">
            <Eyebrow className="mb-2">Free 15-minute discovery call</Eyebrow>
            <h2 className="mb-3">Not sure what to book?</h2>
            <p className="text-stone mb-6 measure">Tell us what brings you. We will say plainly whether a consultation, a therapy or spiritual healing fits, or whether to see your physician first. No charge, no obligation.</p>
            <Button href={settings.booking_url} data-event="discovery_call_click">Book a free call</Button>
          </div>
          <Blocks blocks={rest(page)} />
          {page.faqs?.length ? <div className="mt-14"><FaqList items={page.faqs} /></div> : null}
          <Disclaimer text={settings.notices.complementary} />
        </div>
        <aside className="lg:col-span-4"><NapCard settings={settings} /></aside>
      </div>
    </div>
  );
}

export function Contact({ page, settings }: { page: Page; settings: Settings }) {
  return (
    <div data-section="core">
      <PageHead page={page} eyebrow="Contact" lead={leadOf(page) ?? "Questions about a service, prices or how a session works? Send a note and we will reply within one business day."} />
      <div className="container pb-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <form action="/api/forms/contact" method="post" className="card p-6 md:p-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="label" htmlFor="name">Name</label><input className="field" id="name" name="name" required autoComplete="name" /></div>
              <div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" required autoComplete="email" /></div>
            </div>
            <div><label className="label" htmlFor="phone">Phone (optional)</label><input className="field" id="phone" name="phone" type="tel" autoComplete="tel" /></div>
            <div>
              <label className="label" htmlFor="message">Message</label>
              <p className="notice notice-turmeric mb-2 text-[14px]">{settings.notices.contact_form}</p>
              <textarea className="field" id="message" name="message" rows={5} required />
            </div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <label className="flex gap-3 text-[15px]"><input type="checkbox" name="consent" value="yes" required className="mt-1" /><span>I agree that Ayurvedachalam may contact me about my enquiry. We never share your details.</span></label>
            <button type="submit" className="btn btn-primary" data-event="contact_submit">Send message</button>
          </form>
          <Blocks blocks={rest(page)} />
        </div>
        <aside className="lg:col-span-5"><NapCard settings={settings} /></aside>
      </div>
    </div>
  );
}

export function Legal({ page }: { page: Page }) {
  return (
    <div data-section="policies">
      <PageHead page={page} />
      <div className="container pb-16"><Blocks blocks={rest(page)} />{page.updated_at && <p className="small mt-10">Last updated {page.updated_at}</p>}</div>
    </div>
  );
}

export function Utility({ page, settings }: { page: Page; settings: Settings }) {
  return (
    <div data-section={page.section}>
      <PageHead page={page} eyebrow={SECTION_LABELS[page.section]} lead={leadOf(page)} />
      <div className="container pb-16">
        <Blocks blocks={rest(page)} />
        {page.faqs?.length ? <div className="mt-14"><FaqList items={page.faqs} /></div> : null}
        {page.slug === "/insurance-direct-billing/" && <div className="mt-10"><Notice>{settings.notices.insurance}</Notice></div>}
        <Disclaimer text={settings.notices.complementary} />
      </div>
    </div>
  );
}

export function ArticleCard({ a }: { a: Article }) {
  return <Card href={`/learn/${a.slug}/`} eyebrow={ARTICLE_CATEGORIES[a.category]} title={a.h1} text={a.excerpt} meta={`${a.reading_minutes ?? 5} min read`} />;
}
