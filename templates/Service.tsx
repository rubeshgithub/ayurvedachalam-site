import Link from "next/link";
import type { Page, Settings } from "@/lib/types";
import type { PriceRow } from "@/lib/content/repo";
import { Button, CtaBand, Disclaimer, FaqList, Notice } from "@/components/ui";
import { Blocks } from "./blocks";
import { PageHead, PlaceholderNotice, RelatedList, SECTION_LABELS } from "./shared";

/* design.md §9.3 — service page with sticky summary box.
   Required parts (rules.md R1.5): "Who should avoid this" list, disclaimer, CTA. */

export function Service({ page, settings, price, related }: { page: Page; settings: Settings; price: PriceRow | null; related: { href: string; name: string }[] }) {
  const s = page.summary ?? {};
  const duration = s.duration ?? price?.duration;
  const priceFrom = s.price_from ?? price?.price_from;
  const isSpiritual = page.section === "spiritual-healing";
  const isMassage = page.section === "massage-therapy";
  const hasAvoid = page.blocks?.some((b) => b.type === "list" && b.data.tone === "avoid");
  const lead = page.blocks?.find((b) => b.type === "intro");

  return (
    <div data-section={page.section}>
      <PageHead page={page} eyebrow={SECTION_LABELS[page.section]} lead={lead?.type === "intro" ? lead.data.lead : undefined}>
        <PlaceholderNotice settings={settings} />
      </PageHead>

      <div className="container grid gap-10 lg:grid-cols-12 pb-16">
        <article className="lg:col-span-8">
          <Blocks blocks={page.blocks?.filter((b) => b.type !== "intro" && b.type !== "faq")} />
          {!hasAvoid && page.status !== "published" && (
            <Notice tone="copper">Editor: this service page still needs a “Who should avoid this” list (rules.md R1.5).</Notice>
          )}
          {page.faqs && page.faqs.length > 0 && <div className="mt-14"><FaqList items={page.faqs} /></div>}
          <div className="mt-14"><RelatedList items={related} /></div>
          {isSpiritual && (
            <div className="mt-10 space-y-3">
              <Notice>{settings.notices.spiritual}</Notice>
              <Notice tone="turmeric">{settings.notices.crisis}</Notice>
            </div>
          )}
          {isMassage && <div className="mt-10"><Notice>{settings.notices.insurance}</Notice></div>}
          <Disclaimer text={settings.notices.complementary} />
        </article>

        <aside className="lg:col-span-4">
          <div className="sticky-summary card card-accent p-6">
            <p className="eyebrow mb-3">At a glance</p>
            <dl className="space-y-3 text-[15px]">
              {duration && <div className="flex justify-between gap-4"><dt className="text-stone">Length</dt><dd className="font-medium tabular">{duration}</dd></div>}
              {priceFrom && <div className="flex justify-between gap-4"><dt className="text-stone">Price</dt><dd className="font-medium tabular">{priceFrom}{s.price_note ? <span className="small block">{s.price_note}</span> : null}</dd></div>}
              <div className="flex justify-between gap-4"><dt className="text-stone">Where</dt><dd className="font-medium text-right">{s.location ?? (s.mode?.includes("online") && !s.mode.includes("in-person") ? "Online, across Canada" : s.mode?.includes("online") ? "Calgary or online" : "Calgary, in person")}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone">With</dt><dd className="font-medium text-right">Maheswari Vedhachalam, BAMS</dd></div>
            </dl>
            <p className="small mt-3">{settings.prices_gst_note}</p>
            <div className="mt-5 grid gap-2">
              <Button href={settings.booking_url} data-event="book_click" data-service={page.slug}>Book this</Button>
              <Button href="/book/#discovery" variant="secondary" data-event="discovery_call_click">Ask on a free call</Button>
            </div>
            <p className="small mt-4"><Link href="/pricing/">Full price list and packages →</Link></p>
          </div>
        </aside>
      </div>

      <CtaBand tone={isSpiritual ? "dusk" : "neem-deep"} heading={`Book ${page.h1.replace(/ in Calgary$/i, "")}`} text="Online booking takes two minutes. Not sure yet? Start with a free call." primary={{ label: "Book now", href: "/book/" }} secondary={{ label: "Free 15-minute call", href: "/book/#discovery" }} />
    </div>
  );
}
