# design.md — Ayurvedachalam

> Look, layout and components. Open `design-preview.html` beside this file to see the palette,
> type and the home page layout rendered. Last updated: 2026-10-13.
> Status: **APPROVED by the owner, 2026-10-14 (D-05).**

## 1. Direction

**"The copper vessel."** Shirodhara is poured from a copper vessel in a single steady stream.
That image gives the site its character: warm paper-coloured pages, deep neem green for
authority, copper for every action, and one thin copper line that runs down the page like the
stream of oil.

What it should feel like: a well-kept clinic with a library, not a spa. Calm, warm, exact.

What it must not look like: stock spa imagery (stacked stones, orchids, candles), mandala
wallpaper, purple gradients, gold-on-black "luxury", or a medical clinic in blue and white.

**Three design principles**

1. **Credibility before atmosphere.** Credentials, prices and "what happens" are visible
   without scrolling far. Decoration never pushes facts down.
2. **One accent, one action.** Copper means "you can act here". Nothing else is copper.
3. **Quiet pages.** Generous margins, one idea per section, no carousels, no pop-ups.

## 2. Brand basics

- **Name in text:** Ayurvedachalam (one word, capital A only).
- **Wordmark:** the name set in Fraunces, weight 500, neem green, with a small copper drop
  after the final "m". No symbol needed for launch. A favicon uses the drop on a neem square.
- **Descriptor line** (under the wordmark in the header and footer):
  "Ayurveda · Therapies · Spiritual Healing — Calgary".
- **Tagline options** for the owner to choose (Q-10):
  "Authentic Ayurveda, in Calgary and online." / "Ayurveda, practised with care."

## 3. Colour

### 3.1 Tokens

| Token | Hex | Name | Use |
| --- | --- | --- | --- |
| `--ink` | `#1E2A25` | Ink | Body text, headings on light |
| `--stone` | `#5E6B64` | Stone | Secondary text, captions, meta |
| `--neem` | `#1F4D3F` | Neem | Primary brand: header text, links, dark sections, headings accents |
| `--neem-deep` | `#143329` | Deep neem | Footer, dark CTA band, hover on neem |
| `--neem-soft` | `#DCE8E1` | Neem mist | Tinted panels, consultation section tint |
| `--copper` | `#A9502A` | Copper | **Primary buttons, the dhara line, active states** |
| `--copper-deep` | `#8A3F1F` | Deep copper | Button hover, copper text on light |
| `--copper-soft` | `#F4E1D6` | Copper wash | Therapy section tint, notices |
| `--turmeric` | `#E0A526` | Turmeric | Small highlights only: rating stars, a rule under a number, "new" dot |
| `--turmeric-soft` | `#FBF0D2` | Turmeric wash | Highlight panels (tips, "good to know") |
| `--dusk` | `#3F3D6B` | Dusk | Spiritual healing section accent |
| `--dusk-soft` | `#E6E5F1` | Dusk mist | Spiritual healing section tint |
| `--sesame` | `#FAF6EE` | Sesame | Page background |
| `--sandal` | `#F1E7D6` | Sandal | Alternate section background, cards on white |
| `--white` | `#FFFFFF` | White | Cards, form fields |
| `--line` | `#D9D0BF` | Line | Borders, dividers (decorative only) |
| `--success` | `#2E6B4A` | | Form success |
| `--error` | `#A32D2D` | | Form errors |

Proportion on a typical page: about 70% sesame/white, 20% neem, 8% sandal and tints,
2% copper. Turmeric is a pinch.

### 3.2 Approved text pairs (WCAG contrast, computed)

| Text | Background | Ratio | Use for |
| --- | --- | --- | --- |
| Ink | Sesame | 13.8 | Body text |
| Ink | White | 14.9 | Body text on cards |
| Ink | Sandal | 12.1 | Body text on alternate sections |
| Ink | Neem mist | 11.8 | Text on tinted panels |
| Ink | Turmeric wash | 13.1 | Tip panels |
| Ink | Turmeric | 6.8 | Text on a turmeric tag |
| Stone | Sesame | 5.2 | Secondary text |
| Stone | White | 5.6 | Secondary text on cards |
| Stone | Sandal | 4.6 | Secondary text, 16px and larger only |
| Neem | Sesame | 8.9 | Links, headings |
| Neem | Neem mist | 7.6 | Headings on tint |
| White | Neem | 9.6 | Text on dark sections |
| White | Deep neem | 13.7 | Footer text |
| White | Copper | 5.4 | Primary button label |
| White | Deep copper | 7.5 | Button hover |
| Deep copper | Sesame | 6.9 | Copper-coloured text links |
| Deep copper | Copper wash | 5.9 | Text on notices |
| White | Dusk | 10.0 | Spiritual healing dark band |
| Dusk | Dusk mist | 8.1 | Headings on dusk tint |
| Turmeric | Deep neem | 6.2 | Small highlights on dark |

