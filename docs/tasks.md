# tasks.md — Ayurvedachalam

> The backlog. One line per task, with an ID, an owner and a status.
> Last updated: 2026-10-13 · Current phase: **F — Foundations**
>
> **Status:** `[ ]` to do · `[~]` in progress · `[x]` done (add the date) · `[!]` blocked (say by what)
> **Owners:** **RK** owner/practitioner · **Dev** developer or coding agent · **Content** writer
> (Claude or human) · **Law** lawyer · **Auto** the scheduled article task
> **Rule:** commit messages carry the task ID. Finished tasks stay here, ticked, until the
> phase closes, then move to §10 Done.

## 0. Now / next (keep to five lines)

1. RK: approve palette and type from `design-preview.html` (F-01)
2. RK: send phone, hours, address, optional services (F-04, F-05)
3. RK: book the lawyer review with the LEGAL CHECK register (F-02)
4. Dev: create the site repo and the token file (B-01, B-02)
5. Content: draft the six cornerstone articles for review (W1-31 to W1-36)

---

## 1. Phase F — Foundations (before any page goes live)

| ID | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| F-01 | Approve design direction (palette, type, home layout) | RK | [x] 2026-10-14 | Copper/green approved |
| F-02 | Lawyer confirmation of the owner's LEGAL CHECK answers (LC-1 to LC-6) and the PIPA privacy wording | RK, Law | [ ] | Owner answered 2026-10-14; pages are no longer blocked. Q-16 ("stomach wash") still open |
| F-03 | Supply practitioner name, degree details (college, year), association and member numbers, short bio facts | RK | [~] | Name, degree, university, year, internship supplied 2026-10-14. Still needed: massage association number, photo, languages, bio facts |
| F-04 | Confirm phone and hours (price list approved 2026-10-15, D-18) | RK | [~] | Phone and hours still placeholders |
| F-05 | Confirm optional services: deep tissue, reflexology, mobile massage, chakra balancing, facial, postnatal home visits | RK | [ ] | Q-04. Pages for "no" answers are dropped from the map |
| F-06 | Confirm massage association, which insurers accept its receipts, direct billing yes/no | RK | [ ] | Q-06 |
| F-07 | Photo shoot: practitioner, hands at work, room, copper vessel, herbs | RK | [ ] | `design.md` §7. Needed for home, profile, 10 therapy pages |
| F-08 | Choose booking tool; set up services, lengths, prices, intake form, cancellation policy | RK | [ ] | Q-05. Candidate: Jane App |
| F-09 | Choose hosting (Render or OVH) and MongoDB location | RK, Dev | [x] 2026-10-14 | OVH, same server as docu10 |
| F-16 | Pricing study: compile competitor prices (Calgary and online Canada) and propose a final price list for each service | Content | [x] 2026-10-14 | Owner asked for market research before setting prices. Starting point: the benchmarks in the market report |
| F-10 | Google Business Profile: create or claim under the final NAP; categories, services, photos | RK | [ ] | Biggest single lever for "near me" searches |
| F-11 | Listings clean-up: find who controls the Alignable listings in the Ayurvedachalam name; claim, correct or request removal | RK | [ ] | Q-07. They currently carry O2's description |
| F-12 | Set up Google Search Console and GA4 for ayurvedachalam.com | Dev | [ ] | Verify by DNS |
| F-13 | Check what is currently on ayurvedachalam.com; export anything worth keeping; plan redirects | RK, Dev | [ ] | The domain blocked automated reading during research |
| F-14 | Keyword volumes: check each primary keyword in Google Keyword Planner (Canada and Calgary) and adjust Wave 2/3 order | RK or Content | [ ] | The page map's demand ratings are estimates |
| F-15 | Decide tagline and whether an existing logo is kept | RK | [~] | Wordmark decided 2026-10-17 (D-20); tagline (Q-10) still open |

---

## 2. Phase B — Build

