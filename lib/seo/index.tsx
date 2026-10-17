import type { Metadata } from "next";
import type { Article, Author, Faq, Page, Settings } from "@/lib/types";

export const SITE_URL = (process.env.SITE_URL || "https://ayurvedachalam.com").replace(/\/$/, "");
export const abs = (path: string) => `${SITE_URL}${path}`;

/** architecture.md §9 — every page: title, description, canonical, OG/Twitter. */
export function buildMetadata(opts: { title: string; description: string; path: string; noindex?: boolean; type?: "website" | "article"; image?: string; publishedTime?: string; modifiedTime?: string }): Metadata {
  if (!opts.title || !opts.description) throw new Error(`Missing title or description for ${opts.path}`);
  const url = abs(opts.path);
  const image = opts.image || `${SITE_URL}/og?title=${encodeURIComponent(opts.title)}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: opts.title, description: opts.description, url, siteName: "Ayurvedachalam", locale: "en_CA",
      type: opts.type ?? "website", images: [{ url: image, width: 1200, height: 630 }],
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image] },
  };
}

/* ------------------------------------------------------------ JSON-LD */

type JsonLd = Record<string, unknown>;

export function breadcrumbLd(items: { name: string; href: string }[]): JsonLd {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.href) })),
  };
}

export function faqLd(faqs: Faq[] | undefined): JsonLd | null {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Business type is HealthAndBeautyBusiness — never Physician or MedicalClinic (architecture.md §9). */
export function businessLd(s: Settings): JsonLd {
  const addr = s.nap.placeholder
    ? { "@type": "PostalAddress", addressLocality: s.nap.city, addressRegion: s.nap.region, addressCountry: s.nap.country }
    : { "@type": "PostalAddress", streetAddress: s.nap.street, addressLocality: s.nap.city, addressRegion: s.nap.region, postalCode: s.nap.postal, addressCountry: s.nap.country };
  return {
    "@context": "https://schema.org", "@type": "HealthAndBeautyBusiness", "@id": `${SITE_URL}/#business`,
    name: s.site_name, url: SITE_URL, description: s.tagline, address: addr,
    ...(s.nap.placeholder ? {} : { telephone: s.nap.phone }),
    areaServed: ["Calgary", "Alberta", "Canada"],
    priceRange: "$$",
  };
}

export function websiteLd(): JsonLd {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "Ayurvedachalam", inLanguage: "en-CA" };
}

export function personLd(a: Author): JsonLd {
  return {
    "@context": "https://schema.org", "@type": "Person", "@id": `${SITE_URL}/about/practitioner/#person`,
    name: a.name, jobTitle: a.job_title, description: a.bio, worksFor: { "@id": `${SITE_URL}/#business` },
    ...(a.photo ? { image: abs(a.photo) } : {}), ...(a.sameAs?.length ? { sameAs: a.sameAs } : {}),
  };
}

export function serviceLd(p: Page, s: Settings): JsonLd {
  return {
    "@context": "https://schema.org", "@type": "Service", name: p.h1, description: p.meta_description, url: abs(p.slug),
    provider: { "@id": `${SITE_URL}/#business` }, areaServed: p.summary?.mode?.includes("online") ? "Canada" : "Calgary",
    ...(p.summary?.price_from ? { offers: { "@type": "Offer", priceCurrency: "CAD", price: p.summary.price_from.replace(/[^0-9.]/g, ""), description: s.prices_gst_note } } : {}),
  };
}

export function articleLd(a: Article, author: Author): JsonLd {
  return {
    "@context": "https://schema.org", "@type": "Article", headline: a.h1, description: a.meta_description,
    url: abs(`/learn/${a.slug}/`), mainEntityOfPage: abs(`/learn/${a.slug}/`),
    datePublished: a.published_at ?? undefined, dateModified: a.updated_at ?? a.published_at ?? undefined,
    author: { "@type": "Person", name: author.name, jobTitle: author.job_title, url: abs("/about/practitioner/") },
    publisher: { "@id": `${SITE_URL}/#business` },
    ...(a.hero_image?.src ? { image: abs(a.hero_image.src) } : {}),
    wordCount: a.word_count,
  };
}

export function JsonLd({ data }: { data: (JsonLd | null)[] }) {
  const items = data.filter(Boolean) as JsonLd[];
  if (!items.length) return null;
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\\u003c") }} />
  );
}
