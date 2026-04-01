import { SALES_ARGUMENTS } from "@/data/leads";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SalesArguments() {
  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <h3 className="font-semibold text-sm mb-3 gold-text">💬 Argumentos de Venda</h3>
      <Accordion type="multiple" className="space-y-0">
        {SALES_ARGUMENTS.map((a, i) => (
          <AccordionItem key={i} value={`arg-${i}`} className="border-b-0 border-border">
            <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline text-foreground hover:text-primary">{a.title}</AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground pb-2">{a.text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
