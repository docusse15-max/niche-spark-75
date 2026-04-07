import { useState, useEffect, useMemo } from "react";
import { format, parseISO, differenceInDays, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { getInitialLeads, Lead, COMERCIAIS } from "@/data/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Lock, BarChart3, Users, TrendingUp, Clock, Trophy, Medal,
  MapPin, CheckCircle2, XCircle, AlertTriangle, Flame, Eye,
  User, Target, Zap, Calendar, ArrowUp, ArrowDown
} from "lucide-react";

const PASSWORD = "56239050";

interface Visita {
  id: string;
  lead_id: string;
  lead_empresa: string;
  comercial: string;
  data_visita: string;
  duracao_min: number;
  status: string;
  notas: string | null;
  endereco: string | null;
}

export default function DashboardGestor() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Lock className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <CardTitle className="text-lg">Dashboard do Gestor</CardTitle>
            <p className="text-sm text-muted-foreground">Digite a senha para acessar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pw-gestor">Senha</Label>
              <Input
                id="pw-gestor"
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    if (passwordInput === PASSWORD) { setAuthenticated(true); setPasswordError(false); }
                    else setPasswordError(true);
                  }
                }}
                placeholder="••••••••"
                className={passwordError ? "border-destructive" : ""}
              />
              {passwordError && <p className="text-xs text-destructive mt-1">Senha incorreta</p>}
            </div>
            <Button className="w-full" onClick={() => {
              if (passwordInput === PASSWORD) { setAuthenticated(true); setPasswordError(false); }
              else setPasswordError(true);
            }}>Entrar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <GestorContent />;
}

