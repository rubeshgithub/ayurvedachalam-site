import type { Metadata } from "next";
import { getSettings } from "@/lib/content/repo";
import { buildMetadata } from "@/lib/seo";
import { ArticleIndex } from "@/templates/Article";
import { pageOfArticles } from "./_shared";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Learn Ayurveda: Plain Answers for Canada | Ayurvedachalam",
  description: "Articles on Ayurvedic therapies, doshas, food and routine, herb safety and the rules in Canada, written and reviewed by a BAMS practitioner in Calgary.",
  path: "/learn/",
});

export default async function LearnPage() {
  const [{ articles, totalPages }, settings] = await Promise.all([pageOfArticles(1), getSettings()]);
  return <ArticleIndex articles={articles} page={1} totalPages={totalPages} settings={settings} />;
}