| ID | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| B-01 | Create `ayurvedachalam-site` repo; Next.js + TypeScript + Tailwind; add `/docs` with these six files | Dev | [x] 2026-10-16 | `architecture.md` §4 |
| B-02 | `styles/tokens.css` from `design.md` §12; self-host Fraunces and Figtree | Dev | [x] 2026-10-16 |  |
| B-03 | Global shell: top bar, header with section panels, mobile sheet, sticky mobile Book/Call bar, footer | Dev | [x] 2026-10-16 | After F-01 |
| B-04 | Component library per `design.md` §10 with a `/styleguide` page (noindex) | Dev | [x] 2026-10-16 |  |
| B-05 | MongoDB models and connection (`architecture.md` §6) | Dev | [x] 2026-10-16 |  |
| B-06 | `scripts/seed-pages.ts`: import the page map spreadsheet into `pages` (slug, title, meta, H1, keywords, wave, template) | Dev | [x] 2026-10-16 | 100 records, status `draft` |
| B-07 | Template: `home` | Dev | [x] 2026-10-16 |  |
| B-08 | Template: `hub` | Dev | [x] 2026-10-16 |  |
| B-09 | Template: `service` with sticky summary box | Dev | [x] 2026-10-16 |  |
| B-10 | Template: `concern` | Dev | [x] 2026-10-16 |  |
| B-11 | Templates: `article`, `article-index`, category pages, pagination | Dev | [x] 2026-10-16 |  |
| B-12 | Templates: `profile`, `pricing`, `booking`, `contact`, `location`, `region`, `legal`, `utility` | Dev | [x] 2026-10-16 |  |
| B-13 | SEO layer: metadata builder, canonical, OG image generator, JSON-LD builders, breadcrumbs | Dev | [x] 2026-10-16 | `architecture.md` §9 |
| B-14 | `sitemap.xml`, `robots.txt`, `feed.xml`, IndexNow key and ping | Dev | [x] 2026-10-16 | IndexNow key file to add once the key exists |
| B-15 | CMS: login with TOTP, page editor (blocks), article editor (Markdown + preview), media library with required alt text, settings | Dev | [~] 2026-10-17 | Login+TOTP, page editor, article editor, settings, redirects done; media library with alt text still to build |
| B-16 | CMS: article queue view with statuses, lint results, Approve / Reject / Edit, publish time | Dev | [x] 2026-10-17 |  |
| B-17 | Compliance linter + `banned-terms.json` + `legal-check-slugs.json`; `npm run lint:content`; wired into CI | Dev | [x] 2026-10-16 | `architecture.md` §7.4, `rules.md` R1.3 |
| B-18 | Ingest API `/api/cms/ingest` with key auth, validation, idempotency, sanitising, lint, log | Dev | [x] 2026-10-16 |  |
| B-19 | Publish cron `/api/cron/publish` with revalidation and IndexNow | Dev | [x] 2026-10-16 |  |
| B-20 | Forms: contact (no health fields, notice), newsletter (CASL consent stored); rate limit, honeypot, email notice | Dev | [x] 2026-10-16 | Email notice stubbed to the server log until MAIL_API_KEY (B-25) |
| B-21 | Booking: `/book/` embed, Book buttons read `settings.booking_url`, GA4 events | Dev | [~] | `/book/` page and Book buttons read `settings.booking_url`; embed waits for F-08 |
| B-22 | Redirects middleware; real 404 page | Dev | [x] 2026-10-17 |  |
| B-23 | Tests per template (one H1, title, meta, canonical, JSON-LD parses); axe check; Lighthouse budget in CI | Dev | [~] | 10 unit tests (linter, markdown) + content lint in CI; template tests, axe and Lighthouse still to add |
| B-24 | Security headers and CSP; backups scheduled; staging environment with password and noindex | Dev | [ ] | |
| B-25 | Notification to owner on ingest (email or push) with preview link | Dev | [ ] | |

---

## 3. Phase W1 — Launch content (37 pages)

Row numbers refer to the `#` column of the Page Map sheet. Each page: draft → lint →
practitioner review → publish to staging.

### 3.1 Core and trust (10)

