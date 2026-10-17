import { test } from "node:test";
import assert from "node:assert/strict";
process.env.SESSION_SECRET = "test-secret-at-least-16-chars";
import * as auth from "../lib/auth-core";

test("password hash verifies and rejects", () => {
  const h = auth.hashPassword("correct horse battery staple");
  assert.equal(auth.verifyPassword("correct horse battery staple", h), true);
  assert.equal(auth.verifyPassword("wrong", h), false);
});
test("TOTP matches RFC 6238 test vectors (SHA-1)", () => {
  const secret = auth.base32Encode(Buffer.from("12345678901234567890"));
  assert.equal(secret, "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ");
  assert.equal(auth.hotp(secret, Math.floor(59 / 30)), "287082");
  assert.equal(auth.hotp(secret, Math.floor(1111111109 / 30)), "081804");
  assert.equal(auth.hotp(secret, Math.floor(1234567890 / 30)), "005924");
});
test("verifyTotp accepts the current code and rejects garbage", () => {
  const secret = auth.newTotpSecret();
  const now = auth.hotp(secret, Math.floor(Date.now() / 30_000));
  assert.equal(auth.verifyTotp(secret, now), true);
  assert.equal(auth.verifyTotp(secret, "000000") && auth.verifyTotp(secret, "999999"), false);
  assert.equal(auth.verifyTotp(secret, "12ab56"), false);
});
test("session token round-trips and rejects tampering", () => {
  const t = auth.makeSessionToken("owner@example.com");
  assert.equal(auth.readSessionToken(t)?.email, "owner@example.com");
  assert.equal(auth.readSessionToken(t.slice(0, -2) + "xx"), null);
  assert.equal(auth.readSessionToken(undefined), null);
});
