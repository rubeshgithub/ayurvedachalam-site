# architecture.md — Ayurvedachalam

> How the site is built, how content gets in, and how it stays healthy.
> Last updated: 2026-10-13 · Decisions are logged in `memory.md` §3 with IDs (D-xx).
> Items marked **PROPOSED** are defaults chosen so the build can start; change them in
> `memory.md` and here together.

## 1. Principles

1. **Every content page is server-rendered HTML.** The site exists to rank. No page's
   main content may depend on client-side JavaScript to appear.
2. **Content lives in the database, not in code.** Pages and articles are CMS records, so
   the article pipeline and a human editor use the same path.
3. **The site holds no health information.** Booking, intake and receipts live in an
   external practice-management tool.
4. **Rules are enforced by code where possible.** The compliance linter (§7.4) blocks
   banned wording at ingest and in CI, so `rules.md` is not only a document.
5. **Boring, owned infrastructure.** Reuse what already runs for CRS: Node, React, MongoDB,
   GitHub, deploy on push.

## 2. Stack (PROPOSED, D-06)

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router), React, TypeScript | Server rendering and static regeneration for SEO; same React/Node skills as CRS |
| Styling | CSS variables from `design.md` + Tailwind CSS | Tokens in one place; fast to build templates |
| Database | MongoDB | Already in use on the owner's servers |
| CMS | Custom admin at `/cms` inside the same app | Same pattern as CRS; no third-party CMS fee |
| Auth (CMS only) | Email + password with TOTP, session cookie | Two or three users at most |
| Images | `next/image`, files in object storage or `/public/media` | Responsive sizes, lazy loading |
| Hosting | The owner's OVH Cloud Linux server (same host as docu10), MongoDB on the same server, data in Canada | Owner decision 2026-10-14 (D-15) |
| Deploy | Push to `main` → build → deploy | Same as docu10 |
| Booking | External tool, linked and embedded (§8) | Keeps health data off the site |
| Analytics | Google Analytics 4 + Google Search Console | Free; Search Console drives the article queue |
| Email | Transactional provider for contact-form notices | No marketing email in v1 beyond a sign-up list |

A plain React single-page app (Vite) is **not** acceptable for this site, because content
would render in the browser instead of on the server.

## 3. System overview

```
                         ┌───────────────────────────────────────────┐
  Visitors / Googlebot ─►│  Next.js app (ayurvedachalam.com)         │
                         │  ├─ public pages (SSR / ISR)              │
                         │  ├─ /cms            admin UI              │
                         │  ├─ /api/cms/*      CMS API (session)     │
                         │  ├─ /api/cms/ingest article ingest (key)  │
                         │  ├─ /api/cron/publish  due-article job    │
                         │  ├─ /api/forms/*    contact, newsletter   │
                         │  └─ /sitemap.xml, /robots.txt, /feed.xml  │
                         └───────────────┬───────────────────────────┘
                                         │
                                   ┌─────▼─────┐
                                   │  MongoDB  │
                                   └───────────┘

  Scheduled Claude task (Mon/Wed/Fri)
        │ writes article, builds payload JSON
        ▼
  GitHub repo: ayurvedachalam-content-relay   (inbox/<slug>.json)
        │ push triggers GitHub Action
        ▼
  Action POSTs payload ─► /api/cms/ingest ─► linter ─► CMS (scheduled or review)
        │ on success: deletes the payload, commits "relay: delivered <slug>"
        ▼
  Task sees the cleanup commit = delivery confirmed

  Book buttons ─► external scheduler (booking, intake, receipts, reminders)
```

## 4. Repositories

| Repo | Contents | Who writes |
| --- | --- | --- |
| `ayurvedachalam-site` | The Next.js app, these six docs in `/docs`, linter, tests | Developer / coding agent |
| `ayurvedachalam-content-relay` | `inbox/`, `queue.md` (the article queue and publishing log), `delivered.log`, `runbook/` (copies of `rules.md` and `product.md`), the relay Action | The scheduled article task only |

The relay is a separate repo on purpose: the article task's GitHub token can then be limited
to that one repo, and can never change site code.

