import { getDb } from "@/lib/db";
import type { Settings } from "@/lib/types";
import { saveSettings } from "@/app/cms/actions";
import { Field, Flash } from "@/app/cms/_ui/Status";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const sp = await searchParams;
  const s = (await (await getDb()).collection<Settings & { prices?: unknown }>("settings").findOne({})) as (Settings & { prices?: unknown }) | null;
  if (!s) return <p>No settings document yet. Run <code>npm run seed</code>.</p>;
  return (
    <form action={saveSettings} className="max-w-3xl space-y-8">
      <h1>Settings</h1>
      <Flash saved={sp.saved} error={sp.error} />
      <div className="card p-6 space-y-5"><h2 className="text-[20px]">Brand</h2><Field label="Site name" name="site_name" value={s.site_name} /><Field label="Descriptor line" name="descriptor" value={s.descriptor} /><Field label="Tagline" name="tagline" value={s.tagline} /></div>
      <div className="card p-6 space-y-5">
        <h2 className="text-[20px]">Name, address, phone (NAP) — must match Google Business Profile exactly</h2>
        <label className="flex gap-2 text-[15px]"><input type="checkbox" name="nap_placeholder" defaultChecked={s.nap.placeholder} /> Address is still a placeholder (hides street and phone, shows “opening soon”)</label>
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Business name" name="nap_name" value={s.nap.name} /><Field label="Street" name="nap_street" value={s.nap.street} /><Field label="City" name="nap_city" value={s.nap.city} /><Field label="Province" name="nap_region" value={s.nap.region} /><Field label="Postal code" name="nap_postal" value={s.nap.postal} /><Field label="Phone" name="nap_phone" value={s.nap.phone} /><Field label="Email" name="nap_email" value={s.nap.email} /></div>
        <Field label="Hours (one per line: Day | open | close)" name="hours" value={s.hours.map((h) => `${h.day} | ${h.open} | ${h.close}`).join("\n")} rows={4} />
      </div>
      <div className="card p-6 space-y-5"><h2 className="text-[20px]">Booking</h2><Field label="Booking URL (all Book buttons)" name="booking_url" value={s.booking_url} /><Field label="Booking embed URL (optional, shown on /book/)" name="booking_embed_url" value={s.booking_embed_url} /></div>
      <div className="card p-6 space-y-5">
        <h2 className="text-[20px]">Article pipeline</h2>
        <div><label className="label" htmlFor="publish_mode">Publish mode</label><select className="field" id="publish_mode" name="publish_mode" defaultValue={s.publish_mode}><option value="review">review — nothing goes live until a human publishes</option><option value="timed">timed — lands as scheduled, live after the hold unless rejected</option><option value="immediate">immediate — live on ingest if the linter passes (not recommended)</option></select></div>
        <Field label="Hold hours (timed mode)" name="hold_hours" value={s.hold_hours} type="number" />
      </div>
      <div className="card p-6 space-y-5">
        <h2 className="text-[20px]">Required notices (rules.md R1.5)</h2>
        <Field label="Complementary-practice disclaimer" name="n_complementary" value={s.notices.complementary} rows={3} /><Field label="Spiritual healing" name="n_spiritual" value={s.notices.spiritual} rows={2} /><Field label="Crisis line" name="n_crisis" value={s.notices.crisis} rows={2} /><Field label="NPN" name="n_npn" value={s.notices.npn} rows={2} /><Field label="Insurance" name="n_insurance" value={s.notices.insurance} rows={3} /><Field label="Contact form" name="n_contact_form" value={s.notices.contact_form} rows={2} />
      </div>
      <div className="card p-6 space-y-5"><h2 className="text-[20px]">Prices</h2><Field label="GST note" name="prices_gst_note" value={s.prices_gst_note} /><Field label="Price book (JSON; same shape as content/seed/prices.json; blank keeps the seed file)" name="prices" value={s.prices ? JSON.stringify(s.prices, null, 2) : ""} rows={14} /></div>
      <button className="btn btn-primary" type="submit">Save settings</button>
    </form>
  );
}
