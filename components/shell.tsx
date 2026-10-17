import Link from "next/link";
import type { Settings } from "@/lib/types";
import { Button, Wordmark } from "./ui";

/* design.md §8 — top bar, header with section panels, mobile sheet, sticky mobile bar, footer.
   The mobile menu is a <details> element so it works with no JavaScript. */

const NAV = [
  {
    label: "Consultations", href: "/consultations/", section: "consultations",
    items: [
      { label: "Online consultation (Canada)", href: "/consultations/online-ayurvedic-consultation-canada/" },
      { label: "In-person consultation (Calgary)", href: "/consultations/ayurvedic-consultation-calgary/" },
      { label: "Nadi Pariksha (pulse reading)", href: "/consultations/nadi-pariksha-pulse-reading/" },
      { label: "Diet and nutrition", href: "/consultations/ayurvedic-diet-consultation/" },
    ],
  },
  {
    label: "Therapies", href: "/therapies/", section: "therapies",
    items: [
      { label: "Abhyanga (warm oil massage)", href: "/therapies/abhyanga/" },
      { label: "Shirodhara", href: "/therapies/shirodhara/" },
      { label: "Kati Vasti (lower back)", href: "/therapies/kati-vasti/" },
      { label: "Janu Vasti (knees)", href: "/therapies/janu-vasti/" },
      { label: "Panchakarma program", href: "/therapies/panchakarma/" },
    ],
  },
  {
    label: "Spiritual healing", href: "/spiritual-healing/", section: "spiritual-healing",
    items: [
      { label: "Energy healing session", href: "/spiritual-healing/energy-healing-session/" },
      { label: "Distance healing", href: "/spiritual-healing/distance-healing/" },
    ],
  },
  { label: "Concerns", href: "/concerns/", section: "concerns", items: [] },
  { label: "Learn", href: "/learn/", section: "learn", items: [] },
  { label: "About", href: "/about/", section: "core", items: [{ label: "The practitioner", href: "/about/practitioner/" }, { label: "Prices", href: "/pricing/" }, { label: "Your first visit", href: "/first-visit/" }, { label: "Contact", href: "/contact/" }] },
];

