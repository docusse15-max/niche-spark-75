import { useMemo } from "react";
import { getInitialLeads, Lead, COMERCIAIS, STATUS_LABELS, type LeadStatus } from "@/data/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Medal, TrendingUp, Phone, Calendar, FileText, CheckCircle2,
  AlertTriangle, Clock, Users, Target, Flame, Snowflake, Sun, BarChart3
} from "lucide-react";

interface ComercialDetail {
  name: string;
  interacoes: number;
  leadsAtivos: number;
  leadsTotal: number;
  fechados: number;
  perdidos: number;
  reunioes: number;
  propostas: number;
  emNegociacao: number;
  quentes: number;
  mornos: number;
  frios: number;
  ultimaAcao: string | null;
  diasSemAcao: number;
  taxaConversao: number;
  leadsPorStatus: Record<string, number>;
  nichos: Record<string, number>;
}

function calcStats(leads: Lead[], name: string, activityLogs: ActivityLogEntry[]): ComercialDetail {
  let interacoes = 0, leadsAtivos = 0, fechados = 0, perdidos = 0, reunioes = 0, propostas = 0, emNegociacao = 0;
  let quentes = 0, mornos = 0, frios = 0;
  const leadsPorStatus: Record<string, number> = {};
  const nichos: Record<string, number> = {};
  let latestDate: string | null = null;
  const nameLower = name.toLowerCase().trim();

  leads.forEach(l => {
    const isResponsavel = l.responsavel?.toLowerCase().trim() === nameLower;
    const hasInteraction = l.historico.some(h => h.author?.toLowerCase().trim() === nameLower);
    if (!isResponsavel && !hasInteraction) return;

    leadsAtivos++;
    interacoes += l.historico.filter(h => h.author?.toLowerCase().trim() === nameLower).length;

    leadsPorStatus[l.status] = (leadsPorStatus[l.status] || 0) + 1;
    nichos[l.segmento] = (nichos[l.segmento] || 0) + 1;

    if (l.status === "fechado") fechados++;
    if (l.status === "perdido") perdidos++;
    if (l.status === "reuniao_agendada") reunioes++;
    if (l.status === "proposta_enviada") propostas++;
    if (l.status === "em_negociacao") emNegociacao++;
    if (l.temperatura === "quente") quentes++;
    if (l.temperatura === "morno") mornos++;
    if (l.temperatura === "frio") frios++;

    l.historico.forEach(h => {
      if (h.author?.toLowerCase().trim() === nameLower && h.date && (!latestDate || h.date > latestDate)) latestDate = h.date;
    });
  });

  // Count activity logs (leads created, notes, status changes) for this person
  const logsDoComercial = activityLogs.filter(log => log.author.toLowerCase().trim() === nameLower);
  const leadsCriados = logsDoComercial.filter(log => log.action === "lead_criado").length;
  const notasAdicionadas = logsDoComercial.filter(log => log.action === "nota_adicionada").length;
  const statusAlterados = logsDoComercial.filter(log => log.action === "status_alterado").length;
  
  // Add activity log actions to interacoes count (avoid double-counting historico notes)
  interacoes = Math.max(interacoes, leadsCriados + notasAdicionadas + statusAlterados);

  // Update latestDate from activity logs
  logsDoComercial.forEach(log => {
    const logDate = log.timestamp.split("T")[0];
    if (!latestDate || logDate > latestDate) latestDate = logDate;
  });

  const dias = latestDate ? Math.floor((Date.now() - new Date(latestDate).getTime()) / 86400000) : 999;
  const taxaConversao = leadsAtivos > 0 ? (fechados / leadsAtivos) * 100 : 0;

  return {
    name, interacoes, leadsAtivos, leadsTotal: leads.length, fechados, perdidos, reunioes,
    propostas, emNegociacao, quentes, mornos, frios, ultimaAcao: latestDate,
    diasSemAcao: dias, taxaConversao, leadsPorStatus, nichos,
  };
}

function StatusBadge({ dias }: { dias: number }) {
  if (dias <= 1) return <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">🟢 Ativo hoje</Badge>;
  if (dias <= 3) return <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-[10px]">🟡 {dias}d sem ação</Badge>;
  if (dias <= 7) return <Badge className="bg-orange-500/20 text-orange-400 border-0 text-[10px]">🟠 {dias}d sem ação</Badge>;
  return <Badge className="bg-red-500/20 text-red-400 border-0 text-[10px] animate-pulse">🔴 {dias === 999 ? "Sem ações" : `${dias}d parado!`}</Badge>;
}

function StatCard({ icon, label, value, color = "text-foreground" }: { icon: React.ReactNode; label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
      {icon}
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 4 : 0) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-24 text-right truncate">{label}</span>
      <div className="flex-1 h-4 bg-muted/30 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-foreground w-6 text-right">{value}</span>
    </div>
  );
}