### 4.1 Site repo layout

```
ayurvedachalam-site/
├─ docs/                     product.md architecture.md rules.md design.md tasks.md memory.md
├─ app/
│  ├─ (site)/
│  │  ├─ page.tsx                         Home
│  │  ├─ [...slug]/page.tsx               CMS pages (all hubs, services, concerns, policies)
│  │  ├─ learn/page.tsx                   Articles index (paginated, by category)
│  │  ├─ learn/[slug]/page.tsx            Article
│  │  ├─ learn/category/[cat]/page.tsx    Category listing
│  │  └─ book/page.tsx                    Booking page (scheduler embed)
│  ├─ cms/                                Admin UI
│  ├─ api/
│  │  ├─ cms/…                            CRUD (session auth)
│  │  ├─ cms/ingest/route.ts              Article ingest (key auth)
│  │  ├─ cron/publish/route.ts            Publishes due articles
│  │  └─ forms/{contact,newsletter}/route.ts
│  ├─ sitemap.ts  robots.ts  feed.xml/route.ts
├─ components/               Header, Footer, Hero, ServiceCard, FAQ, PriceTable, AuthorBox…
├─ lib/
│  ├─ db.ts  models/         Mongo connection and schemas
│  ├─ seo/                   metadata builders, JSON-LD builders
│  ├─ compliance/            linter.ts, banned-terms.json, legal-check-slugs.json
│  └─ markdown.ts            Markdown → sanitised HTML
├─ scripts/                  seed-pages.ts (imports the page map), lint-content.ts
├─ styles/tokens.css         Generated from design.md §12
└─ tests/
```

## 5. Routing and templates

Every URL in the page map resolves to a CMS record with a `template` field.

