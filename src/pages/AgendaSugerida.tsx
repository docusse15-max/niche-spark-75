import { useState, useMemo } from "react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getInitialLeads, Lead, COMERCIAIS, SALES_ARGUMENTS, SCRIPTS } from "@/data/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Lock, Mail, Send, Calendar, MapPin, User, Copy,
  Building2, Phone, Star, Plus, X, Eye
} from "lucide-react";

const PASSWORD = "56239050";

interface AgendaItem {
  lead: Lead;
  horario: string;
  prioridade: "alta" | "media" | "baixa";
  motivo: string;
}

function gerarAgendaSugerida(leads: Lead[], comercial: string): AgendaItem[] {
  const leadsDoComercial = leads.filter(l => l.responsavel === comercial);

  const prioritarios = leadsDoComercial
    .filter(l => !["fechado", "perdido"].includes(l.status))
    .sort((a, b) => {
      const tempScore = { quente: 3, morno: 2, frio: 1 };
      const potScore = { premium: 4, alto: 3, medio: 2, baixo: 1 };
      const scoreA = tempScore[a.temperatura] * 2 + potScore[a.potencial];
      const scoreB = tempScore[b.temperatura] * 2 + potScore[b.potencial];
      return scoreB - scoreA;
    })
    .slice(0, 8);

  const horarios = ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00", "17:00"];

  return prioritarios.map((lead, i) => {
    const motivos: string[] = [];
    if (lead.temperatura === "quente") motivos.push("Lead quente 🔥");
    if (lead.potencial === "premium" || lead.potencial === "alto") motivos.push(`Potencial ${lead.potencial}`);
    if (lead.status === "reuniao_agendada") motivos.push("Reunião pendente");
    if (lead.status === "proposta_enviada") motivos.push("Follow-up proposta");
    if (lead.status === "novo" || lead.status === "sem_contato") motivos.push("Primeiro contato");
    if (motivos.length === 0) motivos.push("Manutenção de relacionamento");

    return {
      lead,
      horario: horarios[i] || "17:30",
      prioridade: lead.temperatura === "quente" ? "alta" : lead.temperatura === "morno" ? "media" : "baixa",
      motivo: motivos.join(" | "),
    };
  });
}