| ID | Page | Map # | Owner | Status | Needs |
| --- | --- | --- | --- | --- | --- |
| W1-01 | Home | 1 | Content | [ ] | F-03, F-07 |
| W1-02 | About Ayurvedachalam | 2 | Content | [ ] | Fresh copy only (R2) |
| W1-03 | Practitioner profile | 3 | Content | [ ] | F-03 |
| W1-04 | Book | 4 | Content | [ ] | F-08 |
| W1-05 | Prices and packages | 5 | Content | [~] (page renders from the price book; intro copy pending) | Prices approved (D-18); write from `product.md` §5 |
| W1-06 | Insurance and direct billing | 6 | Content | [!] | F-06 |
| W1-07 | Contact (virtual clinic; no street address yet) | 7 | Content | [ ] | Placeholder phone and hours |
| W1-08 | Reviews | 8 | Content | [ ] | Real reviews with consent |
| W1-09 | FAQ | 9 | Content | [ ] | |
| W1-10 | Your first visit | 10 | Content | [ ] | F-07 |

### 3.2 Consultations (4)

| ID | Page | Map # | Owner | Status | Needs |
| --- | --- | --- | --- | --- | --- |
| W1-11 | Consultations hub | 11 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |
| W1-12 | Online consultation (Canada) | 12 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | — |
| W1-13 | In-person consultation (Calgary) | 13 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | — |
| W1-14 | Nadi Pariksha | 14 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |

### 3.3 Therapies (10)

| ID | Page | Map # | Owner | Status | Needs |
| --- | --- | --- | --- | --- | --- |
| W1-15 | Therapies hub | 21 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |
| W1-16 | Abhyanga | 22 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |
| W1-17 | Shirodhara | 23 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |
| W1-18 | Kati Vasti | 24 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |
| W1-19 | Janu Vasti | 25 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |
| W1-20 | Greeva Vasti | 26 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |
| W1-21 | Nasya (advice page: home use only, not performed) | 27 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | Review before publish |
| W1-22 | Ayurvedic massage (overview) | 28 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |
| W1-23 | Skin care therapies | 29 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | |
| W1-24 | Panchakarma (external therapies only) | 30 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | Q-16; review before publish |

### 3.4 Spiritual healing, Calgary, policies (6)

| ID | Page | Map # | Owner | Status | Needs |
| --- | --- | --- | --- | --- | --- |
| W1-25 | Spiritual healing hub | 45 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | LC-6 |
| W1-26 | Energy healing session | 46 | Content | [~] drafted 2026-10-20 (`content/pages/`, status review) | LC-6 |
| W1-27 | Calgary clinic | 68 | Content | [ ] | Placeholder address until the clinic opens |
| W1-28 | Privacy policy (written to Alberta PIPA) | 97 | Content, Law | [ ] | Lawyer confirm |
| W1-29 | Terms of use | 98 | Content, Law | [ ] | |
| W1-30 | Health disclaimer | 99 | Content, Law | [ ] | LC-5 |

### 3.5 Learn hub and six cornerstone articles (7)

Written by hand before launch, to the article rules (R4), and loaded through the CMS.

| ID | Article | Map # | URL | Why first |
| --- | --- | --- | --- | --- |
| W1-31 | Learn hub | 77 | /learn/ | Index for everything that follows |
| W1-32 | Is Ayurveda Regulated in Canada? | 85 | /learn/is-ayurveda-regulated-in-canada/ | **Drafted 2026-10-15** → `content/learn/`; awaits practitioner review and the F-02 check on the restricted-activities paragraph |
| W1-33 | Are Ayurvedic Herbs Safe? | 95 | /learn/are-ayurvedic-herbs-safe/ | **Drafted 2026-10-17** → `content/learn/`; linter pass; awaits practitioner review. The main safety objection, answered with Health Canada sources |
| W1-34 | Ayurveda for Calgary Winters | 91 | /learn/ayurveda-for-calgary-winters/ | **Drafted 2026-10-17** → `content/learn/`; linter pass; awaits practitioner review. Local, seasonal, nobody else has it |
| W1-35 | Shirodhara: Benefits and What to Expect | 88 | /learn/shirodhara-benefits/ | **Drafted 2026-10-17** → `content/learn/`; linter pass; awaits practitioner review. Feeds the best-known therapy page |
| W1-36 | What Is Kati Basti? | 89 | /learn/kati-basti-guide/ | **Drafted 2026-10-17** → `content/learn/`; linter pass; awaits practitioner review. No Calgary provider ranks for this term |
| W1-37 | Is Ayurveda Covered by Insurance in Canada? | 96 | /learn/is-ayurveda-covered-by-insurance/ | **Drafted 2026-10-17** → `content/learn/`; linter pass; awaits practitioner review. Answers the money question before booking |

