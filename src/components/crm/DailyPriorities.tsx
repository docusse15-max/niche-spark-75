import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lead, STATUS_COLORS, STATUS_LABELS } from "@/data/leads";
import { AlertTriangle, Flame, Clock, Zap } from "lucide-react";

interface DailyPrioritiesProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export default function DailyPriorities({ leads, onSelectLead }: DailyPrioritiesProps) {
  const premiumSemContato = leads.filter(l => l.potencial === "premium" && ["novo", "sem_contato"].includes(l.status));
  const quentesSemRetorno = leads.filter(l => l.temperatura === "quente" && ["primeiro_contato", "em_conversa"].includes(l.status));
  const propostasSemFollowup = leads.filter(l => l.status === "proposta_enviada");
  const travados = leads.filter(l => l.status === "em_negociacao");

  const sections = [
    { title: "Premium sem contato", icon: Zap, color: "text-yellow-600", items: premiumSemContato },
    { title: "Quentes sem retorno", icon: Flame, color: "text-red-500", items: quentesSemRetorno },
    { title: "Propostas sem follow-up", icon: Clock, color: "text-indigo-600", items: propostasSemFollowup },
    { title: "Negociações travadas", icon: AlertTriangle, color: "text-orange-500", items: travados },
  ];

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-sm mb-3">🎯 Prioridades do Dia</h3>
      <div className="space-y-3">
        {sections.map(s => (
          <div key={s.title}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs font-semibold">{s.title}</span>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5">{s.items.length}</Badge>
            </div>
            {s.items.length === 0 ? (
              <p className="text-xs text-muted-foreground pl-5">✅ Tudo em dia</p>
            ) : (
              <div className="space-y-1 pl-5">
                {s.items.slice(0, 3).map(l => (
                  <button key={l.id} onClick={() => onSelectLead(l)} className="text-left w-full text-xs hover:bg-muted/50 rounded p-1 transition-colors">
                    <span className="font-medium">{l.empresa}</span>
                    <span className="text-muted-foreground ml-1">· {l.bairro}</span>
                  </button>
                ))}
                {s.items.length > 3 && <p className="text-[10px] text-muted-foreground">+{s.items.length - 3} mais</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
