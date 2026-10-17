import type { MetadataRoute } from "next";
import { listArticles, listPages } from "@/lib/content/repo";
import { ARTICLE_CATEGORIES } from "@/lib/types";
import { abs } from "@/lib/seo";

export const revalidate = 900;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, articles] = await Promise.all([listPages({ status: "published" }), listArticles({ status: "published" })]);
  const out: MetadataRoute.Sitemap = [{ url: abs("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
  for (const p of pages) if (p.slug !== "/" && !p.noindex) out.push({ url: abs(p.slug), lastModified: p.updated_at ? new Date(p.updated_at) : new Date(), changeFrequency: "monthly", priority: p.template === "service" ? 0.8 : 0.6 });
  out.push({ url: abs("/learn/"), lastModified: new Date(), changeFrequency: "daily", priority: 0.7 });
  for (const c of Object.keys(ARTICLE_CATEGORIES)) out.push({ url: abs(`/learn/category/${c}/`), changeFrequency: "weekly", priority: 0.4 });
  for (const a of articles) out.push({ url: abs(`/learn/${a.slug}/`), lastModified: new Date(a.updated_at ?? a.published_at ?? Date.now()), changeFrequency: "monthly", priority: 0.6 });
  return out;
}
