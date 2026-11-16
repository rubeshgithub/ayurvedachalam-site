# product.md — Ayurvedachalam

> What we are building, for whom, and how we will know it works.
> Last updated: 2026-10-15 · Owner: RK · Read `memory.md` first for current state.

## 1. Summary

Ayurvedachalam (ayurvedachalam.com) is the website for a Calgary Ayurveda practice that offers
three things: Ayurvedic consultations (in person in Calgary and online across Canada),
hands-on Ayurvedic therapies in Calgary, and spiritual healing (in person and at a distance).

The site has two jobs:

1. **Get found.** Rank in Google for Calgary therapy searches first, then for online
   consultations across Canada.
2. **Get booked.** Turn a visitor into a booked appointment or a discovery call.

It launches with 37 pages, grows to 100 mapped pages, and then keeps growing through
three new articles a week delivered by an automated pipeline (see `architecture.md` §7).

## 2. The practice

| Item | Value |
| --- | --- |
| Brand | Ayurvedachalam |
| Domain | ayurvedachalam.com |
| Base | Calgary, Alberta |
| Practitioner | **Maheswari Vedhachalam**, Ayurveda Practitioner |
| Degree (as stated by owner) | Bachelor of Ayurveda Medicine and Surgery (BAMS), Dr. M.G.R. Medical University, Chennai, Tamil Nadu, India; 5½ years of study plus a 1½-year internship at the Government General Hospital, Chennai; qualified 2012. Over 14 years of Ayurvedic practice in India, Qatar and Canada. Registered with AYUSH (India); member, Indian Medical Association. Evaluated by WES Canada. |
| Credentials (as stated by owner) | BAMS (Bachelor of Ayurvedic Medicine and Surgery); Registered Massage Therapist; Certified Spiritual Healer, Association of Spiritual Healers of Alberta (ASHA); Certified Herbalist (Alberta) |
| Already practising | Yes: virtual sessions and in-person consultations and spiritual healing in Canada |
| Clinic | A physical clinic opens soon; until then consultations are virtual. Pages are written for the clinic as planned, with placeholder address, phone and hours. **The site does not go live until the real address is in** |
| Massage association and member no. | To be supplied (Q-06) |
| Prices | **Approved 2026-10-15** from the pricing study (D-18). CAD, GST extra. Massage GST treatment pending the accountant |

**Not affiliated with O2 Herbal Therapy Centre.** The owner was formerly part of O2 and is not
any more. O2 is treated as a competitor. O2's site still shows text the owner wrote; that text
must never be reused here (see `rules.md` R2).

## 3. Who it is for

