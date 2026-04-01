import { Card } from "@/components/ui/card";
import { SALES_ARGUMENTS } from "@/data/leads";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SalesArguments() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-sm mb-3">💬 Argumentos de Venda</h3>
      <Accordion type="multiple" className="space-y-0">
        {SALES_ARGUMENTS.map((a, i) => (
          <AccordionItem key={i} value={`arg-${i}`} className="border-b-0">
            <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">{a.title}</AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground pb-2">{a.text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