function GestorContent() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [allVisitas, setAllVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const leads = useMemo(() => getInitialLeads(), []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

      const [todayRes, allRes] = await Promise.all([
        supabase.from("visitas").select("*").gte("data_visita", startOfDay).lte("data_visita", endOfDay),
        supabase.from("visitas").select("*").order("data_visita", { ascending: false }).limit(500),
      ]);

      if (todayRes.data) setVisitas(todayRes.data);
      if (allRes.data) setAllVisitas(allRes.data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // KPIs
  const totalHoje = visitas.length;
  const realizadasHoje = visitas.filter(v => v.status === "realizada").length;
  const taxaConversao = totalHoje > 0 ? Math.round((realizadasHoje / totalHoje) * 100) : 0;
  const tempoMedio = allVisitas.filter(v => v.duracao_min > 0).length > 0
    ? Math.round(allVisitas.filter(v => v.duracao_min > 0).reduce((a, v) => a + v.duracao_min, 0) / allVisitas.filter(v => v.duracao_min > 0).length)
    : 30;

  // Vendedor stats
  const vendedorStats = useMemo(() => {
    const stats: Record<string, { visitas: number; realizadas: number; totalMin: number; leadsSet: Set<string> }> = {};
    COMERCIAIS.forEach(c => { stats[c] = { visitas: 0, realizadas: 0, totalMin: 0, leadsSet: new Set() }; });
    allVisitas.forEach(v => {
      if (!stats[v.comercial]) stats[v.comercial] = { visitas: 0, realizadas: 0, totalMin: 0, leadsSet: new Set() };
      stats[v.comercial].visitas++;
      stats[v.comercial].leadsSet.add(v.lead_id);
      stats[v.comercial].totalMin += v.duracao_min;
      if (v.status === "realizada") stats[v.comercial].realizadas++;
    });
    return Object.entries(stats).map(([nome, s]) => ({
      nome,
      visitas: s.visitas,
      realizadas: s.realizadas,
      taxa: s.visitas > 0 ? Math.round((s.realizadas / s.visitas) * 100) : 0,
      tempoMedio: s.visitas > 0 ? Math.round(s.totalMin / s.visitas) : 0,
      leadsTrabalhados: s.leadsSet.size,
    })).sort((a, b) => b.realizadas - a.realizadas);
  }, [allVisitas]);

  // Today vendedor stats
  const vendedorHoje = useMemo(() => {
    const stats: Record<string, { visitas: number; realizadas: number }> = {};
    visitas.forEach(v => {
      if (!stats[v.comercial]) stats[v.comercial] = { visitas: 0, realizadas: 0 };
      stats[v.comercial].visitas++;
      if (v.status === "realizada") stats[v.comercial].realizadas++;
    });
    return Object.entries(stats).map(([nome, s]) => ({
      nome,
      visitas: s.visitas,
      realizadas: s.realizadas,
      taxa: s.visitas > 0 ? Math.round((s.realizadas / s.visitas) * 100) : 0,
    })).sort((a, b) => b.realizadas - a.realizadas);
  }, [visitas]);

  // Leads trabalhados vs não trabalhados
  const leadsComVisita = new Set(allVisitas.map(v => v.lead_id));
  const leadsTrabalhados = leadsComVisita.size;
  const leadsTotal = leads.length;
  const leadsNaoTrabalhados = leadsTotal - leadsTrabalhados;

  // Alertas
  const alertas = useMemo(() => {
    const alerts: { tipo: string; msg: string; icon: typeof Flame; cor: string }[] = [];

    // Leads quentes parados
    const leadsQuentes = leads.filter(l => l.temperatura === "quente");
    leadsQuentes.forEach(l => {
      const ultimaVisita = allVisitas.find(v => v.lead_id === l.id);
      if (!ultimaVisita) {
        alerts.push({ tipo: "quente", msg: `${l.empresa} — lead quente sem visita ⚠️`, icon: Flame, cor: "text-orange-500" });
      } else {
        const dias = differenceInDays(new Date(), parseISO(ultimaVisita.data_visita));
        if (dias >= 2) {
          alerts.push({ tipo: "quente", msg: `${l.empresa} — lead quente parado há ${dias} dias ⚠️`, icon: Flame, cor: "text-orange-500" });
        }
      }
    });

    // Vendedores sem atividade hoje
    const vendedoresHoje = new Set(visitas.map(v => v.comercial));
    COMERCIAIS.forEach(c => {
      if (!vendedoresHoje.has(c)) {
        alerts.push({ tipo: "vendedor", msg: `${c} — sem atividade hoje`, icon: AlertTriangle, cor: "text-amber-500" });
      }
    });

    // Leads não visitados há muito tempo
    leads.slice(0, 50).forEach(l => {
      if (l.status !== "fechado" && l.status !== "perdido") {
        const ultimaVisita = allVisitas.find(v => v.lead_id === l.id);
        if (!ultimaVisita) return;
        const dias = differenceInDays(new Date(), parseISO(ultimaVisita.data_visita));
        if (dias >= 7) {
          alerts.push({ tipo: "inativo", msg: `${l.empresa} — não visitado há ${dias} dias`, icon: Clock, cor: "text-muted-foreground" });
        }
      }
    });

    return alerts.slice(0, 15);
  }, [leads, allVisitas, visitas]);

  // Lead history
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const leadHistorico = useMemo(() => {
    if (!selectedLead) return [];
    return allVisitas.filter(v => v.lead_id === selectedLead || v.lead_empresa === selectedLead)
      .sort((a, b) => new Date(b.data_visita).getTime() - new Date(a.data_visita).getTime());
  }, [selectedLead, allVisitas]);

  // Rankings
  const rankMaisVisitas = [...vendedorStats].sort((a, b) => b.visitas - a.visitas);
  const rankMaisVendas = [...vendedorStats].sort((a, b) => b.realizadas - a.realizadas);
  const rankMelhorConversao = [...vendedorStats].filter(v => v.visitas >= 3).sort((a, b) => b.taxa - a.taxa);

  const META_VISITAS_DIA = 5;

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Carregando dashboard...</p></div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold">Dashboard do Gestor</h1>
        <span className="text-sm text-muted-foreground ml-2">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </span>
      </div>

      {/* Motivational banner */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-4 flex items-center gap-3">
        <Zap className="h-6 w-6 text-primary shrink-0" />
        <div>
          <p className="text-sm font-medium">
            {realizadasHoje >= META_VISITAS_DIA
              ? "🎉 Meta do dia batida! Continue assim!"
              : `Você está a ${META_VISITAS_DIA - realizadasHoje} visitas de bater a meta do dia 🔥`}
          </p>
          <p className="text-xs text-muted-foreground">Comece sua visita agora — cada check-in conta!</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{totalHoje}</p>
            <p className="text-xs text-muted-foreground">Visitas hoje</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
            <p className="text-2xl font-bold text-emerald-600">{realizadasHoje}</p>
            <p className="text-xs text-muted-foreground">Realizadas</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-amber-500 mb-1" />
            <p className="text-2xl font-bold text-amber-600">{taxaConversao}%</p>
            <p className="text-xs text-muted-foreground">Taxa de conversão</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold">{tempoMedio} min</p>
            <p className="text-xs text-muted-foreground">Tempo médio visita</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{leadsTrabalhados}</p>
            <p className="text-xs text-muted-foreground">Leads trabalhados</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads trabalhados vs não */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4" /> Leads Trabalhados vs Não Trabalhados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-600">Trabalhados: {leadsTrabalhados}</span>
                  <span>{Math.round((leadsTrabalhados / Math.max(leadsTotal, 1)) * 100)}%</span>
                </div>
                <Progress value={(leadsTrabalhados / Math.max(leadsTotal, 1)) * 100} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-500">Não trabalhados: {leadsNaoTrabalhados}</span>
                  <span>{Math.round((leadsNaoTrabalhados / Math.max(leadsTotal, 1)) * 100)}%</span>
                </div>
                <Progress value={(leadsNaoTrabalhados / Math.max(leadsTotal, 1)) * 100} className="h-3 [&>div]:bg-red-500" />
              </div>
              <p className="text-[11px] text-muted-foreground">Total: {leadsTotal} leads</p>
            </div>
          </CardContent>
        </Card>

        {/* Visitas por vendedor HOJE */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4" /> Visitas por Vendedor — Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {vendedorHoje.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma visita hoje ainda.</p>
            ) : (
              <div className="space-y-2">
                {vendedorHoje.map((v, i) => (
                  <div key={v.nome} className="flex items-center gap-2">
                    <span className="text-xs w-5 text-muted-foreground">{i + 1}.</span>
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium flex-1 truncate">{v.nome}</span>
                    <Badge variant="outline" className="text-[10px] h-5">{v.realizadas}/{v.visitas}</Badge>
                    <span className="text-xs text-muted-foreground w-10 text-right">{v.taxa}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Ranking / Produtividade / Alertas / Histórico */}
      <Tabs defaultValue="ranking" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="ranking" className="text-xs">🏆 Ranking</TabsTrigger>
          <TabsTrigger value="produtividade" className="text-xs">📊 Produtividade</TabsTrigger>
          <TabsTrigger value="alertas" className="text-xs">⚠️ Alertas ({alertas.length})</TabsTrigger>
          <TabsTrigger value="historico" className="text-xs">📋 Histórico</TabsTrigger>
        </TabsList>

        {/* RANKING */}
        <TabsContent value="ranking">
          <div className="grid md:grid-cols-3 gap-4">
            <RankingCard title="🥇 Mais Visitas" data={rankMaisVisitas} valueKey="visitas" suffix=" visitas" />
            <RankingCard title="🥇 Mais Vendas" data={rankMaisVendas} valueKey="realizadas" suffix=" realizadas" />
            <RankingCard title="🥇 Melhor Conversão" data={rankMelhorConversao} valueKey="taxa" suffix="%" />
          </div>
        </TabsContent>

        {/* PRODUTIVIDADE */}
        <TabsContent value="produtividade">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Produtividade por Vendedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendedor</TableHead>
                      <TableHead className="text-center">Visitas</TableHead>
                      <TableHead className="text-center">Realizadas</TableHead>
                      <TableHead className="text-center">Taxa</TableHead>
                      <TableHead className="text-center">Tempo Médio</TableHead>
                      <TableHead className="text-center">Leads</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendedorStats.map((v, i) => (
                      <TableRow key={v.nome}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {i < 3 && <Medal className={`h-4 w-4 ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : "text-orange-600"}`} />}
                            <span className="text-sm">{v.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm">{v.visitas}</TableCell>
                        <TableCell className="text-center text-sm text-emerald-600 font-medium">{v.realizadas}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={v.taxa >= 70 ? "default" : v.taxa >= 40 ? "secondary" : "outline"}
                            className="text-[10px]">{v.taxa}%</Badge>
                        </TableCell>
                        <TableCell className="text-center text-sm">{v.tempoMedio} min</TableCell>
                        <TableCell className="text-center text-sm">{v.leadsTrabalhados}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALERTAS */}
        <TabsContent value="alertas">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Alertas Automáticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alertas.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum alerta no momento! 🎉</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {alertas.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-md border border-border bg-muted/20">
                        <a.icon className={`h-4 w-4 mt-0.5 shrink-0 ${a.cor}`} />
                        <p className="text-xs">{a.msg}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTÓRICO DO LEAD */}
        <TabsContent value="historico">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" /> Histórico Completo do Lead
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label className="text-xs">Selecione um lead para ver o histórico</Label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedLead || ""}
                  onChange={e => setSelectedLead(e.target.value || null)}
                >
                  <option value="">Selecione...</option>
                  {leads.slice(0, 50).map(l => (
                    <option key={l.id} value={l.id}>{l.empresa} — {l.bairro}</option>
                  ))}
                </select>
              </div>

              {selectedLead && leadHistorico.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma visita registrada para este lead.</p>
              )}

              {leadHistorico.length > 0 && (
                <div className="space-y-2">
                  {leadHistorico.map(v => (
                    <div key={v.id} className="flex items-start gap-3 p-3 rounded-md border border-border">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium">{format(parseISO(v.data_visita), "dd/MM/yyyy HH:mm")}</span>
                          <Badge variant="outline" className="text-[10px] h-4">{v.status}</Badge>
                          <span className="text-[10px] text-muted-foreground">por {v.comercial}</span>
                        </div>
                        {v.notas && <p className="text-xs text-muted-foreground mt-1">{v.notas}</p>}
                        <p className="text-[10px] text-muted-foreground">{v.duracao_min} min • {v.endereco || "sem endereço"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Ranking card component
function RankingCard({ title, data, valueKey, suffix }: {
  title: string;
  data: Array<{ nome: string; [key: string]: any }>;
  valueKey: string;
  suffix: string;
}) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.slice(0, 5).map((v, i) => (
            <div key={v.nome} className={`flex items-center gap-2 p-2 rounded-md ${i < 3 ? "bg-muted/30" : ""}`}>
              <span className="text-sm w-6">{medals[i] || `${i + 1}.`}</span>
              <span className="text-xs font-medium flex-1 truncate">{v.nome}</span>
              <span className="text-xs font-bold">{v[valueKey]}{suffix}</span>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">Sem dados ainda</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
