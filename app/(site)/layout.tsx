import { Header, Footer, MobileBar } from "@/components/shell";
import { getSettings } from "@/lib/content/repo";
import { JsonLd, businessLd, websiteLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Header settings={settings} />
      <main id="main" className="flex-1 has-mobile-bar">{children}</main>
      <Footer settings={settings} />
      <MobileBar settings={settings} />
      <JsonLd data={[businessLd(settings), websiteLd()]} />
    </>
  );
}
