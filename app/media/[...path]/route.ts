import fs from "node:fs/promises";
import path from "node:path";
import { type NextRequest } from "next/server";
import { MEDIA_DIR } from "@/lib/media";

export const runtime = "nodejs";

/** Serves uploaded media from MEDIA_DIR with long cache headers (file names are unique per upload). */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  const name = parts.join("/");
  if (!/^[a-z0-9-]+\.(webp|gif)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(MEDIA_DIR, name));
    return new Response(buf, { headers: { "content-type": name.endsWith(".gif") ? "image/gif" : "image/webp", "cache-control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
