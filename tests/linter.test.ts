import { test } from "node:test";
import assert from "node:assert/strict";
import { lint, touchesLegalCheck } from "../lib/compliance/linter";

const base = { title_tag: "Shirodhara in Calgary: What to Expect", meta_description: "What Shirodhara is, how a 60-minute session runs in Calgary, who it suits and who should avoid it.", h1: "Shirodhara in Calgary: what to expect", primary_keyword: "shirodhara calgary", author_id: "practitioner", faqs: [{ q: "a?", a: "b" }, { q: "c?", a: "d" }, { q: "e?", a: "f" }], sources: [{ title: "x", url: "https://example.org" }], internal_links: ["/therapies/shirodhara/", "/book/"], hero_image: { src: "/x.jpg" } };
const body = (extra: string) => `${"In Ayurveda, Shirodhara is warm oil poured over the forehead. ".repeat(120)} ${extra}`;

test("clean article passes", () => {
  const r = lint({ ...base, body_md: body("") }, { kind: "article", linkResolves: () => true });
  assert.equal(r.passed, true, r.errors.join("; "));
});
test("cure claim fails", () => {
  const r = lint({ ...base, body_md: body("Shirodhara cures migraine.") }, { kind: "article", linkResolves: () => true });
  assert.equal(r.passed, false);
  assert.ok(r.errors.some((e) => /cure/.test(e)));
});
test("Dr. before the practitioner fails", () => {
  const r = lint({ ...base, body_md: body("Book with Dr. Vedhachalam today.") }, { kind: "article", linkResolves: () => true });
  assert.ok(r.errors.some((e) => /Dr\./.test(e)));
});
test("disease treatment claim fails but safety sentence passes", () => {
  const bad = lint({ ...base, body_md: body("Kati Vasti treats arthritis.") }, { kind: "article", linkResolves: () => true });
  assert.ok(bad.errors.some((e) => /Disease claim|treat/.test(e)));
  const ok = lint({ ...base, body_md: body("If you have diabetes, tell us before a foot massage.") }, { kind: "article", linkResolves: () => true });
  assert.ok(!ok.errors.some((e) => /Disease claim/.test(e)));
});
test("title length and missing sources are errors", () => {
  const r = lint({ ...base, title_tag: "x".repeat(61), sources: [], body_md: body("It costs $130.") }, { kind: "article", linkResolves: () => true });
  assert.ok(r.errors.some((e) => /Title tag/.test(e)));
  assert.ok(r.errors.some((e) => /sources/.test(e)));
});
test("duplicate keyword and dead link are errors", () => {
  const r = lint({ ...base, body_md: body("") }, { kind: "article", linkResolves: (h) => h === "/book/", existingKeywords: new Map([["shirodhara calgary", "/therapies/shirodhara/"]]) });
  assert.ok(r.errors.some((e) => /already used/.test(e)));
  assert.ok(r.errors.some((e) => /does not resolve/.test(e)));
});
test("allowlist lets quoted legal words through", () => {
  const r = lint({ ...base, body_md: body("The law bans the word cure."), linter_allow: ["cure"] }, { kind: "article", linkResolves: () => true });
  assert.ok(!r.errors.some((e) => /cure/.test(e)));
});
test("legal-check slugs force review", () => {
  assert.equal(touchesLegalCheck("/learn/x/", ["/therapies/panchakarma/"]), true);
  assert.equal(touchesLegalCheck("/learn/x/", ["/therapies/shirodhara/"]), false);
});