**Do not use:** Stone on Neem mist (4.4), Turmeric on Neem for small text (4.4), Turmeric
or Line as text on any light background, Copper (not deep) for small text on Sandal.

### 3.3 Section accents

Each of the three pillars has a quiet accent so visitors always know where they are.

| Section | Accent | Tint | Where it shows |
| --- | --- | --- | --- |
| Consultations | Neem | Neem mist | Eyebrow label, summary box, card top rule |
| Therapies, Massage | Copper | Copper wash | Same |
| Spiritual healing | Dusk | Dusk mist | Same, plus the dark band on its hub |
| Concerns, Learn, everything else | Neem | Sandal | Same |

Buttons stay copper in every section.

## 4. Typography

| Role | Family | Fallback | Notes |
| --- | --- | --- | --- |
| Display and headings | **Fraunces** (variable) | Georgia, serif | Weight 500 for H1–H2, 600 for H3; optical size on; soft setting low |
| Body and interface | **Figtree** (variable) | system-ui, sans-serif | 400 body, 500 labels, 600 buttons |

Both are open-licence Google Fonts; self-host them (no request to Google at runtime).

| Style | Desktop | Mobile | Line height | Other |
| --- | --- | --- | --- | --- |
| Display (home hero) | 60px | 38px | 1.05 | Fraunces 500, letter-spacing -0.02em |
| H1 | 46px | 32px | 1.1 | Fraunces 500, -0.015em |
| H2 | 32px | 26px | 1.2 | Fraunces 500 |
| H3 | 22px | 20px | 1.3 | Fraunces 600 |
| H4 / card title | 18px | 18px | 1.35 | Figtree 600 |
| Lead paragraph | 20px | 18px | 1.55 | Figtree 400, Stone or Ink |
| Body | 17px | 17px | 1.65 | Figtree 400 |
| Small / meta | 14px | 14px | 1.5 | Figtree 500, Stone |
| Eyebrow | 13px | 13px | 1.2 | Figtree 600, uppercase, letter-spacing 0.12em, section accent colour |
| Button | 16px | 16px | 1 | Figtree 600 |

- Body text column: 68 characters maximum (about 680px).
- Sanskrit terms are set in the body face, not italic, with the gloss in brackets on first use.
- Numbers in prices and durations use tabular figures.

## 5. Space, shape, depth

- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding: 96 desktop,
  56 mobile. Card padding: 24–32.
- **Grid:** 12 columns, 1200px maximum content width, 24px gutters, 24px side margin on
  mobile, 48px on tablet.
- **Breakpoints:** 480, 768, 1024, 1280.
- **Radius:** 6px controls, 14px cards, pill (999px) for tags. **Vessel arch:** hero and
  practitioner photos have a fully rounded top (`border-radius: 999px 999px 14px 14px`),
  echoing the Shirodhara vessel.
- **Borders over shadows.** Cards: 1px Line border on white, no shadow at rest; on hover the
  border turns Neem and the card lifts 2px. One soft shadow only, for the sticky header and
  open menu: `0 8px 24px rgba(30,42,37,0.08)`.
- **Texture:** a very light paper grain on Sesame sections (CSS noise at 3% opacity). None on
  white cards.

## 6. The dhara line (signature element)

A 2px copper vertical line, used sparingly:

- **Home hero:** drops from the top edge beside the headline and ends in a small copper drop
  just above the Book button. Draws once on load (700ms), then is still.
- **"How it works" steps:** the line connects the numbered steps top to bottom.
- **Article pages:** a short 48px line with a drop sits above the H1.
- **Section dividers:** a centred 32px line with a drop, in place of a horizontal rule,
  at most twice on a page.

Never animate it on scroll, never use more than one long line per screen, never horizontal.

## 7. Imagery

- **Real photographs first:** the practitioner at work (hands, oil, the copper vessel, herbs
  being prepared), the actual treatment room, Calgary light. Shot in natural light with a
  warm white balance. A half-day shoot before launch is task F-07.
