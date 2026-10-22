# memory.md — Ayurvedachalam

> The project's working memory. **Read this first in every session.** It says where things
> stand, what has been decided, what is assumed and what is still open.
>
> **How to keep it:** update §1 at the end of every session. Add to §3 the moment something
> is decided. Never rewrite history in §3 or §8; add a new line that supersedes the old one.
> Dates are written `YYYY-MM-DD`. Keep this file under about 400 lines; when a section
> grows past a screen, summarise the oldest entries.

---

## 1. Snapshot

| Item | Value |
| --- | --- |
| As of | 2026-10-14 |
| Phase | **F — Foundations** (nothing built yet) |
| Launch date | Not set. The article schedule (weeks 1–8) counts from it |
| Site status | ayurvedachalam.com exists; current content not yet reviewed (it blocked automated reading) |
| Pages live from this plan | 0 of 100 |
| Articles published | 0 |
| Article pipeline | Not built. `publish_mode` will start as `review` |
| Legal review | Owner has set the position on all 7 items (2026-10-14); lawyer confirmation still to book (F-02); one open point, Q-16 |
| Build | Phase B started 2026-10-16: repo `ayurvedachalam-site` scaffolded, builds clean, 24 of 25 B-tasks done (B-21 waits on the booking tool); 30 of 37 W1 pages have copy; next Phase P (pipeline). Blocking the build: nothing. Content: Q-16 ("stomach wash"), phone/hours, massage association number |

**Next three actions**

1. Owner approves or adjusts the design preview.
2. Owner answers Q-01 to Q-08 below.
3. Developer starts B-01 and B-02; Content starts the cornerstone article drafts.

---

## 2. Fixed facts (as stated by the owner)

- Brand: **Ayurvedachalam**. Domain: **ayurvedachalam.com**. Base: Calgary, Alberta.
- Practitioner: Maheswari Vedhachalam. BAMS from Dr. M.G.R. Medical University, Chennai, 2012; 5½ years of study plus a 1½-year internship at the Government General Hospital, Chennai; over 14 years of practice in India, Qatar and Canada; registered with AYUSH (India); member, Indian Medical Association; WES Canada evaluated. Also: Registered Massage Therapist; Certified Spiritual Healer
  of the Association of Spiritual Healers of Alberta (ASHA); Certified Herbalist (Alberta).
- Already practising in Canada: virtual sessions, in-person Ayurveda consultations,
  spiritual healing.
- The clinic is currently virtual; a physical clinic opens soon. Therapy pages stay as planned with a placeholder address; the site goes live only once the address exists (stated 2026-10-14).
- Hosting: OVH (stated 2026-10-14). Prices: to be set after market research.
- Services wanted on the site: Ayurvedic consultations (online across Canada, in person in
  Calgary); spiritual healing; Ayurvedic massage therapy; Shirodhara; Abhyanga; Kati,
  Janu and other Vasti therapies; sinus-related and skin-related therapies.
- **O2 Herbal Therapy Centre:** the owner used to be part of it and is not any more. O2
  still shows content the owner wrote. O2 is ruled out of this project in every way.
- Articles: keep the articles section; write a few strong ones to start; then three a week
  published automatically into the CMS, the same way it is done for CRS
  (corporateregistryservices.ca).
- The owner's servers already run MongoDB, Python, Node.js and React.

---

## 3. Decisions

`PROPOSED` means chosen by Claude as a default so work can start; the owner can change it.