---

## 4. Phase L — Launch

| ID | Task | Owner | Status |
| --- | --- | --- | --- |
| L-01 | Full content lint passes; every Wave 1 page reviewed by the practitioner | Content, RK | [ ] |
| L-02 | Cross-check prices and lengths: pages = `/pricing/` = booking tool | Content | [ ] |
| L-03 | Accessibility pass on all templates (`design.md` §13) | Dev | [ ] |
| L-04 | Lighthouse budget met on home, one service page, one article | Dev | [ ] |
| L-05 | Redirects from any old URLs (F-13) | Dev | [ ] |
| L-06 | Point DNS, enable HTTPS, remove staging noindex only on production | Dev | [ ] |
| L-07 | Submit sitemap in Search Console; request indexing for home, hubs, 10 therapy pages | Dev | [ ] |
| L-08 | Google Business Profile: add website link, booking link, services, first post | RK | [ ] |
| L-09 | Directory profiles with identical NAP: Yelp, Medimap, Lumino Health, Fresha, IndianBusinessCanada, Ayurveda4Health | RK | [ ] |
| L-10 | Review request message ready; send after each appointment | RK | [ ] |
| L-11 | Record the launch date in `memory.md` §1 (the article schedule counts from it) | RK | [ ] |

---

## 5. Phase P — Article pipeline (set up during build, switched on at launch)

| ID | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| P-01 | Create private repo `ayurvedachalam-content-relay` with `inbox/`, `queue.md`, `delivered.log`, `runbook/` | Dev | [ ] | `architecture.md` §4 |
| P-02 | Relay Action `relay.yml`; add secrets `SITE_URL`, `INGEST_KEY` | Dev | [ ] | `architecture.md` §7.5 |
| P-03 | Copy `rules.md`, `product.md` and the article structure (R4) into `runbook/`; move the queue in §8 below into `queue.md` | Dev | [ ] | From then on `queue.md` is the only queue |
| P-04 | Fine-grained GitHub token limited to the relay repo (contents: read and write); store it in the Claude project's secure notes | RK | [ ] | Never in a doc or a chat |
| P-05 | Dry run against staging: one test payload → ingest → `review` → cleanup commit seen | Dev | [ ] | |
| P-06 | Negative tests: banned word, long title, broken internal link, duplicate keyword, LEGAL CHECK link | Dev | [ ] | Each must land in `review` with the right error |
| P-07 | Create the Claude project "Ayurvedachalam" with the runbook docs; create the scheduled task (Mon/Wed/Fri 9:00 a.m. Calgary time) using the prompt in §9 | RK + Claude | [ ] | Start in `review` mode |
| P-08 | Run two weeks in `review` mode (6 articles); practitioner reviews each | RK | [ ] | |
| P-09 | Switch `publish_mode` to `timed` with a 24-hour hold | RK | [ ] | Log as a decision in `memory.md` |
| P-10 | When 5 or fewer `Pending` items remain: generate the next 24 topics from Search Console queries and add them to `queue.md` | Content | [ ] | Repeats; see O-03 |

---

## 6. Phase W2 — weeks 5 to 8 (35 pages)

