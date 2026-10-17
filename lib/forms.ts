import { NextResponse } from "next/server";

const buckets = new Map<string, { n: number; reset: number }>();
export function formRateLimited(ip: string, limit = 5): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) { buckets.set(ip, { n: 1, reset: now + 3600_000 }); return false; }
  return ++b.n > limit;
}

export const honeypotTripped = (fd: FormData) => String(fd.get("website") || "").length > 0;

export function back(path: string, status: "ok" | "error", req: Request) {
  const url = new URL(path, req.url);
  url.searchParams.set("form", status);
  return NextResponse.redirect(url, 303);
}

/** Transactional email is wired later (MAIL_API_KEY). Until then, notices go to the server log. */
export async function notifyOwner(subject: string, body: string) {
  if (!process.env.MAIL_API_KEY) { console.log(`[notify] ${subject}\n${body}`); return; }
  // TODO B-25: provider call (Resend/Postmark/SES) using MAIL_FROM and CONTACT_TO.
}
