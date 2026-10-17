# rules.md — Ayurvedachalam

> The rules every person and every agent follows when writing, designing or building for
> this site. Last updated: 2026-10-14.
>
> **Order of authority when documents disagree:**
> `rules.md` → `product.md` → `design.md` → `architecture.md` → `tasks.md`.
> `memory.md` records what was decided and when; it never overrides a rule.
>
> **Status of the legal rules:** R1 is a careful reading of public sources, not legal advice.
> An Alberta health lawyer reviews it before launch (`tasks.md` F-02). Until then, follow it
> as written and choose the more cautious wording when unsure.

---

## R0. How to use this file

- A rule marked **MUST** is enforced: by the linter, by CI, or by review before publishing.
- A rule marked **SHOULD** is the default; depart from it only with a reason written in the
  commit message or the CMS note.
- If a task cannot be done without breaking a MUST rule, stop and record the conflict in
  `memory.md` §5 (open questions). Do not work around the rule.

---

## R1. Legal and compliance wording

### R1.1 Titles and credentials

- **MUST NOT** use "Dr.", "Doctor", "physician" or "surgeon" as the practitioner's title,
  anywhere: page copy, meta tags, image alt text, schema, social profiles, email signatures.
  Alberta's Health Professions Act (s. 128) restricts those titles in connection with
  providing a health service, and Ayurveda is not a regulated profession in Alberta.
- **MUST** describe the practitioner as: **"Ayurvedic Practitioner (BAMS), Registered Massage
  Therapist"**, or "Vaidya" where a traditional term fits.
- **MUST** name the massage association and member number wherever "RMT" or "Registered
  Massage Therapist" is used as a credential on a service or insurance page.
- **MAY** spell out the full degree name, **Bachelor of Ayurveda Medicine and Surgery
  (BAMS)**, with its standing: recognised by the Government of India (Ministry of AYUSH)
  and evaluated by WES Canada. The degree is not a Canadian medical qualification and does
  not make the holder a medical doctor; the site says so plainly wherever the full name is
  spelled out (owner decision, LC-1). Elsewhere, "BAMS" with one plain gloss per page:
  "a degree in Ayurvedic medicine from India" (the practitioner page gives the full seven-year detail).
- "Ayurveda Practitioner" and "Ayurvedic Practitioner" are both acceptable; use one
  consistently per page.
- "Ayurvedic doctor calgary" and similar are **search phrases**. They may appear in a
  sentence that answers the search ("People often search for an Ayurvedic doctor in
  Calgary. In Alberta, …"), never as a description of the practitioner.
- **MUST NOT** say or imply that Ayurveda, the practitioner or the clinic is licensed,
  regulated, approved or recognised by Alberta Health, Health Canada or any college.

### R1.2 What may be offered and described

- **MUST NOT** offer, describe as available, or price: internal Vasti (enema), Vamana,
  Virechana, Raktamokshana, or any procedure that goes beyond the anal verge or beyond the
  point where the nasal passages narrow. Alberta restricts these activities to authorised
  regulated professionals.
- **Nasya is not performed at the clinic** (owner decision, LC-2). The practice recommends
  Nasya for self-use at home, for example nasal drops, within a consultation. The Nasya
  page is therefore an **advice page**, not a bookable therapy: no price, no "book this",
  and the words "we do not perform any procedure on the nasal passages" on the page.
- **Panchakarma is offered as a named set of external therapies** (owner decision, LC-3):
  Kati Vasti, Janu Vasti, Shirodhara and similar external work, with diet and routine
  guidance. The page lists exactly what is included and says the classical internal
  procedures are not offered. **Open point:** the owner also listed "cleansing of
  stomach wash". If that means a procedure that induces vomiting or purging (Vamana or
  Virechana) it stays on the not-offered list until a lawyer confirms otherwise; if it means
  a dietary or herbal routine the client follows at home, it may be described as such.
  Do not publish wording about it until the owner clarifies (Q-16).
- Kati, Janu and Greeva Vasti **MUST** be described as external: warm oil held on the skin
  inside a dough ring.