| Template | Used by | Key blocks |
| --- | --- | --- |
| `home` | / | Hero, three paths, credential strip, featured therapies, how it works, reviews, latest articles, CTA band |
| `hub` | /consultations/, /therapies/, /spiritual-healing/, /concerns/, /massage-therapy/ | Intro, card grid of children, FAQ, CTA band |
| `service` | every consultation, therapy, massage and healing page | Summary box (length, price, where), what it is, who it suits, who should avoid it, what happens, FAQ, related, CTA, disclaimer |
| `concern` | /concerns/* | Plain-language overview, Ayurvedic view, what may help (links to services), when to see a physician, FAQ, disclaimer |
| `location` | /calgary/, /calgary/{sw,nw,ne,se}/ | NAP, map, hours, parking and transit, services, reviews |
| `region` | /online/* | How online works, time zones, services available online, CTA |
| `article` | /learn/* | Title, author line, answer-first intro, body, FAQ, sources, author box, related, newsletter, CTA |
| `article-index` | /learn/, /learn/category/* | Featured article, filter by category, paginated list |
| `profile` | /about/practitioner/ | Photo, credentials table, training story, memberships |
| `pricing` | /pricing/ | Price tables by section, packages, insurance note |
| `booking` | /book/ | Scheduler embed, discovery-call option, what to expect |
| `contact` | /contact/ | NAP, map, form (no health details), hours |
| `legal` | policies | Plain text |
| `utility` | /faq/, /reviews/, /first-visit/, /insurance-direct-billing/, /about/ | Flexible blocks |

Rules for routes:

- Trailing slash on every URL. Lowercase. Hyphens. One canonical URL per page.
- A slug never changes after publication. If it must, create a 301 in `redirects`.
- `/learn/` list pages are paginated as `/learn/page/2/`; page 2+ is `noindex, follow`.
- Unknown URLs return a real 404 with links to the three main hubs.

## 6. Data model (MongoDB)

Field names are the contract between the CMS, the templates and the ingest API.

### 6.1 `pages`

```
_id, slug (unique, e.g. "/therapies/shirodhara/"), template, section, wave,
title_tag (≤60), meta_description (≤155), h1,
primary_keyword, secondary_keywords[],
summary { duration, price_from, price_note, location, mode[] },      // service template
blocks[] { type, data },                // intro, richtext, cards, steps, faq, pricing, notice…
faqs[] { q, a },
related[] (slugs), cta { label, href },
legal_check (bool), legal_check_note,
author_id, reviewed_at, status (draft|review|published|archived),
published_at, updated_at, noindex (bool), og_image
```

### 6.2 `articles`

```
_id, slug (unique, stored without the /learn/ prefix), kind (cornerstone|feed),
category (see 6.3), tags[],
title_tag (≤60), meta_description (≤155), h1, excerpt (≤200),
primary_keyword, secondary_keywords[],
body_md, body_html (sanitised, generated),
faqs[] { q, a }  (3–5),
sources[] { title, url, publisher, accessed },      // required when any figure is quoted
internal_links[] (slugs; validated against pages/articles),
hero_image { src, alt, credit }, og_image,
author_id, reviewed_by, reviewed_at,
status (draft|review|scheduled|published|rejected|archived),
publish_at, published_at, updated_at,
origin (pipeline|manual), run_id, payload_hash,
lint { passed, errors[], warnings[] },
word_count, reading_minutes
```

### 6.3 Article categories (fixed list)

`therapies` · `calgary-wellness` · `ayurveda-basics` · `food-and-routine` · `herbs-and-safety`
· `spiritual-healing` · `practice-and-trust`

### 6.4 Other collections

| Collection | Purpose | Notes |
| --- | --- | --- |
| `authors` | Name, credentials line, bio, photo, sameAs links | Drives the author box and Person schema |
| `settings` | Site-wide values: NAP, hours, booking URL, `publish_mode`, hold hours, disclaimer texts, social links | One document |
| `redirects` | from, to, code | Checked in middleware |
| `media` | File, alt text, credit, dimensions | Alt text is required |
| `reviews` | Name (first name + initial), text, source, date, consent (bool) | Only shown when consent is true; linted for cure claims |
| `leads` | Contact-form submissions: name, email, phone, message, consent, created_at | **No health fields.** Deleted after 24 months |
| `subscribers` | Email, consent_at, consent_text, source, unsubscribed_at | CASL evidence |
| `ingest_log` | Every ingest attempt: run_id, slug, result, lint output, time | Kept for audit |
| `users` | CMS users, role (owner or editor), password hash, TOTP secret | |

## 7. Article pipeline (three a week)

Modelled on the CRS program: a scheduled Claude task writes one article per run and delivers
it through a GitHub relay into the CMS.

### 7.1 Schedule

| Step | When (America/Edmonton) | What |
| --- | --- | --- |
| Task runs | Mon, Wed, Fri 09:00 | Takes the first `Pending` item in `queue.md` in the relay repo (seeded from `tasks.md` §8) |
| Delivered | Within minutes | Payload reaches the CMS; owner gets a notification with a preview link |
| Hold | 24 hours (setting) | Owner can edit or reject in `/cms` |
| Goes live | Tue, Thu, Sat 09:00 | Cron publishes anything `scheduled` whose `publish_at` has passed |

One article per run. Never more than three in a calendar week (`rules.md` R8).

### 7.2 Publish modes (`settings.publish_mode`)

| Mode | Behaviour | Use when |
| --- | --- | --- |
| `review` | Article lands as `review`. Nothing goes live until a human clicks Publish. | How CRS works today; safest |
| `timed` (**default, D-08**) | Article lands as `scheduled` with `publish_at = now + hold`. Goes live automatically unless rejected. | Normal running |
| `immediate` | Goes live on ingest if the linter passes. | Not recommended |

Regardless of mode, an article is forced to `review` when: the linter reports any error; the
slug or any internal link touches a LEGAL CHECK page; or the payload sets
`needs_human: true`.

### 7.3 Payload (what the task commits to `inbox/<slug>.json`)

```json
{
  "schema": 1,
  "run_id": "2026-11-02-mon",
  "kind": "feed",
  "slug": "shirodhara-vs-abhyanga",
  "category": "therapies",
  "tags": ["shirodhara", "abhyanga"],
  "title_tag": "Shirodhara vs Abhyanga: Which to Book First?",
  "meta_description": "…≤155 characters…",
  "h1": "Shirodhara vs Abhyanga: Which Should You Book First?",
  "excerpt": "…≤200 characters…",
  "primary_keyword": "shirodhara vs abhyanga",
  "secondary_keywords": ["difference between shirodhara and abhyanga"],
  "body_md": "…Markdown, no H1, H2/H3 only…",
  "faqs": [{ "q": "…", "a": "…" }],
  "sources": [{ "title": "…", "url": "https://…", "publisher": "…", "accessed": "2026-11-02" }],
  "internal_links": ["/therapies/shirodhara/", "/therapies/abhyanga/", "/book/"],
  "hero_image": { "brief": "…description for the editor…", "alt": "…" },
  "author": "practitioner",
  "needs_human": false
}
```

### 7.4 Ingest (`POST /api/cms/ingest`)

1. **Authenticate.** Header `x-ingest-key` must equal `INGEST_KEY`. Constant-time compare.
   Rate limit: 10 requests an hour.
2. **Validate shape** against the schema above. Reject unknown `schema` versions.
3. **Idempotency.** If `payload_hash` already exists, return 200 with the existing record.
   If the slug exists with different content, return 409.
4. **Sanitise.** Convert Markdown to HTML; allow only `h2 h3 p ul ol li a strong em table
   thead tbody tr th td blockquote figure img`. Strip scripts, styles and inline handlers.
5. **Lint** (`lib/compliance/linter.ts`). Errors block auto-publish; warnings are shown in
   the CMS.

   | Check | Level |
   | --- | --- |
   | Banned claim word or phrase (`banned-terms.json`, from `rules.md` R1.3) | Error |
   | "Dr." / "doctor" used as the practitioner's title | Error |
   | Schedule A disease named as something the practice treats, cures or prevents | Error |
   | Title tag > 60 or meta description > 155 characters | Error |
   | Missing: FAQ (3–5), disclaimer slot, author, primary keyword in H1 or title | Error |
   | A number, percentage or dollar figure with no entry in `sources` | Error |
   | Internal link that does not resolve to a published page or article | Error |
   | Primary keyword already used by another page or article | Error |
   | Fewer than 2 internal links, or no link to a service page | Warning |
   | Word count outside 800–2,000 | Warning |
   | Sentence overlap > 20% with any existing article | Warning |
   | Missing hero image | Warning |

6. **Store** with status per §7.2 and write `ingest_log`.
7. **Respond** `201 { id, status, preview_url, publish_at, lint }`.

### 7.5 Relay Action (in `ayurvedachalam-content-relay`)

- Trigger: push that adds `inbox/*.json`.
- For each file: `curl -fsS -X POST "$SITE_URL/api/cms/ingest" -H "x-ingest-key: $INGEST_KEY"
  -H "content-type: application/json" --data-binary @file`.
- On 2xx: append a line to `delivered.log`, delete the file, commit
  `relay: delivered <slug> (<status>)`.
- On failure: leave the file, commit nothing, fail the job. The task treats "no cleanup
  commit within 5 minutes" as a failed delivery.
- Secrets `SITE_URL` and `INGEST_KEY` live in the repo's Action secrets only.

### 7.6 Publish job (`/api/cron/publish`, every 15 minutes)

For each article where `status = scheduled` and `publish_at ≤ now`:
re-run the linter → set `published` and `published_at` → revalidate `/learn/`, the article
URL, its category page and the home page → the sitemap and feed pick it up → ping IndexNow.
If the linter now fails, set `review` and notify the owner.

### 7.7 Failure handling

| Failure | Result |
| --- | --- |
| Push to GitHub fails twice | Task saves the article as a file, sends it to the owner, stops |
| No cleanup commit in 5 minutes | Same |
| Ingest returns 409 or 422 | Task reports the lint errors; does not retry with changed wording on its own more than once |
| Queue has no `Pending` item | Task proposes five new topics and delivers nothing |
| Site unreachable from the task environment | Expected. The task never calls the site directly; only the relay does |

## 8. Booking and client data (PROPOSED, D-07)

- Booking, intake forms, appointment reminders, receipts and any insurer billing run in an
  external practice-management tool. **Candidate: Jane App** (Canadian; widely used by
  massage therapists). Confirm features, data residency and price before committing (Q-05).
- The site links to it from every Book button and embeds it on `/book/`.
- The contact form asks for name, email, phone and a message, with this notice above the
  message box: *"Please do not include health details here. You will be able to share them
  securely when you book."*
- Newsletter sign-up stores email, the exact consent wording shown, and a timestamp.

## 9. SEO implementation

| Item | Rule |
| --- | --- |
| `<title>` and meta description | From the record; build fails if either is missing |
| Canonical | Self-referencing on every page |
| Open Graph / Twitter | Unique per page; generated OG image with H1 and section colour |
| Headings | Exactly one H1; H2/H3 in order |
| Breadcrumbs | Visible, with `BreadcrumbList` JSON-LD |
| JSON-LD by template | `home`: LocalBusiness + WebSite · `service`: Service + FAQPage · `concern`: WebPage + FAQPage · `article`: Article + FAQPage · `profile`: Person · `location`: LocalBusiness · every page: BreadcrumbList |
| Business type in schema | `HealthAndBeautyBusiness` or `LocalBusiness`. **Never** `Physician` or `MedicalClinic` |
| Sitemap | `/sitemap.xml` from the database, with `lastmod`; excludes `noindex` and drafts |
| robots.txt | Allow all; disallow `/cms` and `/api`; link the sitemap |
| Feed | `/feed.xml` for articles |
| IndexNow | Key file at the site root; ping on publish and on update |
| Images | Descriptive file names, required alt text, width and height set, WebP/AVIF |
| Internal links | Each service page links to its hub, two related services and `/book/`; each article links to at least one service page |
| Pagination | `/learn/page/N/` is `noindex, follow` |
| Redirects | 301 only; no chains |

## 10. Performance, accessibility, security

**Performance budget (mobile, measured in CI with Lighthouse):** LCP ≤ 2.5 s, CLS ≤ 0.1,
INP ≤ 200 ms, JavaScript ≤ 170 KB compressed on content pages, hero image ≤ 150 KB, fonts
self-hosted with `font-display: swap` and at most two families.

**Accessibility:** WCAG 2.1 AA. Colour pairs only from the approved table in `design.md` §3.
Keyboard access to menu, accordion and forms. Visible focus ring. `prefers-reduced-motion`
respected. Skip link. Form errors announced.

**Security:**

- Secrets only in environment variables. Never in the repo, the docs or the CMS.
- `/cms` behind login with TOTP; sessions in HTTP-only, SameSite=Lax cookies; lockout after
  five failed attempts.
- Ingest key rotated every 90 days and on any suspicion.
- Security headers: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, a Content Security
  Policy that allows only self, the scheduler embed, GA4 and the map embed.
- Form endpoints: rate limit, honeypot field, server-side validation.
- Dependencies checked weekly (`npm audit`); MongoDB not exposed to the internet.
- Daily database backup, kept 30 days; restore tested once a quarter.

## 11. Environments and configuration

| Environment | URL | Notes |
| --- | --- | --- |
| Local | localhost | Seeded from `scripts/seed-pages.ts` |
| Staging | staging subdomain, password-protected, `noindex` | The relay can target staging for dry runs |
| Production | ayurvedachalam.com | Deploys from `main` |

Environment variables:

```
MONGODB_URI            SITE_URL               SESSION_SECRET
INGEST_KEY             CRON_SECRET            INDEXNOW_KEY
BOOKING_URL            BOOKING_EMBED_URL      GA4_ID
MAIL_API_KEY           MAIL_FROM              CONTACT_TO
MAPS_EMBED_KEY (optional)
```

## 12. Analytics events (GA4)

`book_click` (with `source_page`, `service`) · `discovery_call_click` · `phone_click` ·
`directions_click` · `contact_submit` · `newsletter_signup` · `faq_open` ·
`article_read_75` (scrolled 75%).

## 13. What changes this document

Any change to the stack, the data model, the payload schema or the pipeline schedule is made
here **and** logged in `memory.md` §3 in the same commit. The payload `schema` number goes up
whenever a field is added, removed or changes meaning.
