import { listMedia } from "@/lib/media";
import { deleteMediaAction, updateMediaAction, uploadMedia } from "@/app/cms/actions";
import { Field, Flash } from "@/app/cms/_ui/Status";

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const sp = await searchParams;
  const items = await listMedia();
  return (
    <div className="space-y-8">
      <h1>Media <span className="small">({items.length})</span></h1>
      <Flash saved={sp.saved} error={sp.error} />
      <form action={uploadMedia} encType="multipart/form-data" className="card p-6 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] items-end">
        <div><label className="label" htmlFor="file">Image (JPEG, PNG, WebP, AVIF, GIF; up to 12 MB; resized to 2000 px and saved as WebP)</label><input className="field" id="file" name="file" type="file" accept="image/*" required /></div>
        <Field label="Alt text (required: what the image shows, for people who cannot see it)" name="alt" required />
        <Field label="Credit (optional)" name="credit" />
        <button className="btn btn-primary">Upload</button>
      </form>
      <p className="small">Use descriptive file names before uploading (they become the URL), e.g. <code>shirodhara-copper-vessel.jpg</code>. Reference an image in a page or article as <code>/media/&lt;file&gt;</code>.</p>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <div key={m.file} className="card overflow-hidden">
            <img src={`/media/${m.file}`} alt={m.alt} width={m.width} height={m.height} className="w-full aspect-[4/3] object-cover bg-sandal" loading="lazy" />
            <form action={updateMediaAction} className="p-4 space-y-3 text-[14px]">
              <input type="hidden" name="file" value={m.file} />
              <p className="font-mono text-[12px] break-all">/media/{m.file} <span className="text-stone">· {m.width}×{m.height} · {Math.round(m.bytes / 1024)} KB</span></p>
              <Field label="Alt text" name="alt" value={m.alt} required />
              <Field label="Credit" name="credit" value={m.credit} />
              <div className="flex justify-between"><button className="btn btn-secondary !min-h-0 !py-2 !px-3 text-[13px]">Save</button><button className="small underline text-error" formAction={deleteMediaAction}>delete</button></div>
            </form>
          </div>
        ))}
        {!items.length && <p className="text-stone">No images yet.</p>}
      </div>
    </div>
  );
}