| ID | Group | Map # | Count | Status | Needs |
| --- | --- | --- | --- | --- | --- |
| W2-01 | Consultations: diet, herbal, women's wellness, digestive, stress and sleep, seasonal cleanse | 15–20 | 6 | [ ] | LC-3 for the cleanse |
| W2-02 | Therapies: head massage, foot massage, Udvartana, Kizhi, Pizhichil, Swedana, Marma, facial, hair and scalp, postnatal | 31–40 | 10 | [ ] | F-05 |
| W2-03 | Massage therapy: hub, deep tissue, reflexology, mobile | 41–44 | 4 | [ ] | F-05, F-06 |
| W2-04 | Spiritual healing: distance, chakra balancing, what is it, ASHA certification, stress and emotional balance, Ayurveda with healing | 47–52 | 6 | [ ] | LC-6 |
| W2-05 | Concerns: hub, lower back, knee and joint, neck and shoulder, sinus, stress, sleep, digestion | 53–60 | 8 | [ ] | Sinus page links to Nasya: LC-2 |
| W2-06 | Cancellation policy | 100 | 1 | [ ] | F-08 |

## 7. Phase W3 — weeks 9 to 13 (15 pages + the quiz)

| ID | Group | Map # | Count | Status | Needs |
| --- | --- | --- | --- | --- | --- |
| W3-01 | Concerns: allergies, dry skin, acne-prone skin, hair fall, headaches, menopause, low energy | 61–67 | 7 | [ ] | |
| W3-02 | Calgary quadrant pages: SW, NW, NE, SE | 69–72 | 4 | [ ] | Unique local detail each (R3.8) |
| W3-03 | Online: Alberta, British Columbia, Ontario, how it works | 73–76 | 4 | [ ] | |
| W3-04 | Dosha quiz (interactive tool page, built by Dev, copy by Content) | 83 | 1 | [ ] | Results framed as Ayurvedic theory, not assessment |

---

## 8. Article queue (seed)

Three a week from launch: **Mon** therapies and Calgary · **Wed** Ayurveda basics, food and
routine · **Fri** trust, herbs and spiritual healing. "Map" in the Source column means the
article is already in the page map (its slug, title and H1 are set there). "New" means the
row must be added to the spreadsheet when it is written (R3.11).

Mode: **auto** = may publish after the hold · **review** = always needs a human (R8.8).

