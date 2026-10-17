import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSettings } from "@/lib/content/repo";
import { buildMetadata } from "@/lib/seo";
import { ArticleIndex } from "@/templates/Article";
import { pageOfArticles } from "../../_shared";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  return buildMetadata({ title: `Learn, page ${n} | Ayurvedachalam`, description: "More articles on Ayurveda in Canada.", path: `/learn/page/${n}/`, noindex: true });
}

export default async function LearnPaged({ params }: { params: Promise<{ n: string }> }) {
  const n = Number((await params).n);
  if (!Number.isInteger(n) || n < 1) notFound();
  if (n === 1) redirect("/learn/");
  const [{ articles, totalPages }, settings] = await Promise.all([pageOfArticles(n), getSettings()]);
  if (n > totalPages) notFound();
  return <ArticleIndex articles={articles} page={n} totalPages={totalPages} settings={settings} />;
}
