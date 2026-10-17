import type { Metadata } from "next";
import { Button, Card, CardGrid, CtaBand, Eyebrow, FaqList, Notice, PriceTable, Section, Steps } from "@/components/ui";

export const metadata: Metadata = { title: "Styleguide — Ayurvedachalam", description: "Component library (design.md §10).", robots: { index: false, follow: false } };

const swatches = ["ink", "stone", "neem", "neem-deep", "neem-soft", "copper", "copper-deep", "copper-soft", "turmeric", "turmeric-soft", "dusk", "dusk-soft", "sesame", "sandal", "line"];

export default function Styleguide() {
  return (
    <>
      <div className="container py-12">
        <Eyebrow className="mb-3">design.md §10</Eyebrow>
        <h1>Styleguide</h1>
        <p className="lead mt-4 measure">Tokens, type and components as rendered. Not indexed.</p>
        <h2 className="mt-14 mb-6">Colour</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">{swatches.map((s) => <div key={s} className="card p-3"><div className="h-14 rounded-md" style={{ background: `var(--${s})` }} /><p className="small mt-2">--{s}</p></div>)}</div>
        <h2 className="mt-14 mb-6">Type</h2>
        <p className="display">Display 60/38 Fraunces</p>
        <h1 className="mt-4">H1 46/32 Fraunces 500</h1>
        <h2 className="mt-4">H2 32/26 Fraunces 500</h2>
        <h3 className="mt-4">H3 22/20 Fraunces 600</h3>
        <h4 className="mt-4">H4 18 Figtree 600</h4>
        <p className="lead mt-4">Lead 20/18 Figtree, Stone.</p>
        <p className="mt-4 measure">Body 17 Figtree 400. Sanskrit terms are set in the body face, not italic, with the gloss in brackets on first use: Abhyanga (warm oil massage).</p>
        <p className="small mt-4">Small / meta 14 Figtree 500 Stone</p>
        <p className="eyebrow mt-4">Eyebrow 13 uppercase</p>
        <h2 className="mt-14 mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-3"><Button href="#">Primary</Button><Button href="#" variant="secondary">Secondary</Button><Button href="#" variant="ghost">Ghost</Button></div>
        <h2 className="mt-14 mb-6">Notices</h2>
        <div className="space-y-3 measure"><Notice>Neem notice — the default disclaimer slot.</Notice><Notice tone="copper">Copper notice — who should avoid this.</Notice><Notice tone="turmeric">Turmeric notice — good to know.</Notice></div>
        <h2 className="mt-14 mb-6">Cards by section</h2>
        <CardGrid>
          <div data-section="consultations"><Card href="#" eyebrow="Consultations" title="Online consultation" text="Neem accent." price="$135" meta="75 min" /></div>
          <div data-section="therapies"><Card href="#" eyebrow="Therapies" title="Shirodhara" text="Copper accent." price="$130" meta="60 min" /></div>
          <div data-section="spiritual-healing"><Card href="#" eyebrow="Spiritual healing" title="Energy healing" text="Dusk accent." price="$90" meta="60 min" /></div>
        </CardGrid>
        <h2 className="mt-14 mb-8">Steps</h2>
        <Steps items={[{ title: "Call", text: "Fifteen minutes, free." }, { title: "Consult", text: "Seventy-five minutes." }, { title: "Therapies", text: "Singly or as a package." }]} />
        <h2 className="mt-14 mb-6">Price table</h2>
        <PriceTable rows={[{ service: "Abhyanga", detail: "60 min", price: "$120" }, { service: "Shirodhara", detail: "60 min", price: "$130" }]} />
        <h2 className="mt-14 mb-6">FAQ</h2>
        <FaqList heading={null} items={[{ q: "Does this work without JavaScript?", a: "Yes. The accordion is a native details element." }, { q: "Is the focus ring visible?", a: "Copper, 3px, offset 3px." }]} />
      </div>
      <Section tone="dusk"><p className="eyebrow !text-turmeric mb-2">Spiritual healing band</p><h2 className="text-white">Dusk section with white text (10.0:1)</h2></Section>
      <CtaBand heading="CTA band" text="Deep neem with white and copper-free buttons." primary={{ label: "Primary", href: "#" }} secondary={{ label: "Secondary", href: "#" }} />
    </>
  );
}