| # | Wk | Day | Working title | URL slug (under /learn/) | Primary keyword | Category | Links to | Source | Mode | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A01 | 1 | Mon | Abhyanga: Benefits and How to Do It at Home | abhyanga-benefits | abhyanga benefits | therapies | /therapies/abhyanga/ | Map 87 | auto | Pending |
| A02 | 1 | Wed | What Is Ayurveda? A Plain-Language Guide | what-is-ayurveda | what is ayurveda | ayurveda-basics | /consultations/ | Map 78 | auto | Pending |
| A03 | 1 | Fri | What Is a BAMS Degree? | what-is-bams | what is bams | practice-and-trust | /about/practitioner/ | Map 84 | review | Pending |
| A04 | 2 | Mon | Shirodhara vs Abhyanga: Which to Book First? | shirodhara-vs-abhyanga | shirodhara vs abhyanga | therapies | /therapies/shirodhara/, /therapies/abhyanga/ | New | auto | Pending |
| A05 | 2 | Wed | Vata, Pitta, Kapha: The Three Doshas Explained | vata-pitta-kapha | vata pitta kapha | ayurveda-basics | /consultations/nadi-pariksha-pulse-reading/ | Map 79 | auto | Pending |
| A06 | 2 | Fri | Ayurveda vs Naturopathy: What Is the Difference? | ayurveda-vs-naturopathy | ayurveda vs naturopathy | practice-and-trust | /consultations/ | Map 86 | review | Pending |
| A07 | 3 | Mon | Kati Basti or Massage for a Stiff Lower Back? | kati-basti-vs-massage | kati basti vs massage | therapies | /therapies/kati-vasti/, /concerns/lower-back-pain/ | New | auto | Pending |
| A08 | 3 | Wed | Vata Dosha: Signs, Diet and Daily Routine | vata-dosha | vata dosha | ayurveda-basics | /consultations/ayurvedic-diet-consultation/ | Map 80 | auto | Pending |
| A09 | 3 | Fri | Ashwagandha in Canada: Uses, Safety, What to Buy | ashwagandha-in-canada | ashwagandha canada | herbs-and-safety | /consultations/ayurvedic-herbal-consultation/ | Map 94 | review | Pending |
| A10 | 4 | Mon | Your First Ayurvedic Massage: What to Expect | first-ayurvedic-massage | what to expect ayurvedic massage | therapies | /therapies/ayurvedic-massage-calgary/, /first-visit/ | New | auto | Pending |
| A11 | 4 | Wed | Pitta Dosha: Signs, Diet and Daily Routine | pitta-dosha | pitta dosha | ayurveda-basics | /consultations/ayurvedic-diet-consultation/ | Map 81 | auto | Pending |
| A12 | 4 | Fri | Spiritual Healing vs Reiki: What Is the Difference? | spiritual-healing-vs-reiki | spiritual healing vs reiki | spiritual-healing | /spiritual-healing/ | New | review | Pending |
| A13 | 5 | Mon | How Often Should You Have Abhyanga? | how-often-abhyanga | how often abhyanga | therapies | /therapies/abhyanga/, /pricing/ | New | auto | Pending |
| A14 | 5 | Wed | Kapha Dosha: Signs, Diet and Daily Routine | kapha-dosha | kapha dosha | ayurveda-basics | /consultations/ayurvedic-diet-consultation/ | Map 82 | auto | Pending |
| A15 | 5 | Fri | How to Choose an Ayurvedic Practitioner in Canada | choose-ayurvedic-practitioner-canada | how to choose an ayurvedic practitioner | practice-and-trust | /about/practitioner/, /consultations/online-ayurvedic-consultation-canada/ | New | auto | Pending |
| A16 | 6 | Mon | Nasya Oil: How to Use It Safely at Home | nasya-oil-guide | nasya oil how to use | therapies | /therapies/nasya/ | Map 90 | review | Pending |
| A17 | 6 | Wed | Dinacharya: The Ayurvedic Daily Routine | dinacharya-daily-routine | ayurvedic daily routine | food-and-routine | /consultations/ | Map 92 | auto | Pending |
| A18 | 6 | Fri | Triphala in Canada: Uses, Safety, What to Look For | triphala-in-canada | triphala canada | herbs-and-safety | /consultations/ayurvedic-herbal-consultation/ | New | review | Pending |
| A19 | 7 | Mon | The First 40 Days: Postpartum Care in Ayurveda | postpartum-40-days-ayurveda | postpartum 40 days ayurveda | therapies | /therapies/postnatal-ayurvedic-massage/ | New | review | Pending |
| A20 | 7 | Wed | The Ayurvedic Diet with Foods You Can Buy in Canada | ayurvedic-diet-with-canadian-foods | ayurvedic diet canada | food-and-routine | /consultations/ayurvedic-diet-consultation/ | Map 93 | auto | Pending |
| A21 | 7 | Fri | Turmeric in Ayurveda: Uses, Safety, What to Buy | turmeric-in-ayurveda | turmeric in ayurveda | herbs-and-safety | /consultations/ayurvedic-herbal-consultation/ | New | review | Pending |
| A22 | 8 | Mon | Ritucharya: An Ayurvedic Routine for Each Canadian Season | ritucharya-canadian-seasons | ritucharya seasonal routine | calgary-wellness | /consultations/seasonal-cleanse-program/, /learn/ayurveda-for-calgary-winters/ | New | auto | Pending |
| A23 | 8 | Wed | Kitchari: The Ayurvedic One-Pot Meal (Recipe) | kitchari-recipe | kitchari recipe | food-and-routine | /consultations/ayurvedic-diet-consultation/ | New | auto | Pending |
| A24 | 8 | Fri | Can You Use Ayurveda Alongside Your Medication? | ayurveda-with-medication | can you use ayurveda with medication | practice-and-trust | /consultations/ayurvedic-herbal-consultation/, /learn/are-ayurvedic-herbs-safe/ | New | review | Pending |

Notes on the queue:

- The working titles of "New" rows are within 60 characters; the pipeline still checks.
- No search volumes are attached. After six weeks live, Search Console's query report
  decides what goes into the next batch (P-10).
- An article whose "Links to" page is not yet published is held back and the next
  `Pending` item is taken instead; note the swap in `queue.md`.
