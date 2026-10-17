import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getAuthor, getSettings, listArticles } from "@/lib/content/repo";
import { JsonLd, articleLd, breadcrumbLd, buildMetadata, faqLd } from "@/lib/seo";
import { ARTICLE_CATEGORIES } from "@/lib/types";
import { Article } from "@/templates/Article";

export const revalidate = 300;
export const dynamicParams = true;

const isPreview = () => process.env.NODE_ENV !== "production" || process.env.PREVIEW_DRAFTS === "1";

export async function generateStaticParams() {
  if (process.env.SKIP_STATIC_PARAMS === "1") return [];
  return (await listArticles({ status: "published" })).map((a) => ({ slug: a.slug }));
}

async function load(slug: string) {
  const a = await getArticle(slug);
  if (!a || (a.status !== "published" && !isPreview())) notFound();
  return a;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await load((await params).slug);
  return buildMetadata({ title: a.title_tag, description: a.meta_description, path: `/learn/${a.slug}/`, type: "article", noindex: a.status !== "published", publishedTime: a.published_at ?? undefined, modifiedTime: a.updated_at, image: a.og_image });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await load((await params).slug);
  const [author, settings, related] = await Promise.all([getAuthor(a.author_id), getSettings(), listArticles({ category: a.category, limit: 4 })]);
  if (!author) notFound();
  return (
    <>
      <Article article={a} author={author} settings={settings} related={related.filter((r) => r.slug !== a.slug)} />
      <JsonLd data={[articleLd(a, author), faqLd(a.faqs), breadcrumbLd([{ name: "Home", href: "/" }, { name: "Learn", href: "/learn/" }, { name: ARTICLE_CATEGORIES[a.category], href: `/learn/category/${a.category}/` }, { name: a.h1, href: `/learn/${a.slug}/` }])]} />
    </>
  );
}
