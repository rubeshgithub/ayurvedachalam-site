export function Status({ s }: { s: string }) {
  const c: Record<string, string> = { published: "bg-neem-soft text-neem", scheduled: "bg-turmeric-soft", review: "bg-copper-soft text-copper-deep", draft: "bg-sandal", rejected: "bg-copper-soft", archived: "bg-line" };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${c[s] ?? "bg-sandal"}`}>{s}</span>;
}

export function Flash({ saved, error }: { saved?: string; error?: string }) {
  if (error) return <p className="notice notice-copper mb-6 text-[14px]">{error}</p>;
  if (saved) return <p className="notice mb-6 text-[14px]">Saved.</p>;
  return null;
}

export function Field({ label, name, value, hint, type = "text", rows, required, max }: { label: string; name: string; value?: string | number | null; hint?: string; type?: string; rows?: number; required?: boolean; max?: number }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}{max ? <span className="small font-normal"> · max {max}</span> : null}</label>
      {rows ? <textarea className="field font-mono text-[14px]" id={name} name={name} rows={rows} defaultValue={value ?? ""} required={required} /> : <input className="field" id={name} name={name} type={type} defaultValue={value ?? ""} required={required} maxLength={max} />}
      {hint && <p className="small mt-1">{hint}</p>}
    </div>
  );
}
