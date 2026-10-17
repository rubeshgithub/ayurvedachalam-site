import "server-only";
import { cookies } from "next/headers";
import { getDb, hasDb } from "@/lib/db";
import { makeSessionToken, readSessionToken, verifyPassword, verifyTotp } from "./auth-core";
export * from "./auth-core";

/* architecture.md §2, §10 — CMS auth: email + password (scrypt) + TOTP, signed HTTP-only
   session cookie, lockout after five failed attempts. Two or three users at most. */

export interface CmsUser {
  email: string;
  name: string;
  role: "owner" | "editor";
  password_hash: string;        // scrypt: salt:hash (hex)
  totp_secret: string;          // base32
  failed_attempts: number;
  locked_until: Date | null;
  created_at: Date;
}

const SESSION_COOKIE = "ayur_cms";
const SESSION_HOURS = 12;

export async function setSessionCookie(email: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, makeSessionToken(email), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_HOURS * 3600 });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export async function currentUser(): Promise<Pick<CmsUser, "email" | "name" | "role"> | null> {
  if (!hasDb()) return null;
  const jar = await cookies();
  const s = readSessionToken(jar.get(SESSION_COOKIE)?.value);
  if (!s) return null;
  const u = await (await getDb()).collection<CmsUser>("users").findOne({ email: s.email }, { projection: { email: 1, name: 1, role: 1 } });
  return u ? { email: u.email, name: u.name, role: u.role } : null;
}

/* ----------------------------------------------------------------- login */

export async function attemptLogin(email: string, password: string, code: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const users = (await getDb()).collection<CmsUser>("users");
  const u = await users.findOne({ email: email.toLowerCase().trim() });
  // Always do the work so timing does not reveal whether the user exists.
  const dummy = "00".repeat(16) + ":" + "00".repeat(64);
  const pwOk = verifyPassword(password, u?.password_hash ?? dummy);
  if (!u) return { ok: false, reason: "Invalid credentials" };
  if (u.locked_until && u.locked_until > new Date()) return { ok: false, reason: "Account locked for 15 minutes after repeated failures" };
  const totpOk = verifyTotp(u.totp_secret, code);
  if (!pwOk || !totpOk) {
    const failed = (u.failed_attempts ?? 0) + 1;
    await users.updateOne({ email: u.email }, { $set: { failed_attempts: failed, locked_until: failed >= 5 ? new Date(Date.now() + 15 * 60_000) : null } });
    return { ok: false, reason: "Invalid credentials" };
  }
  await users.updateOne({ email: u.email }, { $set: { failed_attempts: 0, locked_until: null, last_login: new Date() } });
  await setSessionCookie(u.email);
  return { ok: true };
}