| ID | Date | Decision | Status | Why |
| --- | --- | --- | --- | --- |
| D-01 | 2026-10-13 | Site has 10 sections and 100 mapped pages; the spreadsheet is the register of slugs, keywords, titles and H1s | Accepted | Owner: "we have a good content page map to start" |
| D-02 | 2026-10-13 | O2 Herbal Therapy Centre is a former association and a competitor. No content, wording, listing or redirect from O2 is used | Accepted | Owner instruction |
| D-03 | 2026-10-13 | All copy is written fresh, even where the owner wrote the text O2 still shows | Accepted | Search engines saw it on O2's site first |
| D-04 | 2026-10-13 | Wording posture: no "Dr." title; external therapies only; "supports / traditionally used for", never "cures / treats"; concern pages avoid disease names | PROPOSED, pending lawyer | Alberta title and restricted-activity rules; federal advertising rules |
| D-05 | 2026-10-13 | Design direction "The copper vessel": Sesame background, Neem green, Copper for actions, Fraunces + Figtree | **Accepted 2026-10-14** | Owner: "keep the copper/green proposal" |
| D-06 | 2026-10-13 | Stack: Next.js (server-rendered) + MongoDB + custom CMS at `/cms` | Accepted 2026-10-16 (build started) | SEO needs server-rendered pages; matches the owner's Node/React/MongoDB servers |
| D-07 | 2026-10-13 | Booking, intake and receipts in an external practice-management tool; the site stores no health information | PROPOSED | Privacy risk and build cost |
| D-08 | 2026-10-13 | Article pipeline copies the CRS pattern: scheduled Claude task → GitHub relay repo → CMS ingest. Runs Mon/Wed/Fri. Starts in `review` mode for two weeks, then `timed` with a 24-hour hold | PROPOSED | Owner asked for auto-publishing; a hold keeps a human veto on health content |
| D-09 | 2026-10-13 | "Articles" = the Learn section, at `/learn/`. One content type for cornerstone and weekly articles | PROPOSED | Avoids two overlapping sections; keeps the mapped slugs |
| D-10 | 2026-10-13 | Release plan: launch set of 37 (30 Wave 1 pages + Learn hub + 6 cornerstone articles); Wave 2 = 35 pages; Wave 3 = 15 pages + dosha quiz; the other 12 mapped articles arrive through the pipeline in weeks 1–8 | PROPOSED | Supersedes the earlier 30/35/35 split now that articles are automated |
| D-11 | 2026-10-13 | Calgary area pages are limited to four quadrants | Accepted with the map | Many near-identical area pages risk a doorway-page penalty |
| D-12 | 2026-10-13 | The relay lives in its own repo so the article task's token cannot touch site code | PROPOSED | Least privilege |
| D-15 | 2026-10-14 | Hosting on the owner's OVH server, as for docu10 | Accepted | Owner decision |
| D-16 | 2026-10-14 | Prices on the site are placeholders until a pricing study is done (F-16) | Accepted | Owner: "we need to do market research" |
| D-17 | 2026-10-14 | Pages are written for the physical clinic as planned, with a placeholder address until it opens; launch waits for the real address | Accepted | Owner decision |
| D-20 | 2026-10-17 | Wordmark B (Ayurveda 600 Neem + chalam light italic Copper), mark 1 as favicon/app icon, mark 4 as social avatar | Accepted | Owner choice from the wordmark canvas |
| D-19 | 2026-10-16 | Content repository reads MongoDB in production and `content/seed/*.json` when `MONGODB_URI` is empty, so the site builds in CI with no database; writes always need MongoDB | Accepted | Build decision |
| D-18 | 2026-10-15 | Price list adopted exactly as recommended in the pricing study; now in `product.md` §5 (initial consult $135, follow-up $75, Abhyanga $120, Shirodhara $130, Vasti $90–95, energy healing $90, Panchakarma $695, packages 10–16%) | Accepted | Owner: "I will go with your recommendation about the pricing" |
| D-14 | 2026-10-14 | LEGAL CHECK answers from the owner: full degree name may be shown with no "Dr."; Nasya is home-use advice only, not performed; Panchakarma = Kati Vasti, Janu Vasti, Shirodhara plus diet and routine; privacy policy written to Alberta PIPA; lifestyle content (diet, doshas, yoga, meditation) strengthens every page; spiritual healing described in ASHA's terms; O2 parked | Accepted | Owner's review comment on `rules.md` |
| D-13 | 2026-10-13 | Herb and product content names only products with a Health Canada NPN; no online shop in version 1 | PROPOSED | Health Canada advisories on unlicensed Ayurvedic products |

---

## 4. Assumptions (true until someone says otherwise)