- Twelve of the 24 are map articles, so after week 8 all 20 Learn pages in the map exist
  (hub + 6 cornerstone + 12 here + the quiz in W3-04).

---

## 9. Scheduled task prompt (for P-07)

Paste as the task's instruction. It assumes the Claude project holds the runbook docs and the
GitHub token note.

```
Article run for ayurvedachalam.com. One article per run.

Read first, in this order, from this project's docs:
1. runbook/rules.md      — wording, legal and article rules. R1, R2, R3, R4 and R8 are binding.
2. runbook/product.md    — the practice, services, URLs.
3. github-token note     — repo name and the verified git commands. Never print the token.
Then clone the relay repo and read queue.md.

Do exactly this:
1. Take the first queue row whose Status is "Pending". If its "Links to" page is not live
   yet (check the row notes), take the next Pending row and note the swap. If none are
   Pending, propose five new topics from the categories in the runbook and stop.
2. Research with web search. Every fee, rule, date, statistic and safety fact must come
   from a primary source opened in this run (Health Canada, Statistics Canada, Alberta,
   a regulator, a peer-reviewed paper). Record title, URL, publisher and today's date.
3. Write the article to R4: 1,000–1,800 words, answer in the first two sentences, 4–7 H2s
   with at least three as questions, FAQ of 3–5, sources, the required notice, a closing
   call to action linking to one service page and /book/. Voice per R5. Wording per R1.3.
   Tie to Calgary or Canada where natural. Use the seo-content-engine skill's article
   template for on-page structure if it is available.
4. Self-check: title ≤60 characters, meta ≤155, one H1, no banned words (R1.3), no "Dr.",
   no disease-treatment claims, every number sourced, 2+ internal links that exist, primary
   keyword not used elsewhere in queue.md or the page map. Fix what fails. If something
   cannot be fixed without changing the topic, set needs_human true and say why.
5. Build the payload JSON (schema 1) as inbox/<slug>.json. Set needs_human true when the
   queue row's Mode is "review".
6. Commit and push to the relay repo. Wait up to 5 minutes for the relay's cleanup commit
   ("relay: delivered <slug>"). At most two push attempts.
7. On success: set the row's Status to "Delivered <date>" in queue.md, commit, push.
   Report: title, slug, status returned by the relay, and what the practitioner should
   look at during the hold. Remind the owner the article can be edited or rejected at
   https://ayurvedachalam.com/cms before it goes live.
8. On failure: save the article and payload as files, send them to the owner, explain what
   failed, stop. Never call ayurvedachalam.com directly. Never touch the site repo.
```

---

## 10. Phase O — Ongoing

| ID | Task | When | Owner |
| --- | --- | --- | --- |
| O-01 | Review each delivered article during its hold; set `reviewed_at` | Mon, Wed, Fri | RK |
| O-02 | Ask for a Google review after each appointment | Every visit | RK |
| O-03 | Top up the queue when 5 or fewer items are `Pending` (P-10) | About every 6 weeks | Content |
| O-04 | Search Console check: indexing errors, top queries, pages losing clicks | Monthly | Content |
| O-05 | Compliance audit: run the linter on all live content; spot-read 10 pages | Monthly | Content |
| O-06 | Review the six docs; update `memory.md`; close finished phases | First Monday monthly | RK + Claude |
| O-07 | Re-check prices, hours and insurance wording against the booking tool | Quarterly | RK |
| O-08 | Re-check articles with rules or product information (R4.8) | Every 6 months | Content |
| O-09 | Rotate the ingest key; check backups restore | Quarterly | Dev |
| O-10 | Watch Alberta massage-therapy regulation news; update R1.1 and the insurance page if it changes | Quarterly | Content |
| O-11 | Competitor check: who ranks for the 11 tracked searches | Quarterly | Content |

---

## 11. Done

_Nothing closed yet._

| Date | ID | What |
| --- | --- | --- |
| 2026-10-13 | — | Market research report and 100-page SEO map delivered |
| 2026-10-13 | — | Six project docs and the design preview drafted |
