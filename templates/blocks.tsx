import { renderMarkdown } from "@/lib/markdown";
import type { Block } from "@/lib/types";
import { Button, Card, CardGrid, Eyebrow, FaqList, Notice, PriceTable, Steps } from "@/components/ui";

/** Renders a page's `blocks[]` (architecture.md §6.1). Each block type maps to one component. */
export function Blocks({ blocks }: { blocks: Block[] | undefined }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((b, i) => (
        <div key={i} className="mt-12 first:mt-0">
          <BlockView block={b} />
        </div>
      ))}
    </>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "intro":
      return <p className="lead measure">{block.data.lead}</p>;
    case "richtext":
      return <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.data.md) }} />;
    case "cards":
      return (
        <div>
          {block.data.heading && <h2 className="mb-6">{block.data.heading}</h2>}
          <CardGrid>{block.data.items.map((it) => <Card key={it.href} {...it} />)}</CardGrid>
        </div>
      );
    case "steps":
      return (
        <div>
          {block.data.heading && <h2 className="mb-8">{block.data.heading}</h2>}
          <Steps items={block.data.items} />
        </div>
      );
    case "list": {
      const tone = block.data.tone ?? "neutral";
      return (
        <div className={tone === "avoid" ? "notice notice-copper" : ""}>
          <h2 className="mb-4 text-[22px]">{block.data.heading}</h2>
          <ul className="list-disc pl-6 space-y-1.5 measure">{block.data.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      );
    }
    case "notice":
      return <Notice tone={block.data.tone}>{block.data.text}</Notice>;
    case "pricing":
      return (
        <div>
          {block.data.heading && <h2 className="mb-4">{block.data.heading}</h2>}
          <PriceTable rows={block.data.rows} />
        </div>
      );
    case "faq":
      return <FaqList items={block.data.items} />;
    case "cta":
      return (
        <div className="card p-8 text-center">
          <Eyebrow className="mb-3">Next step</Eyebrow>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={block.data.href} data-event="book_click">{block.data.label}</Button>
            {block.data.secondary && <Button href={block.data.secondary.href} variant="secondary">{block.data.secondary.label}</Button>}
          </div>
        </div>
      );
    default:
      return null;
  }
}