export function Header({ settings }: { settings: Settings }) {
  return (
    <header className="bg-sesame/95 backdrop-blur border-b border-line sticky top-0 z-30">
      <div className="bg-neem-deep text-white text-[13px]">
        <div className="container flex justify-between items-center h-8">
          <span className="truncate">{settings.descriptor}</span>
          <span className="hidden sm:inline">
            {settings.nap.placeholder ? "Virtual appointments now · Calgary clinic opening soon" : <a href={`tel:${settings.nap.phone}`} className="text-white no-underline" data-event="phone_click">{settings.nap.phone}</a>}
          </span>
        </div>
      </div>
      <div className="container flex items-center justify-between gap-6 h-[72px]">
        <Link href="/" className="no-underline flex flex-col leading-none" aria-label="Ayurvedachalam home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href} className="relative group" data-section={n.section}>
                <Link href={n.href} className="no-underline whitespace-nowrap px-3 py-2 rounded-md text-[15px] font-medium text-ink hover:bg-sandal">{n.label}</Link>
                {n.items.length > 0 && (
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block group-focus-within:block">
                    <ul className="card p-3 min-w-[280px]">
                      <li><Link href={n.href} className="block px-3 py-2 rounded-md no-underline font-semibold text-accent hover:bg-sandal">All {n.label.toLowerCase()} →</Link></li>
                      {n.items.map((it) => <li key={it.href}><Link href={it.href} className="block px-3 py-2 rounded-md no-underline text-[15px] text-ink hover:bg-sandal">{it.label}</Link></li>)}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <Button href="/book/#discovery" variant="ghost">Free 15-min call</Button>
          <Button href="/book/" data-event="book_click">Book an appointment</Button>
        </div>
        <details className="lg:hidden relative">
          <summary className="list-none cursor-pointer px-3 py-2 rounded-md border border-line bg-white text-[15px] font-medium" aria-label="Open menu">Menu</summary>
          <nav aria-label="Mobile" className="absolute right-0 top-full mt-2 card p-4 w-[min(92vw,360px)] max-h-[70vh] overflow-auto">
            <ul className="space-y-1">
              {NAV.map((n) => (
                <li key={n.href} data-section={n.section}>
                  <Link href={n.href} className="block px-2 py-2 font-semibold no-underline text-ink">{n.label}</Link>
                  {n.items.map((it) => <Link key={it.href} href={it.href} className="block pl-5 pr-2 py-1.5 text-[15px] no-underline text-stone">{it.label}</Link>)}
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function MobileBar({ settings }: { settings: Settings }) {
  return (
    <div className="mobile-bar" role="region" aria-label="Quick actions">
      <Button href="/book/" className="flex-1" data-event="book_click">Book</Button>
      {settings.nap.placeholder
        ? <Button href="/book/#discovery" variant="secondary" className="flex-1">Free call</Button>
        : <Button href={`tel:${settings.nap.phone}`} variant="secondary" className="flex-1" data-event="phone_click">Call</Button>}
    </div>
  );
}

export function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-neem-deep text-white mt-auto">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Wordmark dark />
          <p className="small text-white/70 mt-3">{settings.descriptor}</p>
          <p className="mt-4 text-[15px] text-white/85">{settings.tagline}</p>
        </div>
        <div>
          <h4 className="text-white mb-3">Services</h4>
          <ul className="space-y-2 text-[15px]">
            <li><Link href="/consultations/" className="text-white/85 no-underline hover:text-white">Consultations</Link></li>
            <li><Link href="/therapies/" className="text-white/85 no-underline hover:text-white">Therapies</Link></li>
            <li><Link href="/spiritual-healing/" className="text-white/85 no-underline hover:text-white">Spiritual healing</Link></li>
            <li><Link href="/concerns/" className="text-white/85 no-underline hover:text-white">Wellness concerns</Link></li>
            <li><Link href="/pricing/" className="text-white/85 no-underline hover:text-white">Prices</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white mb-3">Practice</h4>
          <ul className="space-y-2 text-[15px]">
            <li><Link href="/about/practitioner/" className="text-white/85 no-underline hover:text-white">The practitioner</Link></li>
            <li><Link href="/first-visit/" className="text-white/85 no-underline hover:text-white">Your first visit</Link></li>
            <li><Link href="/learn/" className="text-white/85 no-underline hover:text-white">Learn</Link></li>
            <li><Link href="/contact/" className="text-white/85 no-underline hover:text-white">Contact</Link></li>
            <li><Link href="/book/" className="text-white/85 no-underline hover:text-white">Book</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white mb-3">Calgary</h4>
          <address className="not-italic text-[15px] text-white/85 space-y-1">
            <p>{settings.nap.name}</p>
            <p>{settings.nap.placeholder ? "Clinic address to be announced" : settings.nap.street}</p>
            <p>{settings.nap.city}, {settings.nap.region}{settings.nap.postal ? ` ${settings.nap.postal}` : ""}</p>
            <p><a href={`mailto:${settings.nap.email}`} className="text-white/85">{settings.nap.email}</a></p>
          </address>
          <p className="small text-white/60 mt-4">Virtual consultations across Canada.</p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between small text-white/60">
          <p>© {year} Ayurvedachalam. Ayurveda Practitioner: Maheswari Vedhachalam, BAMS. Ayurveda is not a regulated health profession in Canada.</p>
          <ul className="flex flex-wrap gap-4">
            <li><Link href="/health-disclaimer/" className="text-white/70">Health disclaimer</Link></li>
            <li><Link href="/privacy-policy/" className="text-white/70">Privacy</Link></li>
            <li><Link href="/terms/" className="text-white/70">Terms</Link></li>
            <li><Link href="/cancellation-policy/" className="text-white/70">Cancellation</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