- The Nasya and Panchakarma pages, and any article linking to them, still go to `review`
  before publishing so a person checks the wording above was followed.
- **MUST NOT** use the words diagnose, diagnosis, prescribe or prescription for anything the
  practitioner does. Use: assess, assessment, pulse reading, recommend, suggestion, plan.
- **MUST NOT** advise anyone to stop, reduce or delay medication or medical care. Every
  concern page and article carries the "see a physician" line (R1.5).

### R1.3 Health claims

The principle: describe the tradition and the experience; never promise a medical outcome.

| Never write | Write instead |
| --- | --- |
| cures, heals (a condition), treats, reverses, eliminates, fixes | supports, is traditionally used for, may help with, many clients report |
| treatment for [disease] | approach to [everyday concern], care for, support for |
| guaranteed, proven, clinically proven, 100%, permanent, miracle | (remove) |
| no side effects, completely safe, harmless | generally well tolerated; who should avoid it is listed below |
| detox, removes toxins (as a factual claim) | "cleansing" as the tradition describes it; say "in Ayurvedic terms" |
| boosts immunity, balances hormones (as fact) | "is traditionally used to support…" |
| patient, patients | client, clients |
| medicine, medication (for herbs) | herb, herbal preparation, natural health product |
| anti-ageing, slows ageing | (remove) |
| weight loss, cellulite reduction (as a result) | (remove; describe the therapy itself) |

- **MUST NOT** name a serious disease as something the practice treats, prevents or cures.
  This includes, among others: cancer, diabetes, depression, anxiety disorders, asthma,
  arthritis, hypertension, heart disease, thyroid disorders, obesity, dementia, paralysis,
  epilepsy, infertility, psoriasis, eczema, hepatitis, ulcers, glaucoma, any infection, and
  anything listed in Schedule A.1 of the Food and Drugs Act (check the current list on the
  Justice Laws website before adding any condition name).
- Concern pages use everyday wording: "knee and joint discomfort", "dry and sensitive
  skin", "sleep support", "stress relief".
- A disease name **may** appear when the sentence is safety information or a referral:
  "If you have diabetes, tell us before a foot massage"; "Persistent joint pain can be a sign
  of arthritis; see your physician."
- **Keywords are not claims.** A page may target the search phrase "ayurvedic treatment for
  back pain" through its topic, URL and one natural sentence that reflects the search.
  The title, H1 and body still follow the table above.
- **MUST** have a source for every number, percentage, study result or "research shows"
  statement (R4.4). If there is no source, remove the statement.

### R1.4 Reviews and testimonials

- **MUST** be real, from a real client, with consent recorded.
- **MUST NOT** publish a review that says a condition was cured, reversed or fixed, or that
  the client stopped medication. Ask the client for a different wording or leave it out.
- **MUST NOT** edit a review's meaning. Shortening is fine; mark cuts with "…".
- No incentives for reviews. No reviews written by staff, family or AI.

### R1.5 Required notices (exact text lives in `settings`)

| Where | Notice |
| --- | --- |
| Footer, every page | Link to `/health-disclaimer/` |
| Every service, concern and article page | "Ayurveda and spiritual healing are complementary practices. They do not replace medical diagnosis or treatment. Please see your physician for any health concern, and tell them about any herbs or therapies you use." |
| Every concern page | A "When to see a physician" section with specific red flags for that concern |
| Every spiritual healing page | "Spiritual healing is offered as support for wellbeing. It is not medical or mental health care." Plus: "If you are in crisis, call or text 9-8-8 (Suicide Crisis Helpline, Canada) or call 911." |
| Every herb mention with a product | "We recommend only natural health products licensed by Health Canada (look for the NPN on the label)." |
| Pricing and insurance pages | "Massage therapy provided by our Registered Massage Therapist is receipted for extended health benefits. Ayurvedic consultations and spiritual healing are generally not covered. Check your own plan." |
| Therapy pages | A "Who should avoid this" list (for example pregnancy, fever, open wounds, recent surgery, as applicable) |

### R1.6 Insurance

