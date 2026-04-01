import { Card } from "@/components/ui/card";
import { Lead } from "@/data/leads";
import { Progress } from "@/components/ui/progress";

interface ProductivityPanelProps {
  leads: Lead[];
}

export default function ProductivityPanel({ leads }: ProductivityPanelProps) {
  // Extract unique authors from all interactions
  const authorMap = new Map<string, { contatos: number; total: number }>();
  
  leads.forEach(l => {
    l.historico.forEach(h => {
      if (h.author) {
        const existing = authorMap.get(h.author) || { contatos: 0, total: 0 };
        existing.contatos += 1;
        existing.total += 1;
        authorMap.set(h.author, existing);
      }
    });
  });

  const authors = Array.from(authorMap.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.contatos - a.contatos);

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-sm mb-3">📊 Atividade por Pessoa</h3>
      {authors.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma interação registrada ainda. Ao registrar anotações nos leads, a atividade aparecerá aqui.</p>
      ) : (
        <div className="space-y-3">
          {authors.map(s => (
            <div key={s.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-[10px] text-muted-foreground">{s.contatos} interações</span>
              </div>
              <Progress value={Math.min((s.contatos / Math.max(...authors.map(a => a.contatos))) * 100, 100)} className="h-1.5" />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
