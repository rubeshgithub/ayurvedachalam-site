import { countArticles, listArticles } from "@/lib/content/repo";
import type { Article } from "@/lib/types";

export const PER_PAGE = 12;

export async function pageOfArticles(n: number, category?: Article["category"]) {
  const total = await countArticles(category);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const articles = await listArticles({ category, limit: PER_PAGE, skip: (n - 1) * PER_PAGE });
  return { articles, totalPages };
}