- **MUST** receipt as massage therapy only what is massage therapy performed by the RMT.
- **MUST NOT** suggest that a consultation, Shirodhara alone, Nasya or spiritual healing can
  be claimed as massage. If a session combines massage with something else, say that only
  the massage portion is receipted.
- "Direct billing" **MUST NOT** appear until the owner confirms which insurers accept it.

### R1.7 Herbs and products

- **MUST** recommend, name or link only products with a Health Canada NPN.
- **MUST NOT** give doses for a medical condition, or dosing for children or pregnancy.
- **MUST NOT** mention bhasmas, rasa preparations or any metal- or mineral-based product.
- Herb articles **MUST** include: what it is, traditional use (labelled as traditional),
  who should avoid it, possible interactions, and "talk to your pharmacist or physician".

---

## R2. Originality

- **MUST** write every page fresh. **MUST NOT** copy, paraphrase closely or "restore" text
  from o2herbaltherapy.ca, from the Alignable listings in the Ayurvedachalam name, or from
  any other site, even where the owner wrote the original. Google saw it there first, so
  reuse here would read as copying.
- **MUST NOT** copy competitor wording or structure sentence by sentence.
- **MUST NOT** reuse the same paragraph on two pages of this site, except the required
  notices in R1.5. Therapy pages share a structure, not sentences.
- **MUST NOT** use competitor names in copy, titles or meta tags.
- Images: own photos, licensed stock with the licence saved, or commissioned work only.
  Nothing lifted from another clinic's site. AI-generated images **MUST NOT** depict the
  practitioner, real clients or the real clinic.

---

## R3. SEO

- **R3.1** One primary keyword per page. No two pages or articles share one. The page map
  spreadsheet and the `articles` collection are the registers; check both before assigning.
- **R3.2** Title tag ≤ 60 characters, primary keyword in the first half, then a place or a
  credential, then the brand where it fits.
- **R3.3** Meta description ≤ 155 characters, includes the keyword and one concrete detail
  (length, price, place). No claims.
- **R3.4** Exactly one H1 per page. It is not identical to the title tag.
- **R3.5** Slugs: lowercase, hyphens, trailing slash, no dates, no stop-word padding. A
  published slug is permanent. Change needs a 301 and an entry in `memory.md`.
- **R3.6** Use both spellings where people search both: Vasti/Basti, Panchakarma/Panchkarma,
  Shirodhara/Sirodhara, Abhyanga/Abhyangam. Primary spelling is the first of each pair.
- **R3.7** Every service page links to: its hub, two related services, `/book/`. Every
  article links to at least one service page and one other article or hub. Anchor text
  describes the destination; never "click here".
- **R3.8** Calgary pages name real places only (quadrants, landmarks, transit). No lists of
  neighbourhoods added for search. No page exists only to swap a place name.
- **R3.9** Structured data must match what is visible on the page. No review stars in
  schema unless those reviews are on the page.
- **R3.10** No keyword stuffing. Read the sentence aloud; if it sounds written for a search
  engine, rewrite it.
- **R3.11** New pages outside the page map need a row added to the spreadsheet first.

---

## R4. Articles

- **R4.1 Length.** 1,000–1,800 words typical; 800 minimum; never padded.
- **R4.2 Structure.** Title · author line with credentials and date reviewed · answer in
  the first two sentences · 4–7 H2 sections, at least three as questions · FAQ with 3–5
  questions · sources · R1.5 notice · call to action linking to one service and `/book/`.
- **R4.3 One job.** Each article answers one search question fully. It links up to the
  service or hub that sells the solution; it does not try to rank for that page's keyword.
- **R4.4 Sources.** Any figure, date, regulation or research claim needs a link to the
  primary source: government (Health Canada, Statistics Canada, Alberta), a regulator, or a
  peer-reviewed paper. Not another clinic's blog. Check each link opens. Record the access
  date. Facts about fees, rules and insurance are looked up fresh each time, never recalled.
- **R4.5 Evidence language.** Separate three things in the wording: what Ayurvedic
  tradition says ("In Ayurveda, …"), what clients commonly report, and what research has
  found (with a source, and with its limits stated). Never present the first as the third.
