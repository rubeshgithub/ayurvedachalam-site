/**
 * B-23 — template checks against a running server (rules.md R7):
 * exactly one H1, a title ≤ 60 (warn above), a meta description, a self canonical, JSON-LD that
 * parses, the skip link, and the R1.5 disclaimer on service/concern/article pages.
 *
 *   BASE=http://localhost:3000 npx tsx scripts/check-pages.ts
 */
const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const PAGES = ["/", "/therapies/", "/therapies/shirodhara/", "/therapies/kati-vasti/", "/consultations/", "/consultations/online-ayurvedic-consultation-canada/", "/spiritual-healing/", "/about/practitioner/", "/pricing/", "/book/", "/contact/", "/learn/", "/learn/is-ayurveda-regulated-in-canada/", "/privacy-policy/"];
const NEEDS_DISCLAIMER = /^\/(therapies|consultations|spiritual-healing|concerns)\/[^/]+\/$|^\/learn\/[^/]+\/$/;

let failures = 0;
const fail = (p: string, msg: string) => { failures++; console.log(`✗ ${p}: ${msg}`); };

async function check(p: string) {
  const res = await fetch(BASE + p, { headers: { accept: "text/html" } });
  if (res.status !== 200) return fail(p, `HTTP ${res.status}`);
  const html = await res.text();
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(p, `${h1} H1 elements`);
  const title = (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").replace(/&amp;/g, "&");
  if (!title) fail(p, "no <title>");
  else if (title.length > 60) console.log(`⚠ ${p}: title ${title.length} chars`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(p, "no meta description");
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canon) fail(p, "no canonical");
  else if (!canon.endsWith(p)) fail(p, `canonical ${canon} does not match`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(p, "JSON-LD does not parse"); }
  }
  if (!/class="skip-link"/.test(html)) fail(p, "no skip link");
  if (NEEDS_DISCLAIMER.test(p) && !/complementary practices/.test(html)) fail(p, "R1.5 disclaimer missing");
  if (/\bDr\.\s+(Maheswari|Vedhachalam)/.test(html)) fail(p, "\"Dr.\" before the practitioner's name");
  const lang = html.match(/<html[^>]*lang="([^"]+)"/)?.[1];
  if (lang !== "en-CA") fail(p, `lang=${lang}`);
}

(async () => {
  for (const p of PAGES) { const before = failures; await check(p); if (failures === before) console.log(`✓ ${p}`); }
  for (const p of ["/sitemap.xml", "/robots.txt", "/feed.xml"]) { const r = await fetch(BASE + p); if (r.status !== 200) fail(p, `HTTP ${r.status}`); else console.log(`✓ ${p}`); }
  const nf = await fetch(BASE + "/this-page-does-not-exist/"); if (nf.status !== 404) fail("/this-page-does-not-exist/", `expected 404, got ${nf.status}`);
  console.log(failures ? `\n${failures} failure(s)` : "\nAll page checks passed");
  process.exit(failures ? 1 : 0);
})();