| Segment | Who | What they search | What they need from the site |
| --- | --- | --- | --- |
| A. Calgary families familiar with Ayurveda | South Asian households (10% of Calgary's metro population, 2021 census) | "ayurveda calgary", "panchakarma calgary", "postnatal massage" | Proof of real training (BAMS), therapy names they recognise, prices |
| B. Calgary wellness clients | Working-age, insured, often new to Ayurveda | "shirodhara calgary", "ayurvedic massage calgary", "indian head massage" | Plain-language explanation, what to expect, insurance receipts |
| C. Canadians outside Calgary | People with no local practitioner | "online ayurvedic consultation canada" | How online sessions work, fee, practitioner credibility |
| D. Spiritual healing seekers | Calgary and online | "spiritual healing calgary", "energy healing", "distance healing" | What a session is, who the healer is, clear limits |

## 4. Positioning

**One line:** Authentic Ayurveda from a BAMS-trained practitioner who is also a registered
massage therapist, in Calgary and online across Canada.

**Why us (use these, in this order):**

1. **Depth of training.** BAMS is a 5½-year degree; the practitioner also completed a 1½-year hospital internship in Chennai and has practised for over 14 years in India, Qatar and Canada. Most Calgary pages ranking for Ayurvedic
   massage belong to spas and physio clinics.
2. **One practitioner, four credentials.** Consultation, hands-on therapy, herbs and
   spiritual healing from the same person. No ranking competitor shows this combination.
3. **Insurance-friendly massage.** Massage therapy by an RMT can be receipted for extended
   health benefits.
4. **Transparent.** Published prices, published limits, published herb-safety policy. The two
   main Calgary competitors publish no prices.

**Competitors to watch** (detail in the market report):

- Calgary, direct: Ayurkulam, Healwell Ayurveda & Panchkarma, O2 Herbal Therapy Centre.
- Calgary, partial: Jocelyn's Aesthetics & Spa (ranks first for Shirodhara and Abhyanga),
  Indian Ayurvedic Massage, FitCan Physio, Ensoul Aesthetics.
- National, online consultations: Ayush for Life, Ayurveda Vancouver, Santhigram Canada,
  Source Ayurveda, Holistic Ayurveda.
- Spiritual healing, Calgary: Luna Holistic, Spirited Connections, Calgary First
  Spiritualist Church.

## 5. Services (canonical names and URLs)

Names and slugs here are the source of truth. Prices were **approved by the owner on 2026-10-15**
(pricing study, D-18). All prices CAD before GST. Change them here first, then in the CMS.

### Consultations

| Service | URL | Mode | Proposed price |
| --- | --- | --- | --- |
| Online Ayurvedic consultation | /consultations/online-ayurvedic-consultation-canada/ | Video | $135 initial (75 min); $75 follow-up (30 min); $95 extended follow-up (45 min) |
| In-person Ayurvedic consultation | /consultations/ayurvedic-consultation-calgary/ | Calgary | Same as online |
| Nadi Pariksha (pulse reading) | /consultations/nadi-pariksha-pulse-reading/ | Calgary | Part of consultation |
| Diet and nutrition | /consultations/ayurvedic-diet-consultation/ | Both | Consultation rates |
| Herbal consultation | /consultations/ayurvedic-herbal-consultation/ | Both | Consultation rates |
| Women's wellness | /consultations/womens-wellness/ | Both | Consultation rates |
| Digestive wellness | /consultations/digestive-wellness/ | Both | Consultation rates |
| Stress and sleep | /consultations/stress-and-sleep/ | Both | Consultation rates |
| Guided seasonal cleanse | /consultations/seasonal-cleanse-program/ | Both | Initial consultation + follow-ups; package price TBD after first season |
| Free discovery call (15 min) | /book/ | Phone/video | $0 |

### Therapies (Calgary, in person)

| Therapy | URL | Proposed price |
| --- | --- | --- |
| Abhyanga (warm oil massage) | /therapies/abhyanga/ | $120 / 60 min; $165 / 90 min |
| Shirodhara | /therapies/shirodhara/ | $130 / 60 min; Abhyanga + Shirodhara $230 / 105 min |
| Kati Vasti (lower back) | /therapies/kati-vasti/ | $95 / 45 min |
| Janu Vasti (knees) | /therapies/janu-vasti/ | $90 / 45 min |
| Greeva Vasti (neck) | /therapies/greeva-vasti/ | $90 / 45 min |
| Nasya (home nasal-drop guidance; not performed at the clinic) | /therapies/nasya/ | No charge; advice page, covered in a consultation |
| Skin care therapies | /therapies/ayurvedic-skin-care/ | From $85 (see facial); consultation for plans |
| Panchakarma program (Kati Vasti, Janu Vasti, Shirodhara, diet and routine; no internal procedures) | /therapies/panchakarma/ | $695 / 5 days · "stomach wash" component pending Q-16 |
| Shiro Abhyanga (Indian head massage) | /therapies/indian-head-massage/ | $65 / 30 min |
| Pada Abhyanga (foot massage) | /therapies/ayurvedic-foot-massage/ | $65 / 30 min |
| Udvartana (herbal powder massage) | /therapies/udvartana/ | $125 / 60 min |
| Kizhi / Potli (herbal poultice) | /therapies/kizhi-potli-massage/ | $125 / 60 min |
| Pizhichil (warm oil bath) | /therapies/pizhichil/ | $160 / 75 min |
| Swedana (herbal steam) | /therapies/swedana-herbal-steam/ | $25 add-on |
| Marma therapy | /therapies/marma-therapy/ | Within Abhyanga, or $90 / 45 min standalone (TBD, confirm with practitioner) |
| Mukha Lepam (Ayurvedic facial) | /therapies/ayurvedic-facial/ | $85 / 45 min |
| Hair and scalp therapy | /therapies/ayurvedic-hair-scalp-therapy/ | $80 / 45 min |
| Postnatal Ayurvedic massage | /therapies/postnatal-ayurvedic-massage/ | $140 / 75 min |

"Vasti" on this site always means the **external** oil-pooling therapies above. Internal
Vasti (enema) is not offered and not advertised (`rules.md` R1.2).

### Packages (approved 2026-10-15)

| Package | Price | Saving |
| --- | --- | --- |
| Shirodhara × 3 | $350 | ~10% |
| Vasti (any) × 5 | $400 | ~15% |
| Abhyanga 60 × 6 | $650 | ~10% |
| Initial consultation + Abhyanga 60 | $230 | $25 |
| Panchakarma 5-day program | $695 | vs. $845 à la carte |
| Energy healing × 3 | $240 | ~11% |
| Introductory offer: first Abhyanga 60 | $99 | First 60 days after launch only |

Packages are prepaid, valid 6 months, non-transferable; the detail lives on `/prices/`.

### Massage therapy (RMT)

Deep tissue, reflexology and mobile massage each have a page **only if the owner confirms the
service is offered** (`tasks.md` F-05).

### Spiritual healing

| Service | URL | Mode | Proposed price |
| --- | --- | --- | --- |
| Energy healing session | /spiritual-healing/energy-healing-session/ | Calgary | $90 / 60 min |
| Distance healing | /spiritual-healing/distance-healing/ | Online | $70 / 45 min |
| Chakra balancing | /spiritual-healing/chakra-balancing/ | Calgary | Only if offered |
| Ayurveda + spiritual healing | /spiritual-healing/ayurveda-and-spiritual-healing/ | Calgary | $150 / 90 min combined session |

## 6. Site map in brief

Full list with keywords, titles and H1s: `Ayurvedachalam_100_Page_SEO_Map.xlsx`.

| Section | Folder | Pages | How it is produced |
| --- | --- | --- | --- |
| Core and trust | / | 10 | Hand-built, Wave 1 |
| Consultations | /consultations/ | 10 | Wave 1 (4), Wave 2 (6) |
| Therapies | /therapies/ | 20 | Wave 1 (10), Wave 2 (10) |
| Massage therapy | /massage-therapy/ | 4 | Wave 2 |
| Spiritual healing | /spiritual-healing/ | 8 | Wave 1 (2), Wave 2 (6) |
| Wellness concerns | /concerns/ | 15 | Wave 2 (8), Wave 3 (7) |
| Calgary | /calgary/ | 5 | Wave 1 (1), Wave 3 (4) |
| Online by region | /online/ | 4 | Wave 3 |
| Policies | / | 4 | Wave 1 (3), Wave 2 (1) |
| **Articles ("Learn")** | /learn/ | 20 mapped, then open-ended | Hub + 6 cornerstone articles at launch, then **3 a week by the article pipeline** |

"Articles" and "Learn" are the same section. The nav label is **Learn**; the URL folder is
`/learn/`.

## 7. How a visitor becomes a client

```
Search / Maps / social
        │
        ▼
Article or concern page ──► Therapy or consultation page ──► Book (scheduler)
        │                               │
        └──► Newsletter sign-up         └──► Free 15-min discovery call
```

- **Primary action on every page:** Book an appointment.
- **Secondary action:** Free 15-minute discovery call (for people not ready to book).
- **Tertiary action (articles only):** Newsletter sign-up, with express consent.
- Booking, intake forms and receipts happen in an external practice-management tool, not on
  this site (`architecture.md` §8). The site never collects health details.

## 8. Success measures

Targets marked * are proposals; the owner sets the final numbers once there is a baseline.

| Measure | Source | Target |
| --- | --- | --- |
| Launch set live and indexed | Search Console | 37 pages within 4 weeks of launch |
| All 100 mapped pages live | CMS | By week 13 |
| Articles published | CMS | 3 a week, every week |
| Google Business Profile | Google | Live before launch; a review request after every visit |
| Top-10 rankings, Calgary therapy terms | Search Console | shirodhara / abhyanga / kati basti / ayurvedic massage "calgary" by month 3 * |
| Bookings started from the site | GA4 event `book_click` | Baseline month 1, then +20% month over month to month 6 * |
| Discovery calls booked | Scheduler | Baseline month 1 * |
| Compliance | Linter + monthly audit | Zero banned-claim words on any live page |

## 9. Out of scope for version 1

- Online shop for herbs or oils. (Later, and only for products with a Health Canada NPN.)
- Client accounts, client portal, or any storage of health information on this site.
- Video consultation built into the site. Use the scheduler's or a standard video tool.
- Languages other than English. (Tamil, Hindi, Punjabi and French are later options.)
- Dozens of neighbourhood pages. Four Calgary quadrant pages only.
- Internal Vasti, and any service on the LEGAL CHECK list until it is cleared.

## 10. Open questions for the owner

Tracked with IDs in `memory.md` §5. The ones that block the build:

1. Practitioner name, photo, degree details and association numbers.
2. Clinic address, phone and hours (NAP).
3. ~~Final price list.~~ Approved 2026-10-15.
4. Which optional services are really offered (deep tissue, reflexology, mobile, chakra
   balancing, facial, postnatal home visits).
5. Booking tool choice.
6. Who controls the Alignable listings in the Ayurvedachalam name.
7. Lawyer's answers on the LEGAL CHECK items.
