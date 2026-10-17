// Field names are the contract between the CMS, the templates and the ingest API
// (architecture.md §6). Change there first.

export type PageTemplate =
  | "home" | "hub" | "service" | "concern" | "location" | "region"
  | "article-index" | "profile" | "pricing" | "booking" | "contact" | "legal" | "utility";

export type PageStatus = "draft" | "review" | "published" | "archived";
export type ArticleStatus = "draft" | "review" | "scheduled" | "published" | "rejected" | "archived";

export type ArticleCategory =
  | "therapies" | "calgary-wellness" | "ayurveda-basics" | "food-and-routine"
  | "herbs-and-safety" | "spiritual-healing" | "practice-and-trust";

export const ARTICLE_CATEGORIES: Record<ArticleCategory, string> = {
  "therapies": "Therapies",
  "calgary-wellness": "Calgary wellness",
  "ayurveda-basics": "Ayurveda basics",
  "food-and-routine": "Food and routine",
  "herbs-and-safety": "Herbs and safety",
  "spiritual-healing": "Spiritual healing",
  "practice-and-trust": "Practice and trust",
};

export interface Faq { q: string; a: string }
export interface Source { title: string; url: string; publisher?: string; accessed?: string }
export interface Cta { label: string; href: string }

export type Block =
  | { type: "intro"; data: { lead: string } }
  | { type: "richtext"; data: { md: string } }
  | { type: "cards"; data: { heading?: string; items: { title: string; text: string; href: string; eyebrow?: string; price?: string }[] } }
  | { type: "steps"; data: { heading?: string; items: { title: string; text: string }[] } }
  | { type: "list"; data: { heading: string; items: string[]; tone?: "neutral" | "avoid" | "suits" } }
  | { type: "notice"; data: { text: string; tone?: "neem" | "copper" | "turmeric" } }
  | { type: "pricing"; data: { heading?: string; rows: { service: string; detail?: string; price: string }[] } }
  | { type: "faq"; data: { items: Faq[] } }
  | { type: "cta"; data: Cta & { secondary?: Cta } };

export interface ServiceSummary {
  duration?: string;
  price_from?: string;
  price_note?: string;
  location?: string;
  mode?: ("in-person" | "online")[];
}

export interface Page {
  slug: string;                 // "/therapies/shirodhara/"
  template: PageTemplate;
  section: string;              // "therapies", "consultations", "core" …
  wave: number | "A";
  title_tag: string;            // ≤60
  meta_description: string;     // ≤155
  h1: string;
  primary_keyword?: string;
  secondary_keywords?: string[];
  summary?: ServiceSummary;
  blocks?: Block[];
  faqs?: Faq[];
  related?: string[];
  cta?: Cta;
  legal_check?: boolean;
  legal_check_note?: string;
  author_id?: string;
  reviewed_at?: string | null;
  status: PageStatus;
  published_at?: string | null;
  updated_at?: string;
  noindex?: boolean;
  og_image?: string;
  map_row?: number;
}

export interface Article {
  slug: string;                 // without /learn/
  kind: "cornerstone" | "feed";
  category: ArticleCategory;
  tags?: string[];
  title_tag: string;
  meta_description: string;
  h1: string;
  excerpt?: string;
  primary_keyword?: string;
  secondary_keywords?: string[];
  body_md: string;
  body_html?: string;
  faqs?: Faq[];
  sources?: Source[];
  internal_links?: string[];
  hero_image?: { src?: string; alt?: string; credit?: string; brief?: string };
  og_image?: string;
  author_id: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  status: ArticleStatus;
  publish_at?: string | null;
  published_at?: string | null;
  updated_at?: string;
  origin: "pipeline" | "manual";
  run_id?: string;
  payload_hash?: string;
  lint?: LintResult;
  word_count?: number;
  reading_minutes?: number;
  linter_allow?: string[];
}

export interface LintResult { passed: boolean; errors: string[]; warnings: string[] }

export interface Author {
  id: string;
  name: string;
  credentials: string;          // "BAMS · Ayurveda Practitioner · RMT"
  job_title: string;            // "Ayurveda Practitioner" — never "Dr."
  bio: string;
  photo?: string;
  sameAs?: string[];
}

export interface Settings {
  site_name: string;
  descriptor: string;
  tagline: string;
  nap: { name: string; street: string; city: string; region: string; postal: string; country: string; phone: string; email: string; placeholder: boolean };
  hours: { day: string; open: string; close: string }[];
  booking_url: string;
  booking_embed_url?: string;
  publish_mode: "review" | "timed" | "immediate";
  hold_hours: number;
  notices: {
    complementary: string;
    spiritual: string;
    crisis: string;
    npn: string;
    insurance: string;
    contact_form: string;
  };
  social?: { label: string; href: string }[];
  prices_gst_note: string;
}

export interface Review { name: string; text: string; source: string; date: string; consent: boolean; rating?: number }