- **Subjects:** hands and materials more than faces; clients only with written consent, and
  never identifiable in a treatment photo unless they agreed to that.
- **Treatment:** no heavy filters; slight warmth; backgrounds that sit on Sesame.
- **Botanical line drawings** (single-weight, neem-coloured: neem leaf, turmeric root,
  sesame pod, tulsi, ashwagandha) for article headers and empty states when no photo fits.
- **Not allowed:** stock spa clichés, deity images, mandalas as wallpaper, before/after
  photos, AI-generated people, anything copied from another clinic (rules R2).
- **Alt text** describes what is in the picture in one plain sentence.

## 8. Layout: global

### Header (sticky, 72px desktop, 60px mobile)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Ayurvedachalam•        Consultations ▾  Therapies ▾  Spiritual Healing ▾     │
│ Ayurveda · Therapies…  Concerns  Learn  About  Pricing        [ Book now ]   │
└──────────────────────────────────────────────────────────────────────────────┘
```

- One row on desktop: wordmark left, seven links centre, copper Book button right.
- Consultations, Therapies and Spiritual Healing open a panel: left column is a two-line
  description of the section with a "See all" link; right is a two-column list of pages.
- A slim top bar above the header (Sandal, 36px): "Calgary, Alberta · In person and online
  across Canada" on the left; phone number on the right. Hidden on mobile.
- Mobile: wordmark, Book button, menu icon. The menu is a full-height sheet with accordions.
  A sticky bottom bar on mobile shows **Book** and **Call**.

### Footer (Deep neem)

Four columns: (1) wordmark, descriptor, address, phone, hours; (2) Services: the three hubs
plus Pricing and Insurance; (3) Learn: latest three articles, FAQ, First visit; (4)
Newsletter sign-up with the consent checkbox. Below: credentials line, the short disclaimer,
links to Privacy, Terms, Health disclaimer, Cancellation.

### Call-to-action band (near the end of every page)

Neem background, white Fraunces heading "Ready when you are.", one sentence, two buttons:
copper **Book an appointment**, outline white **Free 15-minute call**.

## 9. Layout: templates

### 9.1 Home

```
[top bar]
[header]
┌──────────────────────────────────────────────┬───────────────────────────┐
│ eyebrow: AYURVEDA IN CALGARY & ONLINE        │                           │
│ │ Display: Authentic Ayurveda,               │     ╭───────────────╮     │
│ │ practised with care.                       │     │  vessel-arch  │     │
│ │ Lead: consultations, therapies and         │     │     photo     │     │
│ │ spiritual healing from a BAMS-trained      │     │               │     │
│ ● practitioner and RMT.                      │     ╰───────────────╯     │
│ [ Book an appointment ]  Free 15-min call →  │   small card: "Next       │
│                                              │   available: …" (later)   │
└──────────────────────────────────────────────┴───────────────────────────┘
[credential strip: BAMS · RMT + association · ASHA Certified Healer · Certified Herbalist]
[three paths: Consultations | Therapies | Spiritual Healing — one card each, section accent]
[featured therapies: 4 cards — Abhyanga, Shirodhara, Kati Vasti, Nasya — length + price]
[how it works: 3 steps joined by the dhara line — Talk · Plan · Begin]
[meet your practitioner: arch photo left, 90 words + credentials list right, link to profile]
[insurance note panel (Turmeric wash): what is and is not covered]
[reviews: 3 quotes, plain cards, link to all]
[from Learn: 3 latest articles]
[CTA band]
[footer]
```

### 9.2 Hub (Consultations, Therapies, Spiritual Healing, Concerns)

Eyebrow + H1 + 60-word intro on the left; a short "Not sure where to start?" box with the
discovery-call link on the right. Then a card grid (3 across desktop, 1 on mobile). Each
card: name, one-line plain description, length, price from, arrow. Then FAQ, then CTA band.

### 9.3 Service page (every consultation, therapy, healing session)

```
[breadcrumbs]
┌──────────────────────────────────────────────┬───────────────────────────┐
│ eyebrow (section accent)                     │ SUMMARY BOX (sticky)      │
│ H1                                           │ Length      60 min        │
│ Lead: what it is in two sentences            │ Price       $___          │
│                                              │ Where       Calgary       │
│ ## What is [therapy]?                        │ Insurance   RMT receipt / │
│ ## Who it suits                              │             not covered   │
│ ## What happens in a session   (steps)       │ [ Book this ]             │
│ ## Who should avoid it         (list)        │ Free 15-min call →        │
│ ## How many sessions?                        └───────────────────────────┘
│ ## Price and packages          (table)       │
│ ## Frequently asked questions  (accordion)   │
│ notice: complementary-care disclaimer        │
└──────────────────────────────────────────────┘
[related: 3 cards]   [CTA band]
```

On mobile the summary box sits directly under the lead paragraph and the Book button also
lives in the sticky bottom bar.

### 9.4 Concern page

Same frame as the service page, without a price box. The right column holds "Therapies that
may help" (2–3 small cards). Sections: Overview · How Ayurveda looks at it · What may help ·
Self-care at home · **When to see a physician** (Copper wash panel with a list) · FAQ.

### 9.5 Article

```
[breadcrumbs]
        │ ●  (short dhara line)
        eyebrow: category
        H1 (max 2 lines)
        By [Name], Ayurvedic Practitioner (BAMS), RMT · Reviewed 13 October 2026 · 6 min read
        [hero image or botanical drawing, 16:9, 14px radius]
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Answer-first intro (lead size)               │ On this page (H2 list)    │
│ ## Question-style H2 …                       │ ───────────────           │
│ body, 68-character column                    │ Related service card      │
│ tip panel (Turmeric wash) where useful       │ [ Book ]                  │
│ ## Frequently asked questions                │                           │
│ Sources (numbered list, small)               │                           │
│ disclaimer notice                            │                           │
│ author box (photo, credentials, bio, link)   │                           │
└──────────────────────────────────────────────┴───────────────────────────┘
[newsletter panel]  [3 related articles]  [CTA band]
```

### 9.6 Articles index (/learn/)

H1 "Learn Ayurveda", one-line intro. Category pills (seven categories) as links, not
JavaScript filters. One featured article (large, image left). Then a list, 9 per page:
image, category eyebrow, title, 2-line excerpt, date reviewed. Numbered pagination.

### 9.7 Practitioner profile

Arch portrait left; right: name, credential line, a credentials table (credential, issuing
body, year, member number), training story in first person (150–250 words), "How I work",
languages spoken, memberships. Then CTA band.

### 9.8 Pricing

One table per section (Consultations, Therapies, Spiritual healing), columns: Service,
Length, Price, Insurance. Packages below. The insurance note panel. No "from" prices unless
a range is real.

### 9.9 Book

Left: scheduler embed. Right: "Not sure what to book?" with the three most common choices,
the discovery-call link, what to bring, cancellation policy link.

### 9.10 Contact and Calgary

Map embed (lazy-loaded), address, phone, hours table, parking and transit notes, the short
contact form with the "no health details" notice.

## 10. Components

| Component | Spec |
| --- | --- |
| **Primary button** | Copper fill, white label, 6px radius, 14×24 padding, min height 48px. Hover: Deep copper. Focus: 3px Turmeric outline, 2px offset. |
| **Secondary button** | 1.5px Neem border, Neem label, transparent. Hover: Neem mist fill. On dark: white border and label. |
| **Text link** | Neem, underlined (1px, 3px offset). Hover: Deep copper. Arrow links end with "→". |
| **Eyebrow** | Section accent colour, see §4. |
| **Service card** | White, 1px Line border, 14px radius, 3px top rule in section accent. Name (H4), one line, "60 min · $120", arrow. |
| **Article card** | Image 16:9, category eyebrow, title (H4, Fraunces 500 at 20px), excerpt, date. |
| **Summary box** | White, 1px Line border, section-tint header strip, definition rows, Book button. Sticky from 1024px. |
| **Credential strip** | Sandal band, four items in a row, each: small line icon, credential, issuing body. Wraps to 2×2 on mobile. |
| **Steps** | Numbered circles (Neem outline) joined by the dhara line; title + 2 lines each. |
| **FAQ accordion** | Native `<details>`; question in Figtree 600; plus/minus icon; 1px Line dividers. First item open. |
| **Notice** | Copper wash background, 3px Copper left rule, small "Please note" label. Used for disclaimers and "who should avoid". |
| **Tip panel** | Turmeric wash, small turmeric dot, "Good to know". |
| **Price table** | No zebra; 1px Line row dividers; prices right-aligned, tabular figures. Scrolls sideways on mobile inside its own container. |
| **Quote (review)** | Fraunces 500 at 22px, no quote-mark graphic, name in small caps below. |
| **Tag / pill** | Sandal fill, Ink text, 999px radius, 13px. |
| **Breadcrumbs** | Small, Stone, "/" separators, current page not linked. |
| **Form field** | White, 1px Stone border, 6px radius, 48px height, label above, help text below, error text in Error with an icon. |
| **Author box** | Sandal panel, 72px round photo, name, credentials line, 40-word bio, link to profile. |
| **Newsletter panel** | Neem mist, H3, one field, consent checkbox (unticked), button. |
| **Map** | Static image with "Open in Maps" until clicked, then the interactive embed. |

Icons: one line-icon set at 1.5px stroke (for example Lucide), Neem colour, 24px. No emoji.

## 11. Motion and states

- Page load: hero text fades up 12px over 400ms; the dhara line draws once. Nothing else.
- Hover and focus transitions: 150ms ease-out.
- No parallax, no auto-playing carousels, no scroll-triggered reveals below the hero.
- `prefers-reduced-motion`: all motion off; the line appears drawn.
- Every interactive element has hover, focus-visible, active and disabled states.

## 12. CSS variables (copy into `styles/tokens.css`)

```css
:root {
  /* colour */
  --ink: #1E2A25;        --stone: #5E6B64;
  --neem: #1F4D3F;       --neem-deep: #143329;   --neem-soft: #DCE8E1;
  --copper: #A9502A;     --copper-deep: #8A3F1F; --copper-soft: #F4E1D6;
  --turmeric: #E0A526;   --turmeric-soft: #FBF0D2;
  --dusk: #3F3D6B;       --dusk-soft: #E6E5F1;
  --sesame: #FAF6EE;     --sandal: #F1E7D6;      --white: #FFFFFF;
  --line: #D9D0BF;       --success: #2E6B4A;     --error: #A32D2D;

  /* semantic */
  --bg: var(--sesame);          --bg-alt: var(--sandal);     --surface: var(--white);
  --text: var(--ink);           --text-muted: var(--stone);  --link: var(--neem);
  --action: var(--copper);      --action-hover: var(--copper-deep);
  --focus: var(--turmeric);     --border: var(--line);
  --accent: var(--neem);        --accent-tint: var(--neem-soft);   /* overridden per section */

  /* type */
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Figtree", system-ui, -apple-system, "Segoe UI", sans-serif;
  --fs-display: clamp(2.375rem, 1.6rem + 3.2vw, 3.75rem);
  --fs-h1: clamp(2rem, 1.5rem + 2vw, 2.875rem);
  --fs-h2: clamp(1.625rem, 1.4rem + 0.9vw, 2rem);
  --fs-h3: clamp(1.25rem, 1.2rem + 0.3vw, 1.375rem);
  --fs-lead: clamp(1.125rem, 1.08rem + 0.2vw, 1.25rem);
  --fs-body: 1.0625rem;  --fs-small: 0.875rem;  --fs-eyebrow: 0.8125rem;

  /* space, shape */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 24px;
  --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px; --s-10: 128px;
  --radius-control: 6px; --radius-card: 14px; --radius-pill: 999px;
  --radius-arch: 999px 999px 14px 14px;
  --shadow-float: 0 8px 24px rgba(30, 42, 37, 0.08);
  --content-max: 1200px; --measure: 68ch;
}

[data-section="therapies"], [data-section="massage"] { --accent: var(--copper-deep); --accent-tint: var(--copper-soft); }
[data-section="spiritual-healing"]                    { --accent: var(--dusk);        --accent-tint: var(--dusk-soft); }
```

Dark mode is not part of version 1. Tokens are semantic so it can be added later without
touching components.

## 13. Accessibility checklist for every template

- [ ] Text pairs come from §3.2 only
- [ ] One H1; headings in order
- [ ] Focus ring visible on every control
- [ ] Menu, accordion and forms work by keyboard alone
- [ ] Tap targets at least 44×44px
- [ ] Images have alt text; decorative drawings have empty alt
- [ ] Form fields have visible labels; errors are text, not colour alone
- [ ] Page is usable at 200% zoom and at 320px width
- [ ] Motion respects `prefers-reduced-motion`

## 14. Still to decide

| ID | Question |
| --- | --- |
| Q-09 | Does the owner approve this palette and type? (See the preview.) |
| Q-10 | Tagline choice |
| Q-11 | Is there an existing logo to keep, or is the wordmark new? |
| Q-12 | Photo shoot date, and whether the practitioner is comfortable with a portrait on the home page |
