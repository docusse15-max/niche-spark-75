import { Card } from "@/components/ui/card";
import { Lead, RESPONSAVEIS } from "@/data/leads";
import { Progress } from "@/components/ui/progress";

interface ProductivityPanelProps {
  leads: Lead[];
}

export default function ProductivityPanel({ leads }: ProductivityPanelProps) {
  const stats = RESPONSAVEIS.map(r => {
    const myLeads = leads.filter(l => l.responsavel === r);
    return {
      name: r,
      total: myLeads.length,
      contatos: myLeads.filter(l => !["novo", "sem_contato"].includes(l.status)).length,
      reunioes: myLeads.filter(l => ["reuniao_agendada"].includes(l.status)).length,
      propostas: myLeads.filter(l => ["proposta_enviada", "em_negociacao"].includes(l.status)).length,
      fechados: myLeads.filter(l => l.status === "fechado").length,
    };
  });

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-sm mb-3">📊 Produtividade Comercial</h3>
      <div className="space-y-3">
        {stats.map(s => (
          <div key={s.name} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{s.name}</span>
              <span className="text-[10px] text-muted-foreground">{s.total} leads</span>
            </div>
            <Progress value={s.total > 0 ? (s.contatos / s.total) * 100 : 0} className="h-1.5" />
            <div className="flex gap-3 text-[10px] text-muted-foreground">
              <span>📞 {s.contatos}</span>
              <span>📅 {s.reunioes}</span>
              <span>📄 {s.propostas}</span>
              <span>🏆 {s.fechados}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
