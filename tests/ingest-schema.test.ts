import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { Payload } from "../lib/ingest-schema";

const example = JSON.parse(fs.readFileSync(path.join(process.cwd(), "tests", "fixtures", "payload-schema-1.json"), "utf8"));

test("relay example payload matches schema 1 (with a full-length body)", () => {
  const r = Payload.safeParse({ ...example, body_md: "## Heading\n\n" + "Warm oil, slowly. ".repeat(120) });
  assert.equal(r.success, true, r.success ? "" : JSON.stringify(r.error.issues));
});
test("bad slug and short body are rejected", () => {
  assert.equal(Payload.safeParse({ ...example, slug: "/learn/x/" }).success, false);
  assert.equal(Payload.safeParse(example).success, false); // example body is a placeholder, too short
});
