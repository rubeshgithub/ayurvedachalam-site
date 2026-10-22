import "server-only";
import nodemailer from "nodemailer";

/**
 * Owner notifications (B-25). Uses SMTP from SMTP_URL (e.g. smtps://user:pass@smtp.example.com:465).
 * Without SMTP_URL the message is logged, so development and CI never send mail.
 * Never include health details in a notification: only names, slugs and links.
 */
export async function notifyOwner(subject: string, text: string, html?: string): Promise<void> {
  const to = process.env.CONTACT_TO;
  const from = process.env.MAIL_FROM || "Ayurvedachalam <no-reply@ayurvedachalam.com>";
  const url = process.env.SMTP_URL;
  if (!url || !to) { console.log(`[notify] ${subject}\n${text}`); return; }
  try {
    const transport = nodemailer.createTransport(url);
    await transport.sendMail({ from, to, subject: `[Ayurvedachalam] ${subject}`, text, html });
  } catch (e) {
    console.error("[notify] send failed:", e instanceof Error ? e.message : e);
  }
}

export function previewLink(path: string): string {
  const base = (process.env.SITE_URL || "https://ayurvedachalam.com").replace(/\/$/, "");
  return `${base}/api/cms/preview?to=${encodeURIComponent(path)}`;
}
