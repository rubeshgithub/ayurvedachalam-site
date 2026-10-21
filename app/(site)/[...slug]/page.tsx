import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { findRedirect, getArticle, getAuthor, getPage, getPrices, getSettings, listChildren, listPages, priceFor } from "@/lib/content/repo";
import { JsonLd, breadcrumbLd, buildMetadata, faqLd, personLd, serviceLd } from "@/lib/seo";
import { Service } from "@/templates/Service";
import { Booking, Concern, Contact, Hub, Legal, Location, Pricing, Profile, Region, Utility } from "@/templates/Generic";
import { DraftBanner, crumbsFor } from "@/templates/shared";
import type { Page } from "@/lib/types";

export const revalidate = 300;
export const dynamicParams = true;

const toSlug = (parts: string[]) => `/${parts.join("/")}/`;
const isPreview = async () => process.env.NODE_ENV !== "production" || process.env.PREVIEW_DRAFTS === "1" || (await draftMode()).isEnabled;

async function load(parts: string[]): Promise<Page> {
  const slug = toSlug(parts);
  const page = await getPage(slug);
  if (!page || (page.status !== "published" && !(await isPreview()))) {
    const r = await findRedirect(slug);
    if (r) (r.code === 301 ? permanentRedirect : redirect)(r.to);
    notFound();
  }
  return page;
}

export async function generateStaticParams() {
  if (process.env.SKIP_STATIC_PARAMS === "1") return [];
  const pages = await listPages({ status: "published" });
  return pages.filter((p) => p.slug !== "/" && !p.slug.startsWith("/learn/")).map((p) => ({ slug: p.slug.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await load(slug);
  return buildMetadata({
    title: p.title_tag || p.h1, description: p.meta_description || `${p.h1} — Ayurvedachalam, Calgary.`, path: p.slug,
    noindex: p.noindex || p.status !== "published", type: "website",
  });
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await load(slug);
  if (page.slug === "/learn/") redirect("/learn/");
  const settings = await getSettings();
  const crumbs = breadcrumbLd(crumbsFor(page));
  const preview = await isPreview();
  const related = await Promise.all((page.related ?? []).map(async (s) => {
    if (s.startsWith("/learn/")) { const a = await getArticle(s.replace(/^\/learn\//, "").replace(/\/$/, "")); return a && (a.status === "published" || preview) ? { href: s, name: a.h1 } : null; }
    const r = await getPage(s); return r && (r.status === "published" || preview) ? { href: s, name: r.h1 } : null;
  }));
  const relatedClean = related.filter(Boolean) as { href: string; name: string }[];

  let body: React.ReactNode;
  const ld: (Record<string, unknown> | null)[] = [crumbs, faqLd(page.faqs)];

  switch (page.template) {
    case "hub": body = <Hub page={page} settings={settings} children={await listChildren(page.slug)} />; break;
    case "service": {
      const price = await priceFor(page.slug);
      const siblings = relatedClean.length ? relatedClean : (await listChildren(`/${page.section}/`)).filter((s) => s.slug !== page.slug).slice(0, 2).map((s) => ({ href: s.slug, name: s.h1 }));
      ld.push(serviceLd({ ...page, summary: { ...page.summary, price_from: page.summary?.price_from ?? price?.price_from } }, settings));
      body = <Service page={page} settings={settings} price={price} related={[...siblings, { href: `/${page.section}/`, name: `All ${page.section.replace(/-/g, " ")}` }]} />; break;
    }
    case "concern": body = <Concern page={page} settings={settings} related={relatedClean} />; break;
    case "location": body = <Location page={page} settings={settings} services={await listPages({ section: "therapies", template: "service" })} />; break;
    case "region": body = <Region page={page} settings={settings} services={await listPages({ section: "consultations", template: "service" })} />; break;
    case "profile": { const a = (await getAuthor(page.author_id ?? "practitioner"))!; ld.push(personLd(a)); body = <Profile page={page} settings={settings} author={a} />; break; }
    case "pricing": body = <Pricing page={page} settings={settings} prices={await getPrices()} />; break;
    case "booking": body = <Booking page={page} settings={settings} />; break;
    case "contact": body = <Contact page={page} settings={settings} />; break;
    case "legal": body = <Legal page={page} />; break;
    default: body = <Utility page={page} settings={settings} />;
  }

  return (<><DraftBanner page={page} />{body}<JsonLd data={ld} /></>);
}
