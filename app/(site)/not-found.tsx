import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="container py-24 max-w-2xl">
      <p className="eyebrow mb-3">Page not found</p>
      <h1>We could not find that page.</h1>
      <p className="lead mt-5">It may have moved. These are the three places most people are looking for.</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        <li><Link href="/consultations/" className="card block p-5 no-underline font-semibold text-ink">Consultations →</Link></li>
        <li><Link href="/therapies/" className="card block p-5 no-underline font-semibold text-ink">Therapies →</Link></li>
        <li><Link href="/spiritual-healing/" className="card block p-5 no-underline font-semibold text-ink">Spiritual healing →</Link></li>
      </ul>
      <div className="mt-10"><Button href="/">Back to the home page</Button></div>
    </div>
  );
}
