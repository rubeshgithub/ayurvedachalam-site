import type { Metadata } from "next";
import { hasDb } from "@/lib/db";

export const metadata: Metadata = { title: "CMS — Ayurvedachalam", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function CmsRoot({ children }: { children: React.ReactNode }) {
  if (!hasDb()) {
    return <main className="container py-20 max-w-xl"><h1>CMS needs a database</h1><p className="lead mt-4">Set <code>MONGODB_URI</code>, run <code>npm run seed</code>, then create a user with <code>scripts/create-user.ts</code>.</p></main>;
  }
  return <div className="min-h-screen bg-sandal">{children}</div>;
}