| ID | Assumption | Check by |
| --- | --- | --- |
| A-01 | The practitioner belongs to a massage association whose receipts insurers accept | F-06 |
| A-02 | Hands-on therapies will be delivered in Calgary at a location to be announced, or by home visit, until a clinic opens | Q-17 |
| A-03 | Deep tissue, reflexology, mobile massage, chakra balancing, facial and postnatal massage are offered | F-05 |
| A-04 | "Cleansing of stomach wash" in the Panchakarma list means a home dietary or herbal routine, not an induced-vomiting or purging procedure | Q-16 |
| A-05 | The CRS pipeline's GitHub-relay approach can be reused as is (the scheduled environment can push to GitHub but cannot call the site directly) | P-05 dry run |
| A-06 | The site is English only at launch | Owner |
| A-07 | ~~Price ranges~~ Resolved by D-18 | — |
| A-08 | The Alignable listings named "Ayurvedachalam" / "Ayurveda Chalam" at 1507 16th Ave SW are not under the owner's control today | F-11 |

---

## 5. Open questions for the owner

| ID | Question | Blocks |
| --- | --- | --- |
| Q-01 | Practitioner's name, college and year of BAMS, association names and member numbers, languages spoken, short bio facts | W1-01, W1-03, schema |
| Q-02 | Clinic address, phone, hours (exactly as they should appear everywhere) | W1-07, W1-27, F-10 |
| Q-03 | ~~Final prices~~ Answered 2026-10-15 (D-18) | — |
| Q-04 | Which optional services are really offered (see A-03) | W2-02, W2-03, W2-04 |
| Q-05 | Booking tool: is one in use already? If not, is Jane App acceptable to evaluate? | B-21, W1-04 |
| Q-06 | Massage association; insurers that accept receipts; direct billing yes/no | W1-06 |
| Q-07 | Who controls the Alignable listings using the Ayurvedachalam name? Any other old listings or social profiles? | F-11 |
| Q-08 | ~~Hosting~~ Answered: OVH | — |
| Q-17 | ~~Virtual clinic~~ Answered: clinic opens soon; keep pages as planned, placeholder address, launch waits for the address | — |
| Q-09 | Is the design direction approved? Any colours to avoid or keep? | B-03 onward |
| Q-10 | Tagline choice | Header, home |
| Q-11 | Existing logo to keep, or new wordmark? | Header, favicon |
| Q-12 | Photo shoot: when, and is a portrait on the home page acceptable? | F-07 |
| Q-13 | What is on ayurvedachalam.com today, and does any of it need to be kept or redirected? | F-13 |
| Q-14 | Target launch date | Schedule |
| Q-15 | Who reviews articles during the hold: the practitioner, RK, or both? | O-01 |
| Q-16 | What is "cleansing of stomach wash" in the Panchakarma offer: a home routine, or a clinic procedure that induces vomiting or purging? The second cannot be offered | W1-24 |

---

## 6. Research findings to remember

Full detail and links are in the market report. Figures are "as of" the date shown.

**Demand**

