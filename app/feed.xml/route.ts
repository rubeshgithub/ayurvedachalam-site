import { listArticles } from "@/lib/content/repo";
import { abs } from "@/lib/seo";

export const revalidate = 900;

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string));

export async function GET() {
  const articles = await listArticles({ status: "published", limit: 30 });
  const items = articles.map((a) => `<item><title>${esc(a.h1)}</title><link>${abs(`/learn/${a.slug}/`)}</link><guid>${abs(`/learn/${a.slug}/`)}</guid><pubDate>${new Date(a.published_at ?? Date.now()).toUTCString()}</pubDate><description>${esc(a.excerpt ?? a.meta_description)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ayurvedachalam — Learn</title><link>${abs("/learn/")}</link><description>Plain answers about Ayurveda in Canada, from a BAMS practitioner in Calgary.</description><language>en-ca</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