- **R4.6 Local detail.** Where it is natural, tie the topic to Calgary or Canada: dry air,
  chinooks, winter, Canadian grocery items, Canadian rules. This is what global content
  sites cannot do.
- **R4.7 Author.** Every article is attributed to the practitioner and **reviewed by the
  practitioner before or within the hold period**. `reviewed_at` is set by a human in the
  CMS, not by the pipeline.
- **R4.8 Updates.** Articles with rules, prices or product information are re-checked every
  six months; the visible "Reviewed" date changes only when a human re-checked it.

---

## R5. Voice and style

- **Plain Canadian English.** colour, centre, licence (noun), practise (verb), fibre.
  Dollar amounts as "$120". Times as "9 a.m.". Dates as "13 October 2026".
- **Calm, clear, modest.** Short sentences. Explain, then invite. No hype, no exclamation
  marks, no "ancient secrets", no "transform your life".
- **"We" for the practice; "I" only in the practitioner's own bio.** "You" for the reader.
- **Sanskrit terms:** on first use give the term and a plain gloss: "Abhyanga (warm oil
  massage)". After that, use the Sanskrit name. No diacritics in body text or URLs.
- **Dosha talk** is always framed as Ayurvedic theory: "Ayurveda describes three doshas…".
- **Respect.** Ayurveda and spiritual practice are living traditions. No exoticising
  ("mystical East"), no religious imagery used as decoration, no deity images.
- **Inclusive.** No assumptions about gender, faith, body size or family structure.
- **Never write:** "In today's fast-paced world", "delve", "unlock", "journey" as filler,
  "game-changer", "holistic" more than once per page.
- **Numbers:** prices and durations always appear together and match `/pricing/`.

---

## R6. Privacy and consent

- **MUST NOT** collect health details on this site: no symptom fields, no free-text "tell us
  about your condition". The contact form carries the "do not include health details"
  notice.
- **MUST** get express consent for email (CASL): unticked checkbox, clear wording, sender
  identified, unsubscribe link in every email. Store the consent text and time.
- **MUST** publish a privacy policy naming a privacy contact, what is collected, why, how
  long it is kept and that data is stored in Canada where that is true.
- **MUST** keep analytics free of personal data: no emails or names in URLs or events.
- **MUST** show reviews only with recorded consent, using first name and last initial.
- Client records follow whatever privacy law applies to wellness and massage clinics in
  Alberta (owner decision, LC-4). For a practice that is not a regulated health custodian
  that is Alberta's Personal Information Protection Act (PIPA) and, for anything touching
  federal matters, PIPEDA; the privacy policy is written to PIPA. Confirm with the lawyer
  or the Office of the Information and Privacy Commissioner of Alberta before launch.

---

## R7. Engineering

- **R7.1** Content pages render on the server. No "loading…" for main content.
- **R7.2** TypeScript strict. No `any` in `lib/`. Lint and type-check pass before merge.
- **R7.3** Design tokens only. No hex colours, font names or pixel spacing in components;
  use the variables from `design.md` §12.
- **R7.4** Accessibility is a merge requirement: keyboard path, focus ring, labels, alt
  text, contrast from the approved pairs. Automated axe check in CI.
- **R7.5** Performance budget in `architecture.md` §10 is a merge requirement for templates.
- **R7.6** The compliance linter runs in CI over all seeded and CMS content
  (`npm run lint:content`). A failing linter blocks deploy.
- **R7.7** No secrets in the repo, in these docs, in screenshots or in logs.
- **R7.8** Database changes are additive; a migration script accompanies any rename.
- **R7.9** Every template has a test that renders it with seed data and checks: one H1,
  title, meta description, canonical, JSON-LD parses.
- **R7.10** Small commits with a task ID from `tasks.md` in the message (`B-12: service
  template`). Update `tasks.md` status in the same commit.
- **R7.11** Third-party scripts need a line in `memory.md` §3 saying why. Default is none
  beyond GA4, the scheduler embed and the map.

---

## R8. Automation (the article pipeline and any scheduled task)

- **R8.1** One article per run. At most three in a calendar week. No backfilling missed
  runs.