function gerarTextoEmail(comercial: string, agenda: AgendaItem[], dataAgenda: string): string {
  const dataFormatada = format(new Date(dataAgenda), "EEEE, dd 'de' MMMM", { locale: ptBR });

  let texto = `Olá ${comercial}! 👋\n\n`;
  texto += `Preparamos sua agenda sugerida de visitas para ${dataFormatada}. 🗓️\n\n`;
  texto += `Hoje você tem ${agenda.length} visitas estratégicas planejadas. Vamos com tudo! 💪\n\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `📋 ROTEIRO DO DIA\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  agenda.forEach((item, i) => {
    const emoji = item.prioridade === "alta" ? "🔴" : item.prioridade === "media" ? "🟡" : "🟢";
    texto += `${emoji} ${item.horario} — ${item.lead.empresa}\n`;
    texto += `   📍 ${item.lead.bairro}, ${item.lead.cidade}\n`;
    texto += `   🏷️ ${item.lead.segmento}\n`;
    texto += `   📞 ${item.lead.telefone}\n`;
    texto += `   💡 ${item.motivo}\n`;
    if (item.lead.endereco) texto += `   🗺️ ${item.lead.endereco}\n`;
    texto += `\n`;
  });

  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `💬 DICA DE PITCH DE VENDA\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  texto += `Abertura: "${SCRIPTS.abertura.replace("[SEGMENTO]", "recorrência").replace("[CIDADE]", "sua região")}"\n\n`;
  texto += `Gatilho: "${SCRIPTS.gatilho}"\n\n`;
  texto += `Fechamento: "${SCRIPTS.fechamento}"\n\n`;

  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `🏆 ARGUMENTOS CHAVE\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  SALES_ARGUMENTS.slice(0, 4).forEach(arg => {
    texto += `✅ ${arg.title}: ${arg.text}\n`;
  });

  texto += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `🗺️ DICAS DE ROTEIRO\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  texto += `• Comece pelas visitas de maior prioridade (🔴)\n`;
  texto += `• Agrupe visitas por bairro para otimizar deslocamento\n`;
  texto += `• Reserve 30-45 min por visita\n`;
  texto += `• Tire fotos dos estabelecimentos visitados\n`;
  texto += `• Registre observações no sistema após cada visita\n\n`;

  texto += `Boas vendas! 🚀\n`;
  texto += `— Equipe de Gestão Comercial VF`;

  return texto;
}

export default function AgendaSugerida() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [selectedComercial, setSelectedComercial] = useState<string>("");
  const [dataAgenda, setDataAgenda] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const leads = useMemo(() => getInitialLeads(), []);

  const agenda = useMemo(() => {
    if (!selectedComercial) return [];
    return gerarAgendaSugerida(leads, selectedComercial);
  }, [leads, selectedComercial]);

  const textoEmail = useMemo(() => {
    if (!selectedComercial || agenda.length === 0) return "";
    return gerarTextoEmail(selectedComercial, agenda, dataAgenda);
  }, [selectedComercial, agenda, dataAgenda]);

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
            <Button
              className="w-full"
              onClick={() => {
                if (passwordInput === PASSWORD) setAuthenticated(true);
                else setPasswordError(true);
              }}
            >
              Entrar
            </Button>
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
    const subject = encodeURIComponent(`📋 Agenda de Visitas — ${selectedComercial} — ${format(new Date(dataAgenda), "dd/MM/yyyy")}`);
    const body = encodeURIComponent(textoEmail);
    const cc = emailCc.length > 0 ? `&cc=${emailCc.join(",")}` : "";
    window.open(`mailto:${emailTo}?subject=${subject}&body=${body}${cc}`, "_blank");
    toast({ title: "E-mail aberto!", description: "Seu cliente de e-mail foi aberto com a agenda." });
  };

  const prioridadeColor = {
    alta: "bg-red-100 text-red-800 border-red-200",
    media: "bg-amber-100 text-amber-800 border-amber-200",
    baixa: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">📋 Agenda Sugerida de Visitas</h1>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Comercial</Label>
              <Select value={selectedComercial} onValueChange={setSelectedComercial}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o comercial" />
                </SelectTrigger>
                <SelectContent>
                  {COMERCIAIS.map(c => (
                    <SelectItem key={c} value={c}>
                      <span className="flex items-center gap-2"><User className="h-3 w-3" /> {c}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data da Agenda</Label>
              <Input type="date" value={dataAgenda} onChange={e => setDataAgenda(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-mail do comercial</Label>
              <Input
                type="email"
                placeholder="comercial@empresa.com"
                value={emailTo}
                onChange={e => setEmailTo(e.target.value)}
              />
            </div>
          </div>

          {/* CC */}
          <div className="mt-4 space-y-2">
            <Label>Pessoas em cópia (CC)</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@empresa.com"
                value={ccInput}
                onChange={e => setCcInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCc(); } }}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={handleAddCc}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
            {emailCc.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {emailCc.map(email => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveCc(email)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedComercial && agenda.length > 0 && (
        <>
          {/* Agenda Cards */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Visitas sugeridas para {selectedComercial}
              <Badge variant="outline">{agenda.length} visitas</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agenda.map((item, i) => (
                <Card key={item.lead.id} className="border-l-4" style={{
                  borderLeftColor: item.prioridade === "alta" ? "#ef4444" : item.prioridade === "media" ? "#f59e0b" : "#22c55e"
                }}>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-primary">{item.horario}</span>
                          <Badge className={prioridadeColor[item.prioridade]} variant="outline">
                            {item.prioridade}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-sm flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {item.lead.empresa}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {item.lead.bairro}, {item.lead.cidade}
                        </p>
                        <p className="text-xs text-muted-foreground">🏷️ {item.lead.segmento}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {item.lead.telefone}
                        </p>
                        <p className="text-xs mt-1 font-medium text-primary">💡 {item.motivo}</p>
                      </div>
                      <span className="text-2xl font-bold text-muted-foreground/30">#{i + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? "Ocultar Preview" : "Ver Preview do E-mail"}
                </Button>
                <Button onClick={handleCopyText} variant="outline">
                  <Copy className="h-4 w-4 mr-2" /> Copiar Texto
                </Button>
                <Button onClick={handleSendEmail}>
                  <Send className="h-4 w-4 mr-2" /> Enviar por E-mail
                </Button>
              </div>

              {showPreview && (
                <div className="mt-4">
                  <Separator className="mb-4" />
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Preview do E-mail
                  </h3>
                  <ScrollArea className="h-[400px]">
                    <pre className="whitespace-pre-wrap text-xs bg-muted/50 p-4 rounded-lg border font-sans leading-relaxed">
                      {textoEmail}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {selectedComercial && agenda.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhum lead ativo encontrado para {selectedComercial}.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
