import Link from "next/link";
import type { ReactNode } from "react";
import type { Faq } from "@/lib/types";

/* design.md §10 component library. Server components; no client JS needed. */

export function Button({ href, children, variant = "primary", className = "", ...rest }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "on-dark"; className?: string; [k: string]: unknown }) {
  const cls = `btn btn-${variant} ${className}`;
  const external = /^https?:\/\//.test(href);
  return external
    ? <a href={href} className={cls} rel="noopener" {...rest}>{children}</a>
    : <Link href={href} className={cls} {...rest}>{children}</Link>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Section({ children, tone = "sesame", className = "", id }: { children: ReactNode; tone?: "sesame" | "sandal" | "white" | "neem" | "neem-soft" | "neem-deep" | "dusk" | "accent-soft"; className?: string; id?: string }) {
  const bg: Record<string, string> = {
    sesame: "bg-sesame", sandal: "bg-sandal", white: "bg-white", "neem-soft": "bg-neem-soft", neem: "bg-neem text-white", "neem-deep": "bg-neem-deep text-white", dusk: "bg-dusk text-white", "accent-soft": "bg-accent-soft",
  };
  return <section id={id} className={`py-14 md:py-20 ${bg[tone]} ${className}`}><div className="container">{children}</div></section>;
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="small py-4">
      <ol className="flex flex-wrap gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-2">
            {i < items.length - 1 ? <Link href={it.href} className="no-underline hover:underline text-stone">{it.name}</Link> : <span aria-current="page" className="text-ink">{it.name}</span>}
            {i < items.length - 1 && <span aria-hidden className="text-line">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function FaqList({ items, heading = "Frequently asked questions" }: { items: Faq[]; heading?: string | null }) {
  if (!items?.length) return null;
  return (
    <div>
      {heading && <h2 className="mb-6">{heading}</h2>}
      <div>
        {items.map((f) => (
          <details key={f.q} className="faq">
            <summary><span>{f.q}</span></summary>
            <div className="faq-a" dangerouslySetInnerHTML={{ __html: f.a.replace(/\n/g, "<br/>") }} />
          </details>
        ))}
      </div>
    </div>
  );
}

export function Notice({ children, tone = "neem" }: { children: ReactNode; tone?: "neem" | "copper" | "turmeric" }) {
  return <div className={`notice ${tone === "copper" ? "notice-copper" : tone === "turmeric" ? "notice-turmeric" : ""}`} role="note">{children}</div>;
}

export function Card({ href, eyebrow, title, text, price, meta }: { href: string; eyebrow?: string; title: string; text?: string; price?: string; meta?: string }) {
  return (
    <Link href={href} className="card card-accent block p-6 no-underline hover:shadow-lg transition-shadow h-full">
      {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
      <h3 className="mb-2 text-ink">{title}</h3>
      {text && <p className="text-stone text-[15px] leading-relaxed">{text}</p>}
      {(price || meta) && (
        <p className="mt-4 small flex justify-between gap-3">
          <span>{meta}</span>{price && <span className="tabular text-ink">{price}</span>}
        </p>
      )}
      <span className="mt-4 inline-block text-copper-deep font-semibold text-[15px]">Learn more →</span>
    </Link>
  );
}

export function CardGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const c = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4" }[cols];
  return <div className={`grid gap-5 ${c}`}>{children}</div>;
}

export function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-6 md:grid-cols-3">
      {items.map((s, i) => (
        <li key={s.title} className="relative pl-14">
          <span aria-hidden className="absolute left-0 top-0 w-10 h-10 rounded-full bg-neem text-white font-display flex items-center justify-center text-lg">{i + 1}</span>
          <h3 className="mb-1">{s.title}</h3>
          <p className="text-stone text-[15px]">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function CtaBand({ heading, text, primary, secondary, tone = "neem-deep" }: { heading: string; text?: string; primary: { label: string; href: string }; secondary?: { label: string; href: string }; tone?: "neem-deep" | "dusk" | "copper-soft" }) {
  const dark = tone !== "copper-soft";
  return (
    <Section tone={tone === "copper-soft" ? "accent-soft" : tone} className="text-center">
      <h2 className={`mb-3 ${dark ? "text-white" : ""}`}>{heading}</h2>
      {text && <p className={`lead mx-auto max-w-2xl mb-8 ${dark ? "text-white/80" : ""}`}>{text}</p>}
      <div className="flex flex-wrap justify-center gap-3">
        <Button href={primary.href} variant={dark ? "on-dark" : "primary"} data-event="book_click">{primary.label}</Button>
        {secondary && <Button href={secondary.href} variant={dark ? "ghost" : "secondary"} className={dark ? "text-white hover:text-sandal" : ""} data-event="discovery_call_click">{secondary.label}</Button>}
      </div>
    </Section>
  );
}

export function PriceTable({ rows, caption }: { rows: { service: string; detail?: string; price: string }[]; caption?: string }) {
  return (
    <table className="price-table">
      {caption && <caption className="text-left small mb-2">{caption}</caption>}
      <thead><tr><th scope="col">Service</th><th scope="col" className="text-right">Price</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.service}>
            <td><span className="font-medium">{r.service}</span>{r.detail && <span className="block small">{r.detail}</span>}</td>
            <td className="price">{r.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Disclaimer({ text }: { text: string }) {
  return <p className="small border-t border-line pt-6 mt-12 measure">{text}</p>;
}

export function Wordmark({ dark = false, size = 26 }: { dark?: boolean; size?: number }) {
  // Wordmark B (design.md §2): "Ayurveda" Fraunces 600, "chalam" Fraunces light italic in Copper.
  // One word in the DOM so screen readers and search read "Ayurvedachalam".
  return (
    <span className="font-display leading-none tracking-tight whitespace-nowrap" style={{ fontSize: size }} aria-label="Ayurvedachalam">
      <span aria-hidden className={`font-semibold ${dark ? "text-white" : "text-neem"}`} style={{ fontVariationSettings: "'opsz' 48, 'SOFT' 20" }}>Ayurveda</span>
      <span aria-hidden className={`font-light italic ${dark ? "text-copper-soft" : "text-copper"}`} style={{ fontVariationSettings: "'opsz' 48, 'SOFT' 60" }}>chalam</span>
    </span>
  );
}
