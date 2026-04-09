import { Lead, COMERCIAIS } from "@/data/leads";
import { Trophy, Medal, TrendingUp, Phone, AlertTriangle, Clock } from "lucide-react";
import { useMemo } from "react";

interface ComercialRankingProps {
  leads: Lead[];
}

interface ComercialStats {
  name: string;
  interacoes: number;
  leadsAtivos: number;
  fechados: number;
  reunioes: number;
  propostas: number;
  ultimaAcao: string | null;
  diasSemAcao: number;
}

function calcDiasSemAcao(leads: Lead[], name: string): { ultima: string | null; dias: number } {
  let latest: string | null = null;
  leads.forEach(l => {
    l.historico.forEach(h => {
      if (h.author === name && h.date) {
        if (!latest || h.date > latest) latest = h.date;
      }
    });
  });
  if (!latest) return { ultima: null, dias: 999 };
  const diff = Math.floor((Date.now() - new Date(latest).getTime()) / (1000 * 60 * 60 * 24));
  return { ultima: latest, dias: diff };
}

function InactivityBadge({ dias }: { dias: number }) {
  if (dias <= 1) return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Ativo hoje</span>;
  if (dias <= 3) return <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">{dias}d sem ação</span>;
  if (dias <= 7) return <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 flex items-center gap-0.5"><AlertTriangle className="h-2.5 w-2.5" />{dias}d sem ação</span>;
  return <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 flex items-center gap-0.5 animate-pulse"><AlertTriangle className="h-2.5 w-2.5" />{dias === 999 ? "Sem ações" : `${dias}d parado!`}</span>;
}

function BarChart({ stats }: { stats: ComercialStats[] }) {
  const maxVal = Math.max(...stats.map(s => s.interacoes), 1);
  const categories = [
    { key: "interacoes" as const, label: "Contatos", color: "bg-blue-500" },
    { key: "fechados" as const, label: "Fechados", color: "bg-emerald-500" },
    { key: "reunioes" as const, label: "Reuniões", color: "bg-purple-500" },
    { key: "propostas" as const, label: "Propostas", color: "bg-indigo-500" },
  ];

  return (
    <div className="space-y-3">
      {stats.map(s => (
        <div key={s.name} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-foreground">{s.name}</span>
            <span className="text-[10px] text-muted-foreground">{s.interacoes} total</span>
          </div>
          <div className="space-y-1">
            {categories.map(cat => {
              const val = s[cat.key];
              const pct = Math.max((val / maxVal) * 100, val > 0 ? 4 : 0);
              return (
                <div key={cat.key} className="flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground w-14 text-right">{cat.label}</span>
                  <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-foreground w-5 text-right">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex gap-3 justify-center pt-1">
        {categories.map(cat => (
          <div key={cat.key} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${cat.color}`} />
            <span className="text-[9px] text-muted-foreground">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComercialRanking({ leads }: ComercialRankingProps) {
  const stats: ComercialStats[] = useMemo(() => {
    return COMERCIAIS.map(name => {
      let interacoes = 0;
      let leadsAtivos = 0;
      let fechados = 0;
      let reunioes = 0;
      let propostas = 0;

      leads.forEach(l => {
        const hasInteraction = l.historico.some(h => h.author === name);
        const isResponsavel = l.responsavel === name;
        if (hasInteraction || isResponsavel) {
          leadsAtivos++;
          interacoes += l.historico.filter(h => h.author === name).length;
        }
        if ((hasInteraction || isResponsavel) && l.status === "fechado") fechados++;
        if ((hasInteraction || isResponsavel) && l.status === "reuniao_agendada") reunioes++;
        if ((hasInteraction || isResponsavel) && l.status === "proposta_enviada") propostas++;
      });

      const { ultima, dias } = calcDiasSemAcao(leads, name);
      return { name, interacoes, leadsAtivos, fechados, reunioes, propostas, ultimaAcao: ultima, diasSemAcao: dias };
    });
  }, [leads]);

  const sorted = [...stats].sort((a, b) => {
    if (b.fechados !== a.fechados) return b.fechados - a.fechados;
    if (b.reunioes !== a.reunioes) return b.reunioes - a.reunioes;
    return b.interacoes - a.interacoes;
  });

  const icons = [
    <Trophy key="1" className="h-4 w-4 text-yellow-400" />,
    <Medal key="2" className="h-4 w-4 text-gray-300" />,
    <Medal key="3" className="h-4 w-4 text-amber-600" />,
    <TrendingUp key="4" className="h-4 w-4 text-muted-foreground" />,
  ];

  return (
    <div className="p-4 bg-card border border-border rounded-lg space-y-4">
      <h3 className="font-semibold text-sm gold-text">🏆 Ranking Comercial</h3>

      {/* Ranking cards */}
      <div className="space-y-2">
        {sorted.map((s, i) => (
          <div key={s.name} className={`p-2.5 rounded-lg border ${i === 0 ? "border-yellow-500/30 bg-yellow-500/5" : "border-border/50 bg-muted/20"}`}>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted shrink-0">
                {icons[i]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{s.name}</span>
                  <span className="text-[10px] font-bold gold-text">#{i + 1}</span>
                </div>
                <div className="flex gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Phone className="h-2.5 w-2.5" />{s.interacoes}
                  </span>
                  <span className="text-[10px] text-emerald-400">{s.fechados} ✓</span>
                  <span className="text-[10px] text-purple-400">{s.reunioes} 📅</span>
                  <span className="text-[10px] text-indigo-400">{s.propostas} 📄</span>
                </div>
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <InactivityBadge dias={s.diasSemAcao} />
              {s.ultimaAcao && (
                <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5" />Último: {s.ultimaAcao}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico comparativo */}
      <div className="border-t border-border pt-3">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">📊 Evolução por Comercial</h4>
        <BarChart stats={sorted} />
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Atualiza em tempo real conforme interações são registradas
      </p>
    </div>
  );
}
