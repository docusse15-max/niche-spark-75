import { useState, useMemo, useEffect } from "react";
import { format, addDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getInitialLeads, Lead, COMERCIAIS, SALES_ARGUMENTS, SCRIPTS } from "@/data/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Lock, Mail, Send, Calendar, MapPin, User, Copy,
  Building2, Phone, Plus, X, Eye, Route, Flame,
  Clock, Target, Navigation, ArrowRight, Zap
} from "lucide-react";

const PASSWORD = "56239050";

interface AgendaItem {
  lead: Lead;
  horario: string;
  prioridade: "alta" | "media" | "baixa";
  motivo: string;
  dicaAbordagem: string;
}

function agruparPorBairro(items: AgendaItem[]): Record<string, AgendaItem[]> {
  const groups: Record<string, AgendaItem[]> = {};
  items.forEach(item => {
    const key = `${item.lead.bairro} - ${item.lead.cidade}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

function gerarAgendaSugerida(leads: Lead[], comercial: string): AgendaItem[] {
  const leadsDoComercial = leads.filter(l => l.responsavel === comercial);

  const prioritarios = leadsDoComercial
    .filter(l => !["fechado", "perdido"].includes(l.status))
    .sort((a, b) => {
      const tempScore = { quente: 3, morno: 2, frio: 1 };
      const potScore = { premium: 4, alto: 3, medio: 2, baixo: 1 };
      const statusScore: Record<string, number> = {
        reuniao_agendada: 5, proposta_enviada: 4, em_negociacao: 4,
        em_conversa: 3, primeiro_contato: 2, novo: 2, sem_contato: 1,
      };
      const scoreA = tempScore[a.temperatura] * 3 + potScore[a.potencial] * 2 + (statusScore[a.status] || 0);
      const scoreB = tempScore[b.temperatura] * 3 + potScore[b.potencial] * 2 + (statusScore[b.status] || 0);
      return scoreB - scoreA;
    })
    .slice(0, 10);

  // Reorder by proximity (group by bairro for route optimization)
  const byBairro = new Map<string, typeof prioritarios>();
  prioritarios.forEach(l => {
    const key = l.bairro;
    if (!byBairro.has(key)) byBairro.set(key, []);
    byBairro.get(key)!.push(l);
  });
  const reordered = Array.from(byBairro.values()).flat();

  const horarios = ["08:00", "08:45", "09:30", "10:15", "11:00", "13:30", "14:15", "15:00", "15:45", "16:30"];

  return reordered.map((lead, i) => {
    const motivos: string[] = [];
    if (lead.temperatura === "quente") motivos.push("🔥 Lead quente");
    if (lead.potencial === "premium") motivos.push("💎 Premium");
    else if (lead.potencial === "alto") motivos.push("⭐ Alto potencial");
    if (lead.status === "reuniao_agendada") motivos.push("📅 Reunião pendente");
    if (lead.status === "proposta_enviada") motivos.push("📄 Follow-up proposta");
    if (lead.status === "em_negociacao") motivos.push("🤝 Em negociação");
    if (lead.status === "novo" || lead.status === "sem_contato") motivos.push("🆕 Primeiro contato");
    if (lead.status === "em_conversa") motivos.push("💬 Continuar conversa");
    if (motivos.length === 0) motivos.push("🔄 Manutenção");

    const dicasAbordagem: Record<string, string> = {
      novo: `Apresente-se e fale sobre recorrência no segmento de ${lead.segmento}`,
      sem_contato: `Tente contato direto, mencione benefícios para ${lead.segmento}`,
      primeiro_contato: `Reforce o valor da recorrência, peça reunião`,
      em_conversa: `Aprofunde a dor do cliente, mostre cases do segmento`,
      reuniao_agendada: `Prepare apresentação focada em ${lead.segmento}`,
      proposta_enviada: `Tire dúvidas sobre a proposta, negocie condições`,
      em_negociacao: `Foque no fechamento, ofereça condições especiais`,
    };

    return {
      lead,
      horario: horarios[i] || "17:00",
      prioridade: lead.temperatura === "quente" ? "alta" : lead.temperatura === "morno" ? "media" : "baixa",
      motivo: motivos.join(" | "),
      dicaAbordagem: dicasAbordagem[lead.status] || "Mantenha o relacionamento ativo",
    };
  });
}

function gerarTextoEmail(comercial: string, agenda: AgendaItem[], dataAgenda: string): string {
  const dataFormatada = format(new Date(dataAgenda), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const bairros = agruparPorBairro(agenda);
  const bairrosList = Object.keys(bairros);

  let texto = `Bom dia, ${comercial}! ☀️\n\n`;
  texto += `Sua agenda de visitas para ${dataFormatada} está pronta! 🗓️\n`;
  texto += `São ${agenda.length} visitas estratégicas em ${bairrosList.length} região(ões).\n\n`;

  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `🎯 PRIORIDADES DO DIA\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  const altas = agenda.filter(a => a.prioridade === "alta");
  const medias = agenda.filter(a => a.prioridade === "media");
  const baixas = agenda.filter(a => a.prioridade === "baixa");

  if (altas.length > 0) {
    texto += `🔴 PRIORIDADE ALTA (${altas.length}):\n`;
    altas.forEach(a => texto += `   → ${a.lead.empresa} (${a.lead.segmento}) — ${a.motivo}\n`);
    texto += `\n`;
  }
  if (medias.length > 0) {
    texto += `🟡 PRIORIDADE MÉDIA (${medias.length}):\n`;
    medias.forEach(a => texto += `   → ${a.lead.empresa} (${a.lead.segmento})\n`);
    texto += `\n`;
  }
  if (baixas.length > 0) {
    texto += `🟢 PRIORIDADE BAIXA (${baixas.length}):\n`;
    baixas.forEach(a => texto += `   → ${a.lead.empresa} (${a.lead.segmento})\n`);
    texto += `\n`;
  }

  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `🗺️ ROTEIRO OTIMIZADO POR REGIÃO\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  let ordem = 1;
  bairrosList.forEach((bairro, bi) => {
    texto += `📍 REGIÃO ${bi + 1}: ${bairro}\n`;
    texto += `   ${bairros[bairro].length} visita(s) nesta região\n\n`;
    bairros[bairro].forEach(item => {
      const emoji = item.prioridade === "alta" ? "🔴" : item.prioridade === "media" ? "🟡" : "🟢";
      texto += `   ${emoji} #${ordem} — ${item.horario} — ${item.lead.empresa}\n`;
      texto += `      🏷️ ${item.lead.segmento}\n`;
      texto += `      📞 ${item.lead.telefone}\n`;
      texto += `      💡 Dica: ${item.dicaAbordagem}\n`;
      if (item.lead.endereco) texto += `      📌 ${item.lead.endereco}\n`;
      texto += `\n`;
      ordem++;
    });
    if (bi < bairrosList.length - 1) {
      texto += `   ➡️ Desloque-se para: ${bairrosList[bi + 1]}\n\n`;
    }
  });

  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `💬 SCRIPTS DE ABORDAGEM\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  texto += `🟢 Abertura:\n"${SCRIPTS.abertura}"\n\n`;
  texto += `🟡 Gatilho:\n"${SCRIPTS.gatilho}"\n\n`;
  texto += `🔴 Fechamento:\n"${SCRIPTS.fechamento}"\n\n`;
  texto += `🔁 Follow-up:\n"${SCRIPTS.followup}"\n\n`;

  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `🏆 TOP 3 ARGUMENTOS DO DIA\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  SALES_ARGUMENTS.slice(0, 3).forEach((arg, i) => {
    texto += `${i + 1}. ${arg.title}\n   → ${arg.text}\n\n`;
  });

  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `📌 DICAS DE ROTEIRO\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  texto += `• Siga a ordem sugerida — já está otimizada por proximidade\n`;
  texto += `• Comece pelas visitas 🔴 (maior chance de fechamento)\n`;
  texto += `• Reserve ~30 min por visita + 15 min de deslocamento\n`;
  texto += `• Tempo estimado total: ~${Math.round(agenda.length * 0.75)}h\n`;
  texto += `• Tire foto de cada estabelecimento visitado 📸\n`;
  texto += `• Registre resultado no sistema logo após cada visita\n`;
  texto += `• Horário de almoço sugerido: 12:00 às 13:30\n\n`;

  texto += `Boas vendas e bom roteiro! 🚀💪\n`;
  texto += `— Equipe de Gestão Comercial VF`;

  return texto;
}

export default function AgendaSugerida() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [dataAgenda, setDataAgenda] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>(COMERCIAIS[0]);

  const leads = useMemo(() => getInitialLeads(), []);

  // Auto-generate agendas for ALL comerciais
  const agendasPorComercial = useMemo(() => {
    const result: Record<string, AgendaItem[]> = {};
    COMERCIAIS.forEach(c => {
      result[c] = gerarAgendaSugerida(leads, c);
    });
    return result;
  }, [leads]);

  const agendaAtual = agendasPorComercial[selectedTab] || [];
  const bairrosAgrupados = useMemo(() => agruparPorBairro(agendaAtual), [agendaAtual]);

  const textoEmail = useMemo(() => {
    if (agendaAtual.length === 0) return "";
    return gerarTextoEmail(selectedTab, agendaAtual, dataAgenda);
  }, [selectedTab, agendaAtual, dataAgenda]);

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Lock className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <CardTitle className="text-lg">Agenda Sugerida</CardTitle>
            <p className="text-sm text-muted-foreground">Digite a senha para acessar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Senha"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (passwordInput === PASSWORD) setAuthenticated(true);
                  else setPasswordError(true);
                }
              }}
            />
            {passwordError && <p className="text-xs text-destructive">Senha incorreta</p>}
            <Button className="w-full" onClick={() => {
              if (passwordInput === PASSWORD) setAuthenticated(true);
              else setPasswordError(true);
            }}>Entrar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddCc = () => {
    const email = ccInput.trim();
    if (email && email.includes("@") && !emailCc.includes(email)) {
      setEmailCc(prev => [...prev, email]);
      setCcInput("");
    }
  };

  const handleRemoveCc = (email: string) => {
    setEmailCc(prev => prev.filter(e => e !== email));
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(textoEmail);
    toast({ title: "Texto copiado!", description: "Cole no seu e-mail ou WhatsApp." });
  };

  const handleSendEmail = () => {
    if (!emailTo.trim()) {
      toast({ title: "Erro", description: "Informe o e-mail do destinatário.", variant: "destructive" });
      return;
    }
    const subject = encodeURIComponent(`📋 Agenda de Visitas — ${selectedTab} — ${format(new Date(dataAgenda), "dd/MM/yyyy")}`);
    const body = encodeURIComponent(textoEmail);
    const cc = emailCc.length > 0 ? `&cc=${emailCc.join(",")}` : "";
    window.open(`mailto:${emailTo}?subject=${subject}&body=${body}${cc}`, "_blank");
    toast({ title: "E-mail aberto!", description: "Seu cliente de e-mail foi aberto com a agenda." });
  };

  const handleSendWhatsApp = () => {
    const texto = textoEmail;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const prioridadeColor = {
    alta: "bg-red-100 text-red-800 border-red-200",
    media: "bg-amber-100 text-amber-800 border-amber-200",
    baixa: "bg-green-100 text-green-800 border-green-200",
  };

  const totalAltas = agendaAtual.filter(a => a.prioridade === "alta").length;
  const totalMedias = agendaAtual.filter(a => a.prioridade === "media").length;
  const totalBaixas = agendaAtual.filter(a => a.prioridade === "baixa").length;
  const totalRegioes = Object.keys(bairrosAgrupados).length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold">📋 Agenda Sugerida de Visitas</h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(dataAgenda), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs">Data:</Label>
          <Input type="date" value={dataAgenda} onChange={e => setDataAgenda(e.target.value)} className="w-40" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {COMERCIAIS.map(c => {
          const ag = agendasPorComercial[c];
          const quentes = ag.filter(a => a.prioridade === "alta").length;
          return (
            <Card
              key={c}
              className={`cursor-pointer transition-all ${selectedTab === c ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
              onClick={() => setSelectedTab(c)}
            >
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{c}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{ag.length} visitas</span>
                  {quentes > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1 py-0">
                      {quentes} 🔥
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content for selected comercial */}
      {agendaAtual.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Route & Visits */}
          <div className="lg:col-span-2 space-y-4">
            {/* Priority summary */}
            <Card>
              <CardContent className="pt-4 pb-3">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" /> Prioridades do Dia — {selectedTab}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-2xl font-bold text-red-600">{totalAltas}</p>
                    <p className="text-[10px] text-red-600 font-medium">🔴 ALTA</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-2xl font-bold text-amber-600">{totalMedias}</p>
                    <p className="text-[10px] text-amber-600 font-medium">🟡 MÉDIA</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-2xl font-bold text-green-600">{totalBaixas}</p>
                    <p className="text-[10px] text-green-600 font-medium">🟢 BAIXA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Route by region */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Route className="h-4 w-4 text-primary" />
                  Roteiro Otimizado — {totalRegioes} região(ões)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  ⏱️ Tempo estimado: ~{Math.round(agendaAtual.length * 0.75)}h | 📍 Agrupado por proximidade
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(bairrosAgrupados).map(([bairro, items], bi) => (
                  <div key={bairro}>
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Região {bi + 1}: {bairro}</span>
                      <Badge variant="outline" className="text-[10px]">{items.length} visita(s)</Badge>
                    </div>
                    <div className="space-y-2 ml-6 border-l-2 border-primary/20 pl-4">
                      {items.map((item, ii) => (
                        <div key={item.lead.id} className="relative">
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col items-center">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                                item.prioridade === "alta" ? "bg-red-500" : item.prioridade === "media" ? "bg-amber-500" : "bg-green-500"
                              }`}>
                                {bi * 10 + ii + 1}
                              </span>
                              <span className="text-[10px] text-muted-foreground mt-1">{item.horario}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm truncate">{item.lead.empresa}</h4>
                                <Badge className={`${prioridadeColor[item.prioridade]} text-[10px] px-1`} variant="outline">
                                  {item.prioridade}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">🏷️ {item.lead.segmento}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {item.lead.telefone}
                              </p>
                              <p className="text-xs text-primary font-medium mt-1">💡 {item.motivo}</p>
                              <div className="mt-1 p-2 bg-primary/5 rounded text-xs border border-primary/10">
                                <span className="font-medium">🎯 Abordagem:</span> {item.dicaAbordagem}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {bi < Object.keys(bairrosAgrupados).length - 1 && (
                      <div className="flex items-center gap-2 ml-6 my-2 text-xs text-muted-foreground">
                        <ArrowRight className="h-3 w-3" />
                        <span>Deslocar para próxima região</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Email & Tips */}
          <div className="space-y-4">
            {/* Quick tips */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Dicas Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-2 bg-red-50 rounded border border-red-100">
                  <p className="font-medium text-red-700">🔴 Prioridade Alta</p>
                  <p className="text-red-600">Visite primeiro! Maior chance de fechamento.</p>
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <p className="font-medium">⏰ Melhor horário</p>
                  <p className="text-muted-foreground">Manhã (8h-11h) para decisores. Tarde para follow-up.</p>
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <p className="font-medium">📸 Não esqueça</p>
                  <p className="text-muted-foreground">Foto do local + registrar visita no sistema.</p>
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <p className="font-medium">🍽️ Almoço</p>
                  <p className="text-muted-foreground">Sugiro 12:00 - 13:30 entre as regiões.</p>
                </div>
              </CardContent>
            </Card>

            {/* Email sending */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" /> Enviar Agenda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">E-mail do comercial</Label>
                  <Input
                    type="email" placeholder="comercial@empresa.com"
                    value={emailTo} onChange={e => setEmailTo(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cópia (CC)</Label>
                  <div className="flex gap-1">
                    <Input
                      type="email" placeholder="email@empresa.com"
                      value={ccInput} onChange={e => setCcInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCc(); } }}
                      className="h-8 text-xs flex-1"
                    />
                    <Button variant="outline" size="sm" className="h-8 px-2" onClick={handleAddCc}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  {emailCc.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {emailCc.map(email => (
                        <Badge key={email} variant="secondary" className="text-[10px] flex items-center gap-1">
                          {email}
                          <X className="h-2 w-2 cursor-pointer" onClick={() => handleRemoveCc(email)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-2">
                  <Button size="sm" onClick={handleSendEmail} className="w-full">
                    <Send className="h-3 w-3 mr-1" /> Enviar por E-mail
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSendWhatsApp} className="w-full">
                    <Phone className="h-3 w-3 mr-1" /> Enviar por WhatsApp
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCopyText} className="w-full">
                    <Copy className="h-3 w-3 mr-1" /> Copiar Texto
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" /> Preview do E-mail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <pre className="whitespace-pre-wrap text-[10px] bg-muted/30 p-3 rounded-lg border font-sans leading-relaxed">
                    {textoEmail}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhum lead ativo encontrado para {selectedTab}.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
