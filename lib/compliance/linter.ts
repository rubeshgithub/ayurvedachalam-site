import banned from "./banned-terms.json";
import legal from "./legal-check-slugs.json";
import type { Faq, LintResult, Source } from "@/lib/types";

/**
 * Compliance linter — architecture.md §7.4, rules.md R1.3 / R3 / R4.
 * Pure function: no database access. The caller supplies the facts it needs
 * (existing keywords, which internal links resolve).
 */

export interface LintInput {
  title_tag: string;
  meta_description: string;
  h1: string;
  body_md: string;
  primary_keyword?: string;
  faqs?: Faq[];
  sources?: Source[];
  internal_links?: string[];
  author_id?: string;
  slug?: string;                       // full path, e.g. /learn/foo/
  hero_image?: { src?: string; brief?: string } | null;
  /** Words this article is allowed to use because it quotes the law or warns against them. */
  linter_allow?: string[];
}

export interface LintContext {
  /** primary keyword (lower-case) → slug of the page or article already using it */
  existingKeywords?: Map<string, string>;
  /** returns true when an internal link resolves to a published page or article */
  linkResolves?: (href: string) => boolean;
  /** sentences of existing articles, for the overlap warning */
  existingSentences?: Set<string>;
  kind?: "article" | "page";
  /** policy pages quote dates and percentages that are the policy itself, not research */
  skipFigures?: boolean;
}

export const LEGAL_CHECK_SLUGS: string[] = legal.slugs;

export function touchesLegalCheck(slug: string | undefined, links: string[] = []): boolean {
  const all = [slug ?? "", ...links];
  return all.some((s) => LEGAL_CHECK_SLUGS.includes(s));
}

const diseaseRe = new RegExp(`\\b${banned.disease_claim_verbs}\\b[^.!?\\n]{0,60}\\b(${banned.diseases.join("|")})`, "i");
const diseaseRe2 = new RegExp(`\\b(${banned.diseases.join("|")})\\b[^.!?\\n]{0,40}\\b(treatment|cure|remedy|therapy for)\\b`, "i");
const safetyRe = new RegExp(banned.safety_context, "i");

function sentences(text: string): string[] {
  return text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 20);
}

function strippedForClaims(md: string): string {
  // Remove code, URLs, markdown link targets and the sources section before matching.
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\n## Sources[\s\S]*$/i, " ");
}

