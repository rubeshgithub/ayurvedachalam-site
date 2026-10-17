import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/content/repo";
import { buildMetadata } from "@/lib/seo";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "@/lib/types";
import { ArticleIndex } from "@/templates/Article";
import { pageOfArticles } from "../../_shared";

export const revalidate = 300;

export function generateStaticParams() { return Object.keys(ARTICLE_CATEGORIES).map((cat) => ({ cat })); }

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params;
  const label = ARTICLE_CATEGORIES[cat as ArticleCategory];
  if (!label) notFound();
  return buildMetadata({ title: `${label}: Articles | Ayurvedachalam`, description: `Articles about ${label.toLowerCase()} from Ayurvedachalam, Calgary.`, path: `/learn/category/${cat}/` });
}

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  if (!(cat in ARTICLE_CATEGORIES)) notFound();
  const category = cat as ArticleCategory;
  const [{ articles, totalPages }, settings] = await Promise.all([pageOfArticles(1, category), getSettings()]);
  return <ArticleIndex articles={articles} category={category} page={1} totalPages={totalPages} settings={settings} />;
}
