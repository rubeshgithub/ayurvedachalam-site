import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";

/** Logged-in CMS users can preview drafts: enables Next draft mode, then opens the page. */
export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) redirect("/cms/login/");
  const to = req.nextUrl.searchParams.get("to") || "/";
  if (req.nextUrl.searchParams.get("off") === "1") { (await draftMode()).disable(); redirect("/cms/"); }
  if (!to.startsWith("/") || to.startsWith("//")) redirect("/cms/");
  (await draftMode()).enable();
  redirect(to);
}
