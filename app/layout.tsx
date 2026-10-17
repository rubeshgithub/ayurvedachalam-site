import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/figtree";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Ayurvedachalam — Ayurveda in Calgary and online", template: "%s" },
  description: "Authentic Ayurveda from a BAMS-trained practitioner: consultations online across Canada, therapies and spiritual healing in Calgary.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className="h-full">
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
