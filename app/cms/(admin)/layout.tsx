import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { logout } from "../actions";

const NAV = [["/cms/", "Overview"], ["/cms/pages/", "Pages"], ["/cms/articles/", "Articles"], ["/cms/settings/", "Settings"], ["/cms/redirects/", "Redirects"]];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/cms/login/");
  return (
    <>
      <header className="bg-neem-deep text-white">
        <div className="container flex items-center justify-between h-14 gap-6">
          <div className="flex items-center gap-6">
            <Link href="/cms/" className="text-white no-underline font-display text-[20px]">Ayurvedachalam <span className="small text-white/60">CMS</span></Link>
            <nav className="flex gap-1 text-[14px]">{NAV.map(([h, l]) => <Link key={h} href={h} className="text-white/85 no-underline px-3 py-1.5 rounded hover:bg-white/10">{l}</Link>)}</nav>
          </div>
          <div className="flex items-center gap-4 text-[14px]"><a href="/api/cms/preview?to=/" className="text-white/70">Preview site ↗</a><span className="text-white/70">{user.name} · {user.role}</span><form action={logout}><button className="text-white/85 underline">Log out</button></form></div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </>
  );
}
