import Link from "next/link";
import type { Page, Settings } from "@/lib/types";
import { Breadcrumbs, Eyebrow } from "@/components/ui";

export const SECTION_LABELS: Record<string, string> = {
  consultations: "Consultations", therapies: "Therapies", "massage-therapy": "Massage therapy",
  "spiritual-healing": "Spiritual healing", concerns: "Wellness concerns", calgary: "Calgary",
  online: "Online across Canada", learn: "Learn", core: "", policies: "",
};

export function crumbsFor(page: Page): { name: string; href: string }[] {
  const items = [{ name: "Home", href: "/" }];
  const parts = page.slug.split("/").filter(Boolean);
  let acc = "";
  parts.forEach((p, i) => {
    acc += `/${p}/`;
    const last = i === parts.length - 1;
    items.push({ name: last ? page.h1 : (SECTION_LABELS[p] || p.replace(/-/g, " ")), href: acc });
  });
  return items;
}

/** Page header shared by most templates: breadcrumbs, eyebrow, H1, lead. */
export function PageHead({ page, eyebrow, lead, children }: { page: Page; eyebrow?: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="container pt-2 pb-10 md:pb-14">
      <Breadcrumbs items={crumbsFor(page)} />
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h1 className="max-w-4xl">{page.h1}</h1>
      {lead && <p className="lead mt-5 measure">{lead}</p>}
      {children}
    </div>
  );
}

export function DraftBanner({ page }: { page: Page }) {
  if (page.status === "published") return null;
  return (
    <div className="bg-turmeric-soft border-b border-line text-[14px]">
      <div className="container py-2 flex flex-wrap gap-x-4">
        <span className="font-semibold">Draft preview</span>
        <span>Status: {page.status}</span>
        <span>Template: {page.template}</span>
        <span>Map row {page.map_row}</span>
        {page.legal_check && <span className="text-copper-deep font-semibold">LEGAL CHECK</span>}
      </div>
    </div>
  );
}

export function PlaceholderNotice({ settings }: { settings: Settings }) {
  if (!settings.nap.placeholder) return null;
  return (
    <p className="notice notice-turmeric mt-6 measure">
      Our Calgary clinic opens soon. Until then, consultations are online, and in-person therapies are booked as the clinic address is confirmed. <Link href="/book/#discovery">Ask us on a free call</Link>.
    </p>
  );
}

export function RelatedList({ items }: { items: { href: string; name: string }[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="mb-4">Related</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((it) => <li key={it.href}><Link href={it.href} className="block card px-4 py-3 no-underline text-ink font-medium hover:bg-sandal">{it.name} →</Link></li>)}
      </ul>
    </div>
  );
}
