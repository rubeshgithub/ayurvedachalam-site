/**
 * Create or reset a CMS user. Prints the TOTP secret ONCE; add it to an authenticator app.
 *
 *   MONGODB_URI=… SESSION_SECRET=… npx tsx scripts/create-user.ts owner@example.com "Full Name" owner
 *
 * The password is read from the CMS_PASSWORD environment variable or prompted on stdin so it
 * never appears in shell history. Never commit or paste secrets into the docs (rules.md R7).
 */
import { createInterface } from "node:readline/promises";
import { getDb, ensureIndexes } from "../lib/db";
import { hashPassword, newTotpSecret, otpauthUrl } from "../lib/auth-core";

async function main() {
  const [email, name = "Owner", role = "owner"] = process.argv.slice(2);
  if (!email || !/@/.test(email)) { console.error("usage: create-user.ts <email> [name] [owner|editor]"); process.exit(1); }
  let password = process.env.CMS_PASSWORD || "";
  if (!password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    password = await rl.question("Password (12+ characters): ");
    rl.close();
  }
  if (password.length < 12) { console.error("Password must be at least 12 characters"); process.exit(1); }
  const db = await getDb();
  await ensureIndexes();
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  const secret = newTotpSecret();
  await db.collection("users").updateOne(
    { email: email.toLowerCase() },
    { $set: { email: email.toLowerCase(), name, role: role === "editor" ? "editor" : "owner", password_hash: hashPassword(password), totp_secret: secret, failed_attempts: 0, locked_until: null }, $setOnInsert: { created_at: new Date() } },
    { upsert: true },
  );
  console.log(`\nUser ${email} (${role}) saved.\nTOTP secret (enter in Google Authenticator / 1Password; shown once):\n  ${secret}\n  ${otpauthUrl(email, secret)}\n`);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
