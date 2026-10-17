import { type NextRequest } from "next/server";
import { z } from "zod";
import { getDb, hasDb } from "@/lib/db";
import { back, formRateLimited, honeypotTripped, notifyOwner } from "@/lib/forms";

export const runtime = "nodejs";

// architecture.md §8: name, email, phone, message, consent. No health fields are accepted or stored.
const Lead = z.object({ name: z.string().min(2).max(120), email: z.string().email().max(200), phone: z.string().max(40).optional().or(z.literal("")), message: z.string().min(5).max(3000), consent: z.literal("yes") });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (formRateLimited(ip)) return back("/contact/", "error", req);
  const fd = await req.formData();
  if (honeypotTripped(fd)) return back("/contact/", "ok", req);
  const parsed = Lead.safeParse({ name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone") ?? "", message: fd.get("message"), consent: fd.get("consent") });
  if (!parsed.success) return back("/contact/", "error", req);
  const lead = { ...parsed.data, consent: true, created_at: new Date(), ip_hash: undefined };
  if (hasDb()) await (await getDb()).collection("leads").insertOne(lead);
  await notifyOwner(`New enquiry from ${lead.name}`, `${lead.email} ${lead.phone || ""}\n\n${lead.message}`);
  return back("/contact/", "ok", req);
}
