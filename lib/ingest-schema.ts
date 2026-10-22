import { z } from "zod";

/** Payload schema 1 — architecture.md §7.3. Shared by the ingest route and the tests; the relay repo keeps an example at examples/payload-schema-1.json. */
export const Payload = z.object({
  schema: z.literal(1),
  run_id: z.string().min(3).max(64),
  kind: z.enum(["cornerstone", "feed"]),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: lowercase words joined by hyphens, no /learn/ prefix"),
  category: z.enum(["therapies", "calgary-wellness", "ayurveda-basics", "food-and-routine", "herbs-and-safety", "spiritual-healing", "practice-and-trust"]),
  tags: z.array(z.string()).max(10).default([]),
  title_tag: z.string().min(10).max(80),
  meta_description: z.string().min(40).max(200),
  h1: z.string().min(10).max(120),
  excerpt: z.string().max(200).optional(),
  primary_keyword: z.string().min(3),
  secondary_keywords: z.array(z.string()).default([]),
  body_md: z.string().min(1000),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  sources: z.array(z.object({ title: z.string(), url: z.string().url(), publisher: z.string().optional(), accessed: z.string().optional() })).default([]),
  internal_links: z.array(z.string()).default([]),
  hero_image: z.object({ src: z.string().optional(), brief: z.string().optional(), alt: z.string().optional() }).optional(),
  author: z.string().default("practitioner"),
  needs_human: z.boolean().default(false),
  linter_allow: z.array(z.string()).max(12).default([]),
});

export type IngestPayload = z.infer<typeof Payload>;
