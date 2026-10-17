import type { Metadata } from "next";
import { getPage, getSettings, listArticles, listPages, listReviews } from "@/lib/content/repo";
import { buildMetadata } from "@/lib/seo";
import { Home } from "@/templates/Home";
import { DraftBanner } from "@/templates/shared";
import type { Page } from "@/lib/types";

export const revalidate = 300;

const fallback: Page = {
  slug: "/", template: "home", section: "core", wave: 1, status: "draft",
  title_tag: "Ayurveda in Calgary and Online Across Canada | Ayurvedachalam",
  meta_description: "Authentic Ayurveda from a BAMS-trained practitioner: consultations online across Canada, warm-oil therapies and spiritual healing in Calgary.",
  h1: "Ayurveda in Calgary, and online across Canada",
};

export async function generateMetadata(): Promise<Metadata> {
  const p = (await getPage("/")) ?? fallback;
  return buildMetadata({ title: p.title_tag || fallback.title_tag, description: p.meta_description || fallback.meta_description, path: "/", noindex: p.status !== "published" });
}

export default async function HomePage() {
  const [page, settings, therapies, articles, reviews] = await Promise.all([
    getPage("/"), getSettings(), listPages({ section: "therapies", template: "service" }), listArticles({ limit: 3 }), listReviews(3),
  ]);
  const p = page ? { ...fallback, ...page, h1: page.h1 || fallback.h1, meta_description: page.meta_description || fallback.meta_description } : fallback;
  return (<><DraftBanner page={p} /><Home page={p} settings={settings} featured={therapies} articles={articles} reviews={reviews} /></>);
}
