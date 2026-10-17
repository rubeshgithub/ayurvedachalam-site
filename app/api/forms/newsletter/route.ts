import { type NextRequest } from "next/server";
import { z } from "zod";
import { getDb, hasDb } from "@/lib/db";
import { back, formRateLimited, honeypotTripped } from "@/lib/forms";

export const runtime = "nodejs";

// CASL: store the exact consent wording shown, when, and where (rules.md R6).
export const CONSENT_TEXT = "Yes, send me Ayurvedachalam’s monthly email. I can unsubscribe at any time.";
const Sub = z.object({ email: z.string().email().max(200), consent: z.literal("yes"), source: z.string().max(200).default("/learn/") });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const fd = await req.formData();
  const source = String(fd.get("source") || "/learn/");
  if (formRateLimited(ip)) return back(source, "error", req);
  if (honeypotTripped(fd)) return back(source, "ok", req);
  const parsed = Sub.safeParse({ email: fd.get("email"), consent: fd.get("consent"), source });
  if (!parsed.success) return back(source, "error", req);
  if (hasDb()) {
    await (await getDb()).collection("subscribers").updateOne(
      { email: parsed.data.email.toLowerCase() },
      { $setOnInsert: { email: parsed.data.email.toLowerCase(), consent_at: new Date(), consent_text: CONSENT_TEXT, source: parsed.data.source, unsubscribed_at: null } },
      { upsert: true },
    );
  }
  return back(source, "ok", req);
}