export default function ComercialEvolution() {
  const leads = useMemo(() => getInitialLeads(), []);

  const allStats = useMemo(() =>
    COMERCIAIS.map(name => calcStats(leads, name))
      .sort((a, b) => {
        if (b.fechados !== a.fechados) return b.fechados - a.fechados;
        if (b.reunioes !== a.reunioes) return b.reunioes - a.reunioes;
        return b.interacoes - a.interacoes;
      }),
    [leads]
  );

  const totalLeads = leads.length;
  const totalInteracoes = allStats.reduce((s, c) => s + c.interacoes, 0);
  const totalFechados = allStats.reduce((s, c) => s + c.fechados, 0);
  const totalReuni = allStats.reduce((s, c) => s + c.reunioes, 0);

  const rankIcons = [
    <Trophy key="1" className="h-5 w-5 text-yellow-400" />,
    <Medal key="2" className="h-5 w-5 text-gray-300" />,
    <Medal key="3" className="h-5 w-5 text-amber-600" />,
    <TrendingUp key="4" className="h-5 w-5 text-muted-foreground" />,
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" /> Evolução Comercial
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe quem está trabalhando e a performance de cada comercial</p>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{allStats.length}</p>
              <p className="text-xs text-muted-foreground">Comerciais</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Phone className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{totalInteracoes}</p>
              <p className="text-xs text-muted-foreground">Interações totais</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold">{totalFechados}</p>
              <p className="text-xs text-muted-foreground">Fechados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{totalReuni}</p>
              <p className="text-xs text-muted-foreground">Reuniões</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allStats.map((s, i) => (
          <Card key={s.name} className={i === 0 ? "border-yellow-500/30 ring-1 ring-yellow-500/20" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {rankIcons[i]}
                  <span className="text-base">{s.name}</span>
                  <span className="text-xs text-muted-foreground font-normal">#{i + 1}</span>
                </div>
                <StatusBadge dias={s.diasSemAcao} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2">
                <StatCard icon={<Phone className="h-4 w-4 text-blue-500" />} label="Interações" value={s.interacoes} />
                <StatCard icon={<Target className="h-4 w-4 text-amber-500" />} label="Leads ativos" value={s.leadsAtivos} />
                <StatCard icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} label="Fechados" value={s.fechados} color="text-emerald-500" />
              </div>

              {/* Conversion rate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">Taxa de conversão</span>
                  <span className="text-xs font-bold text-primary">{s.taxaConversao.toFixed(1)}%</span>
                </div>
                <Progress value={s.taxaConversao} className="h-2" />
              </div>

              {/* Temperature distribution */}
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded">
                  <Flame className="h-3 w-3" /> {s.quentes} quentes
                </div>
                <div className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded">
                  <Sun className="h-3 w-3" /> {s.mornos} mornos
                </div>
                <div className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                  <Snowflake className="h-3 w-3" /> {s.frios} frios
                </div>
              </div>

              {/* Funnel */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" /> Funil de Vendas
                </p>
                <FunnelBar label="Em negociação" value={s.emNegociacao} max={s.leadsAtivos} color="bg-cyan-500" />
                <FunnelBar label="Propostas" value={s.propostas} max={s.leadsAtivos} color="bg-indigo-500" />
                <FunnelBar label="Reuniões" value={s.reunioes} max={s.leadsAtivos} color="bg-purple-500" />
                <FunnelBar label="Fechados" value={s.fechados} max={s.leadsAtivos} color="bg-emerald-500" />
                <FunnelBar label="Perdidos" value={s.perdidos} max={s.leadsAtivos} color="bg-red-500" />
              </div>

              {/* Top nichos */}
              {Object.keys(s.nichos).length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground mb-1">Nichos trabalhados</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(s.nichos)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([nicho, count]) => (
                        <Badge key={nicho} variant="outline" className="text-[10px]">
                          {nicho} ({count})
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {/* Last action */}
              {s.ultimaAcao && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Última ação: {new Date(s.ultimaAcao).toLocaleDateString("pt-BR")}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparative chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Comparativo Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allStats.map(s => {
              const maxInteracoes = Math.max(...allStats.map(a => a.interacoes), 1);
              return (
                <div key={s.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{s.name}</span>
                    <span className="text-xs text-muted-foreground">{s.interacoes} interações</span>
                  </div>
                  <div className="flex gap-0.5 h-6 rounded overflow-hidden">
                    {[
                      { val: s.fechados, color: "bg-emerald-500", label: "Fechados" },
                      { val: s.reunioes, color: "bg-purple-500", label: "Reuniões" },
                      { val: s.propostas, color: "bg-indigo-500", label: "Propostas" },
                      { val: s.emNegociacao, color: "bg-cyan-500", label: "Em negociação" },
                      { val: Math.max(s.interacoes - s.fechados - s.reunioes - s.propostas - s.emNegociacao, 0), color: "bg-muted-foreground/30", label: "Outros" },
                    ].map((seg, si) => {
                      const pct = (seg.val / maxInteracoes) * 100;
                      if (pct <= 0) return null;
                      return <div key={si} className={`${seg.color} h-full transition-all duration-700`} style={{ width: `${pct}%` }} title={`${seg.label}: ${seg.val}`} />;
                    })}
                  </div>
                </div>
              );
            })}
            <div className="flex gap-4 justify-center pt-2">
              {[
                { color: "bg-emerald-500", label: "Fechados" },
                { color: "bg-purple-500", label: "Reuniões" },
                { color: "bg-indigo-500", label: "Propostas" },
                { color: "bg-cyan-500", label: "Negociação" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                  <span className="text-[10px] text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
