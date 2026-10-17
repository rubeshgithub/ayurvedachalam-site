import { getDb } from "@/lib/db";
import { addRedirect, deleteRedirect } from "@/app/cms/actions";
import { Field, Flash } from "@/app/cms/_ui/Status";

export default async function Redirects({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const sp = await searchParams;
  const rs = await (await getDb()).collection<{ from: string; to: string; code: number }>("redirects").find().sort({ from: 1 }).toArray();
  return (
    <div className="max-w-3xl space-y-8">
      <h1>Redirects</h1>
      <Flash saved={sp.saved} error={sp.error} />
      <form action={addRedirect} className="card p-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] items-end"><Field label="From" name="from" /><Field label="To" name="to" /><button className="btn btn-primary">Add 301</button></form>
      <table className="price-table bg-white card text-[14px]"><thead><tr><th>From</th><th>To</th><th></th></tr></thead><tbody>{rs.map((r) => <tr key={r.from}><td>{r.from}</td><td>{r.to}</td><td><form action={deleteRedirect}><input type="hidden" name="from" value={r.from} /><button className="small underline">delete</button></form></td></tr>)}{!rs.length && <tr><td colSpan={3} className="text-stone">No redirects yet. A slug never changes after publication; add a redirect here if it must.</td></tr>}</tbody></table>
    </div>
  );
}
