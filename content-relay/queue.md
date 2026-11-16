# Article queue — ayurvedachalam.com

The scheduled task takes the **first row whose Status is `Pending`**, writes it, and sets the
row to `Delivered <date>` once the relay Action has confirmed. Humans may reorder rows, add rows
at the bottom, or set a row to `Hold` or `Skipped` with a reason in the Status cell.

- **Mode** `auto` = may publish after the CMS hold · `review` = always needs a human (payload `needs_human: true`).
- **Source** `Map N` = slug, title and H1 are fixed by row N of the page map; `New` = the task may
  adjust the working title (≤ 60 characters) but not the slug.
- If a row's "Links to" page is not live yet, take the next Pending row and write `Swapped: <reason>` in this row's Status.
- Never more than one article per run, never more than three in a calendar week.

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

## Publishing log

| Date | Row | Slug | Relay status | Note |
| --- | --- | --- | --- | --- |