- **R8.2** Take the first `Pending` item in `queue.md` (relay repo). Do not reorder or invent
  topics. If the queue is empty, propose five and deliver nothing.
- **R8.3** Research with live sources on every run. Never state a fee, rule, date or
  statistic from memory.
- **R8.4** Before delivery, self-check against R1, R3 and R4. If any MUST fails and cannot
  be fixed without changing the topic, set `needs_human: true` and say why.
- **R8.5** Deliver only through the relay repo. Never call the site, the CMS or the
  database directly. Never touch the site repo.
- **R8.6** Confirm delivery by the relay's cleanup commit. If it does not appear within five
  minutes, save the article as a file, send it to the owner, report what failed, stop.
  Maximum two push attempts.
- **R8.7** After delivery: mark the item `Delivered` with the date in `queue.md` (which is
  also the publishing log) and report: title, slug, status, preview link, anything the
  owner should look at.
- **R8.8** Never auto-publish: anything touching a LEGAL CHECK page; herb articles naming a
  specific product; anything about pregnancy, children, cancer or mental illness. These
  always go to `review`.
- **R8.9** Credentials (GitHub token, ingest key) are read from the project's secure notes
  only. Never printed, never written into an article, a log or these docs.
- **R8.10** Publishing to social media, sending email to clients, or editing live pages is
  outside the pipeline's remit. Prepare and hand off; a human approves.

---

## R9. Keeping the documents alive

- **R9.1** Start every working session by reading `memory.md`, then the file for the work.
- **R9.2** A decision is not made until it is in `memory.md` §3 with a date and an ID.
- **R9.3** When a rule changes: edit this file, bump "Last updated", add a line to
  `memory.md` §8 (change log), update `banned-terms.json` if R1.3 changed, and copy the new
  file into `runbook/` in the relay repo so the article task reads the same rules.
- **R9.4** When a task is finished: tick it in `tasks.md` with the date. Do not delete
  finished tasks; move them to "Done" at the end of the phase.
- **R9.5** Facts that will go stale (prices, hours, regulation status, competitor
  positions) carry an "as of" date wherever they are written down.
- **R9.6** Review these six files on the first Monday of each month (`tasks.md` O-06).

---

## LEGAL CHECK register

Owner's answers recorded 2026-10-14. "Decided" means the owner has set the position and the
rules above reflect it; a lawyer's confirmation is still worth having before launch.

| ID | Question | Owner's answer (2026-10-14) | Affects | Status |
| --- | --- | --- | --- | --- |
| LC-1 | May the full degree name be shown? | Yes. "Bachelor of Ayurveda Medicine and Surgery" is recognised by the Government of India and AYUSH and endorsed by WES Canada. It is not a medical doctor qualification, so never "Dr." in Canada; the title is Ayurveda Practitioner. | Practitioner page, footer, schema | Decided |
| LC-2 | How may Nasya be performed and described? | Not performed. The practice recommends Nasya methods for self-use, such as nasal drops, and provides no therapy on the nasal passage. | /therapies/nasya/, sinus pages | Decided |
| LC-3 | Which Panchakarma components may be offered? | Kati Vasti, Janu Vasti, Shirodhara, and "cleansing of stomach wash". | /therapies/panchakarma/, cleanse program | Decided, except "stomach wash" (Q-16) |
| LC-4 | Which privacy law governs client records? | Whatever applies to wellness and massage clinics in Canada. | Privacy policy, booking tool | Decided: write to Alberta PIPA; confirm |
| LC-5 | Is the claims wording sufficient for services? | Yes. Strengthen pages with Ayurvedic lifestyle content: daily living, diet, Vata-Pitta-Kapha balance, yoga and meditation. | All content | Decided |
| LC-6 | Spiritual healing and the ASHA credential | Follow the Association of Spiritual Healers of Alberta (spiritualhealersalberta.ca): its sessions are free or by donation and it offers training and membership. Describe the credential as ASHA membership and training, in ASHA's own terms. | /spiritual-healing/* | Decided |
| LC-7 | O2 Herbal Therapy Centre's use of the owner's text | Ignore for now. | Listings clean-up | Parked |