- 56% of Canadians used a complementary or alternative therapy in the prior 12 months; 79%
  ever; about $8.8 billion a year spent (Fraser Institute, 2016 survey; the latest of its
  kind; taken from search extracts of the Institute's pages).
- 44% of Canadians had tried massage therapy (same survey). 43% of benefit-plan members
  claimed massage in a year (Sanofi Canada Healthcare Survey 2016).
- 42.5% of health care users had at least one virtual appointment in 12 months; 78.5% of
  those offered virtual care took it (Statistics Canada, 2023 data, published 2025-11-19).
- South Asians are 10% of the Calgary metro population (Statistics Canada, 2021 census).

**Search results checked on 2026-10-13 (Google Canada)**

| Search | Who led | Opening |
| --- | --- | --- |
| ayurveda calgary | Ayurkulam, Healwell | Only two dedicated clinics on page one |
| shirodhara calgary | A NW Calgary spa | No Ayurvedic practitioner's page in the top three |
| ayurvedic massage calgary | A physio clinic, an aesthetics clinic | Half the page is directories |
| abhyanga massage calgary | The same spa; an Alignable listing in the Ayurvedachalam name was second | Listing carries O2's description |
| kati basti calgary | An Ontario clinic, then a dessert cafe | No Calgary provider |
| panchakarma calgary | Healwell, Ayurkulam | Short pages |
| online ayurvedic consultation canada | Ontario and BC clinics | No Alberta practice |
| spiritual healing calgary | Reiki centres, a spiritualist church, counsellors | Nobody pairs it with Ayurveda |
| ayurvedic treatment for sinus | International content sites | No Canadian page |
| ayurvedic skin treatment (eczema, psoriasis) canada | Ontario clinics | Disease-claim wording to avoid |
| ayurvedic doctor near me canada | Ontario and BC clinics | — |

**Not measured:** search volumes. Demand and competition ratings in the map are estimates.

**Competitor pricing seen:** online consultation $135 for 60 minutes and $75 for a 30-minute
follow-up (Ayurveda Vancouver); Indian Ayurvedic massage $95 for 60 minutes, Shirodhara $60
for 30 minutes, Reiki $80 for 60 minutes (Indian Ayurvedic Massage, Calgary). Ayurkulam and
Healwell publish no prices.

**Regulatory points (reading of public sources, 2026-10-13; not legal advice)**

- Alberta Health Professions Act s. 128 restricts "doctor" / "Dr." in connection with
  providing a health service. Ayurveda is not a regulated profession in Alberta.
- Restricted activities include going beyond the anal verge and beyond the point where the
  nasal passages narrow.
- Massage therapy is not yet regulated in Alberta; an application was filed in October 2024.
  Associations such as NHPC and MTAA set standards meanwhile.
- The Food and Drugs Act bars advertising products to the public as treatments or cures for
  Schedule A diseases. Selling unlicensed natural health products is illegal; Health Canada
  has seized Ayurvedic products containing lead, mercury and arsenic from clinics in BC and
  Ontario.

---

## 7. Glossary and house spellings

| Use this | Also searched as | Plain gloss for first use |
| --- | --- | --- |
| Abhyanga | Abhyangam | warm oil massage |
| Shirodhara | Sirodhara | warm oil poured steadily over the forehead |
| Kati Vasti | Kati Basti | warm oil held on the lower back |
| Janu Vasti | Janu Basti | warm oil held on the knees |
| Greeva Vasti | Griva Basti, Greeva Basti | warm oil held on the neck |
| Nasya | Nasyam | nasal oil therapy |
| Panchakarma | Panchkarma | Ayurveda's cleansing program |
| Nadi Pariksha | Nadi Pareeksha | pulse reading |
| Shiro Abhyanga | Indian head massage | head, neck and shoulder oil massage |
| Pada Abhyanga | Padabhyanga | foot massage |
| Udvartana | Udwarthanam | herbal powder massage |
| Kizhi | Potli, Elakizhi | warm herbal poultice massage |
| Pizhichil | Pizhichal | warm oil bath therapy |
| Swedana | Svedana | herbal steam |
| Marma | — | Ayurvedic pressure points |
| Mukha Lepam | — | herbal facial |
| Dosha; Vata, Pitta, Kapha | — | Ayurveda's three body-mind types (always framed as Ayurvedic theory) |
| Dinacharya | — | daily routine |
| Ritucharya | — | seasonal routine |
| Vaidya | — | traditional word for an Ayurvedic practitioner |
| BAMS | — | Bachelor of Ayurveda Medicine and Surgery, a degree in Ayurvedic medicine from India (5½ years plus a 1½-year internship) |
| ASHA | — | Association of Spiritual Healers of Alberta |
| NPN | — | Natural Product Number, issued by Health Canada to licensed products |
| NAP | — | name, address, phone: must match everywhere |

---

## 8. Change log

| Date | What changed | By |
| --- | --- | --- |
| 2026-10-13 | Market research report and 100-page SEO map created | Claude |
| 2026-10-13 | Owner ruled out O2 Herbal Therapy Centre; report and map corrected | RK, Claude |
| 2026-10-13 | Six project docs and `design-preview.html` created; release plan changed to D-10 | Claude |
| 2026-10-14 | Pricing study delivered (F-16); proposed list awaits owner approval | Claude |
| 2026-10-15 | Owner approved the price list (D-18); `product.md` §5 updated; cornerstone article W1-32 drafted | RK, Claude |
| 2026-10-22 | Content relay built locally at `ayurvedachalam-content-relay/` (queue.md with the 24 seeded rows, runbook, delivery Action, example payload); ingest schema shared as `lib/ingest-schema.ts` with a fixture test. Needs the GitHub repo created to push | Claude |
| 2026-10-22 | Build phase complete bar B-21 (booking embed waits on F-08): media library, SMTP notifications, CSP, staging gate, backup/deploy/systemd files in `ops/`, page checks and Lighthouse in CI. Next: Phase P article pipeline | Claude |
| 2026-10-21 | W1 core pages (home intro, about, practitioner, book, prices, insurance, contact, reviews holding page, FAQ, first visit) and four policies drafted for the lawyer; 30 of 37 launch pages now have copy; linter: `skipFigures` for legal and profile templates | Claude |
| 2026-10-20 | W1 service copy drafted: 16 pages (hubs, 4 consultations, 9 therapies, energy healing) in `content/pages/*.json`, merged by the seed script, all passing the linter; linter page rules refined (prices not research figures; word-boundary sentence lookup) | Claude |
| 2026-10-17 | Wordmark decided (D-20) and built into header, footer, favicon, OG image, social avatar | RK, Claude |
| 2026-10-17 | Five more cornerstone articles drafted (W1-33..37); all six pass the linter; seeded as `review`. Open points: ECCC climate link and Health Canada monograph links to open before publish; massage association (Q-06) blocks the insurance article | Claude |
| 2026-10-17 | Pushed to github.com/rubeshgithub/ayurvedachalam-site (main). CMS built: login with TOTP, page editor, article queue/editor with lint + publish/schedule/reject, settings, redirects, draft preview via Next draft mode. No MongoDB reachable from the session, so CMS end-to-end test happens on the server | Claude |
| 2026-10-16 | Development started (owner: "start the development"). `ayurvedachalam-site` built: Next.js 16 + Tailwind 4 + MongoDB with JSON-seed fallback; templates, SEO layer, linter, ingest, publish cron, forms; 10 tests; CI workflow. Zip delivered; GitHub push pending (no valid token in session) | Claude |
| 2026-10-14 | Design approved; practitioner details received; hosting set to OVH; prices deferred to a pricing study; clinic noted as virtual | RK, Claude |
| 2026-10-14 | Owner answered the LEGAL CHECK register; R1.1, R1.2, R6 and the register rewritten; Nasya and Panchakarma pages unblocked | RK, Claude |

---

Site code: github.com/rubeshgithub/ayurvedachalam-site (pushed 2026-10-17). Page copy lives in `content/pages/<slug>.json` (merged onto the map row by the seed script). Article drafts live in `content/learn/<slug>.md` (front matter + body + unpublished editor's notes).

## 9. Publishing log

Until the pipeline is live (P-07), log hand-published articles here. After that, `queue.md`
in the relay repo is the log and this section holds a monthly summary only.

| Date live | Article | URL | Origin | Reviewed by |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

---

## 10. Where things live

| Thing | Where |
| --- | --- |
| Market research and SEO launch report | https://claude.ai/code/artifact/a0038ca9-d2b1-4361-b08e-37ddb0bdda46 |
| Pricing study (proposed price list, awaiting owner approval) | https://claude.ai/code/artifact/d755144b-7ba8-4062-b7d9-bb358095fbc7 |
| Page map (100 pages: slugs, keywords, titles, H1s) | `Ayurvedachalam_100_Page_SEO_Map.xlsx` |
| These six docs | `docs/` in `ayurvedachalam-site` once the repo exists |
| Design preview | `design-preview.html` (same folder) |
| Article queue | `tasks.md` §8 now; `queue.md` in the relay repo after P-03 |
| Article rules for the scheduled task | `runbook/` in the relay repo (copies of `rules.md`, `product.md`) |
| Secrets (GitHub token, ingest key) | Hosting environment variables and the Claude project's secure notes. **Never in these files** |
| The CRS pipeline this copies | Claude project "AI SEO - Tool": `claude/crs-publishing-runbook.md` |
