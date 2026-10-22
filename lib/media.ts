import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { getDb } from "@/lib/db";

/* B-15 media library. Files live in MEDIA_DIR (outside the repo in production, backed up with the
   database); records in the `media` collection; served at /media/<file>. Alt text is required. */

// Statically scoped under <cwd>/data so the bundler's file tracing stays narrow; MEDIA_DIR may
// still point elsewhere in production (symlink data/media → /srv/media is the simplest way).
export const MEDIA_DIR = process.env.MEDIA_DIR ? path.resolve(process.env.MEDIA_DIR) : path.join(process.cwd(), "data", "media");
const MAX_BYTES = 12 * 1024 * 1024;
const MAX_WIDTH = 2000;

export interface MediaRecord { file: string; original_name: string; alt: string; credit?: string; width: number; height: number; bytes: number; mime: string; created_at: Date; uploaded_by: string }

const slug = (s: string) => s.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "image";

export async function saveUpload(file: File, alt: string, credit: string, by: string): Promise<MediaRecord> {
  if (!alt.trim()) throw new Error("Alt text is required");
  if (file.size > MAX_BYTES) throw new Error("File is larger than 12 MB");
  if (!/^image\/(jpeg|png|webp|avif|gif)$/.test(file.type)) throw new Error("Only JPEG, PNG, WebP, AVIF or GIF images");
  const input = Buffer.from(await file.arrayBuffer());
  const img = sharp(input, { animated: file.type === "image/gif" }).rotate();
  const meta = await img.metadata();
  const isGif = file.type === "image/gif";
  const out = isGif ? input : await img.resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  const outMeta = isGif ? meta : await sharp(out).metadata();
  const name = `${slug(file.name)}-${randomBytes(3).toString("hex")}.${isGif ? "gif" : "webp"}`;
  await fs.mkdir(MEDIA_DIR, { recursive: true });
  await fs.writeFile(path.join(MEDIA_DIR, name), out);
  const rec: MediaRecord = { file: name, original_name: file.name, alt: alt.trim(), credit: credit.trim() || undefined, width: outMeta.width ?? 0, height: outMeta.height ?? 0, bytes: out.length, mime: isGif ? "image/gif" : "image/webp", created_at: new Date(), uploaded_by: by };
  await (await getDb()).collection<MediaRecord>("media").insertOne(rec);
  return rec;
}

export async function listMedia(): Promise<MediaRecord[]> {
  return (await getDb()).collection<MediaRecord>("media").find().sort({ created_at: -1 }).limit(500).toArray();
}

export async function updateMedia(file: string, alt: string, credit: string): Promise<void> {
  if (!alt.trim()) throw new Error("Alt text is required");
  await (await getDb()).collection<MediaRecord>("media").updateOne({ file }, { $set: { alt: alt.trim(), credit: credit.trim() || undefined } });
}

export async function deleteMedia(file: string): Promise<void> {
  if (!/^[a-z0-9-]+\.(webp|gif)$/.test(file)) throw new Error("Bad file name");
  await (await getDb()).collection("media").deleteOne({ file });
  await fs.rm(path.join(MEDIA_DIR, file), { force: true });
}
