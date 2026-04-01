import { Lead, COMERCIAIS } from "@/data/leads";
import { Trophy, Medal, TrendingUp, Phone } from "lucide-react";

interface ComercialRankingProps {
  leads: Lead[];
}

interface ComercialStats {
  name: string;
  interacoes: number;
  leadsAtivos: number;
  fechados: number;
  reunioes: number;
}

export default function ComercialRanking({ leads }: ComercialRankingProps) {
  const stats: ComercialStats[] = COMERCIAIS.map(name => {
    let interacoes = 0;
    let leadsAtivos = 0;
    let fechados = 0;
    let reunioes = 0;

    leads.forEach(l => {
      const hasInteraction = l.historico.some(h => h.author === name);
      if (hasInteraction) {
        leadsAtivos++;
        interacoes += l.historico.filter(h => h.author === name).length;
      }
      if (l.historico.some(h => h.author === name) && l.status === "fechado") fechados++;
      if (l.historico.some(h => h.author === name) && l.status === "reuniao_agendada") reunioes++;
    });

    return { name, interacoes, leadsAtivos, fechados, reunioes };
  });

  const sorted = [...stats].sort((a, b) => {
    if (b.fechados !== a.fechados) return b.fechados - a.fechados;
    if (b.reunioes !== a.reunioes) return b.reunioes - a.reunioes;
    return b.interacoes - a.interacoes;
  });

  const icons = [
    <Trophy className="h-4 w-4 text-yellow-400" />,
    <Medal className="h-4 w-4 text-gray-300" />,
    <Medal className="h-4 w-4 text-amber-600" />,
    <TrendingUp className="h-4 w-4 text-muted-foreground" />,
  ];

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <h3 className="font-semibold text-sm mb-3 gold-text">🏆 Ranking Comercial</h3>
      <div className="space-y-3">
        {sorted.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3 p-2 rounded-md bg-muted/30 border border-border/50">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted shrink-0">
              {icons[i]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{s.name}</span>
                <span className="text-[10px] font-bold gold-text">#{i + 1}</span>
              </div>
              <div className="flex gap-3 mt-1">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Phone className="h-2.5 w-2.5" />{s.interacoes} contatos
                </span>
                <span className="text-[10px] text-muted-foreground">{s.leadsAtivos} leads</span>
                <span className="text-[10px] text-green-400">{s.fechados} fechados</span>
                <span className="text-[10px] text-purple-400">{s.reunioes} reuniões</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 text-center">
        Ranking atualiza conforme interações são registradas nos leads
      </p>
    </div>
  );
}