export function lint(input: LintInput, ctx: LintContext = {}): LintResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const allow = new Set((input.linter_allow ?? []).map((w) => w.toLowerCase()));
  const text = strippedForClaims(`${input.h1}\n${input.title_tag}\n${input.meta_description}\n${input.body_md}\n${(input.faqs ?? []).map((f) => `${f.q} ${f.a}`).join("\n")}`);

  // 1. Banned claim words
  for (const rule of banned.errors) {
    const re = new RegExp(rule.pattern, "gi");
    let m: RegExpExecArray | null;
    const seen = new Set<string>();
    while ((m = re.exec(text))) {
      const word = m[0].toLowerCase();
      if (allow.has(word) || [...allow].some((a) => word.includes(a))) continue;
      // Allow a banned word inside a sentence that quotes or warns (e.g. "do not promise to cure")
      const wordRe = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      const sent = sentences(text).find((s) => wordRe.test(s)) ?? "";
      if (/\b(not|never|no|cannot|do not|does not|avoid|instead of|rather than|prohibit|banned|not allowed|is a claim|words? (like|such as)|quote|law)\b/i.test(sent) && /["“”']|\b(not|never|prohibit|banned|law|claim)\b/i.test(sent)) continue;
      if (!seen.has(word)) { errors.push(`${rule.message}: "${m[0]}"`); seen.add(word); }
    }
  }

  // 2. "Dr." / "doctor" as the practitioner's title — covered by patterns above; plus generic
  if (/\bDr\.\s+[A-Z]/.test(text) && !allow.has("dr.")) {
    const ok = /Dr\.\s+M\.?\s*G\.?\s*R\.?\s+Medical/i.test(text); // the university's proper name
    const other = text.replace(/Dr\.\s+M\.?\s*G\.?\s*R\.?\s+Medical/gi, "").match(/\bDr\.\s+[A-Z][a-z]+/);
    if (!ok || other) warnings.push(`"Dr." appears before a name (${other?.[0] ?? "check"}); confirm it is not the practitioner`);
  }

  // 3. Schedule A disease named as something treated / cured / prevented
  for (const s of sentences(text)) {
    if ((diseaseRe.test(s) || diseaseRe2.test(s)) && !safetyRe.test(s)) {
      errors.push(`Disease claim: "${s.slice(0, 110)}…"`);
      break;
    }
  }

  // 4. Lengths
  if (input.title_tag.length > 60) errors.push(`Title tag is ${input.title_tag.length} characters (max 60)`);
  if (input.meta_description.length > 155) errors.push(`Meta description is ${input.meta_description.length} characters (max 155)`);
  if (!input.title_tag) errors.push("Missing title tag");
  if (!input.meta_description) errors.push("Missing meta description");

  // 5. Required parts (articles)
  if (ctx.kind !== "page") {
    const n = input.faqs?.length ?? 0;
    if (n < 3 || n > 5) errors.push(`FAQ has ${n} questions (need 3–5)`);
    if (!input.author_id) errors.push("Missing author");
    const pk = (input.primary_keyword ?? "").toLowerCase();
    if (!pk) errors.push("Missing primary keyword");
    else if (!input.h1.toLowerCase().includes(pk) && !input.title_tag.toLowerCase().includes(pk)) {
      // allow a loose match: all keyword words present in H1 or title
      const words = pk.split(/\s+/).filter((w) => w.length > 2);
      const hay = `${input.h1} ${input.title_tag}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) errors.push("Primary keyword not in H1 or title");
    }
  }

  // 6. Figures need sources
  // Prices and session lengths come from the price book (product.md §5), not from research, so they
  // are stripped before the check; percentages, years and bare numbers still need a source.
  const figureRe = ctx.kind === "page" ? /(\b\d+(\.\d+)?\s?%|\b(19|20)\d{2}\b)/ : /(\$\s?\d[\d,.]*|\b\d+(\.\d+)?\s?%|\b(19|20)\d{2}\b|\b\d{2,}\b)/;
  let bodyForFigures = strippedForClaims(input.body_md).replace(/\n## Frequently asked questions[\s\S]*$/i, "");
  if (ctx.kind === "page") bodyForFigures = bodyForFigures.replace(/\$\s?\d[\d,.]*/g, " ").replace(/\b\d+\s?(?:min|minutes?|hours?|days?|weeks?|months?|years?|sessions?|x)\b/gi, " ");
  const hasFigure = figureRe.test(bodyForFigures);
  if (!ctx.skipFigures && hasFigure && (input.sources?.length ?? 0) === 0) errors.push("Body quotes a figure, percentage or year but has no sources");

  // 7. Internal links resolve
  const links = input.internal_links ?? [];
  if (ctx.linkResolves) {
    for (const l of links) if (!ctx.linkResolves(l)) errors.push(`Internal link does not resolve: ${l}`);
  }
  if (ctx.kind !== "page") {
    if (links.length < 2) warnings.push("Fewer than 2 internal links");
    if (!links.some((l) => /^\/(consultations|therapies|spiritual-healing|massage-therapy)\/[^/]+\/$/.test(l))) warnings.push("No link to a service page");
  }

  // 8. Primary keyword uniqueness
  if (ctx.existingKeywords && input.primary_keyword) {
    const owner = ctx.existingKeywords.get(input.primary_keyword.toLowerCase());
    if (owner && owner !== input.slug) errors.push(`Primary keyword already used by ${owner}`);
  }

  // 9. Word count (articles)
  if (ctx.kind !== "page") {
    const wc = input.body_md.replace(/[#*_>`\[\]()|-]/g, " ").split(/\s+/).filter(Boolean).length;
    if (wc < 800 || wc > 2000) warnings.push(`Word count ${wc} is outside 800–2,000`);
  }

  // 10. Overlap
  if (ctx.existingSentences && ctx.existingSentences.size) {
    const mine = sentences(input.body_md);
    const dup = mine.filter((s) => ctx.existingSentences!.has(s.toLowerCase())).length;
    if (mine.length && dup / mine.length > 0.2) warnings.push(`Sentence overlap ${(100 * dup / mine.length).toFixed(0)}% with existing articles`);
  }

  // 11. Hero image
  if (ctx.kind !== "page" && !input.hero_image?.src) warnings.push("Missing hero image");

  return { passed: errors.length === 0, errors, warnings };
}
