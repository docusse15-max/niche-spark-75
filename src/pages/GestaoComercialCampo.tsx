import { useState, useEffect, useMemo, useRef, DragEvent } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { getInitialLeads, Lead, COMERCIAIS } from "@/data/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import {
  MapPin, CheckCircle2, XCircle, Clock, Trophy, TrendingUp,
  Play, Square, RotateCcw, User, Building2, Lock, Camera, FileText,
  Phone, ArrowRight, Send, GripVertical
} from "lucide-react";

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
  lat: number | null;
  lng: number | null;
}

const PASSWORD = "56239050";

// Kanban stages
const KANBAN_STAGES = [
  { key: "lead_gerado", label: "Lead Gerado", color: "bg-slate-500", icon: "📋" },
  { key: "roteirizado", label: "Roteirizado", color: "bg-blue-500", icon: "🗺️" },
  { key: "em_visita", label: "Em Visita", color: "bg-amber-500", icon: "📍" },
  { key: "visitado", label: "Visitado", color: "bg-purple-500", icon: "✅" },
  { key: "proposta", label: "Proposta", color: "bg-orange-500", icon: "📝" },
  { key: "fechado", label: "Fechado", color: "bg-emerald-500", icon: "🏆" },
] as const;

type KanbanStage = typeof KANBAN_STAGES[number]["key"];

interface KanbanCard {
  id: string;
  empresa: string;
  comercial: string;
  stage: KanbanStage;
  endereco?: string;
}

export default function GestaoComercialCampo() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  if (!authenticated) {
    return <PasswordGate
      value={passwordInput}
      onChange={setPasswordInput}
      error={passwordError}
      onSubmit={() => {
        if (passwordInput === PASSWORD) {
          setAuthenticated(true);
          setPasswordError(false);
        } else {
          setPasswordError(true);
        }
      }}
    />;
  }

  return <ExecucaoCampo />;
}

function PasswordGate({ value, onChange, error, onSubmit }: {
  value: string; onChange: (v: string) => void; error: boolean; onSubmit: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Lock className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <CardTitle className="text-lg">Gestão Comercial Campo</CardTitle>
          <p className="text-sm text-muted-foreground">Digite a senha para acessar</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pw">Senha</Label>
            <Input
              id="pw"
              type="password"
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSubmit()}
              placeholder="••••••••"
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive mt-1">Senha incorreta</p>}
          </div>
          <Button className="w-full" onClick={onSubmit}>Entrar</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ExecucaoCampo() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizarVisita, setFinalizarVisita] = useState<Visita | null>(null);
  const leads = useMemo(() => getInitialLeads(), []);

  // Kanban state from leads + visitas
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>([]);

  const fetchVisitas = async () => {
    setLoading(true);
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

    const { data } = await supabase
      .from("visitas")
      .select("*")
      .gte("data_visita", startOfDay)
      .lte("data_visita", endOfDay)
      .order("data_visita", { ascending: true });

    if (data) setVisitas(data);
    setLoading(false);
  };

  useEffect(() => { fetchVisitas(); }, []);

  // Build kanban cards from leads + visitas
  useEffect(() => {
    const visitaMap = new Map(visitas.map(v => [v.lead_id, v]));
    const cards: KanbanCard[] = leads.slice(0, 30).map(lead => {
      const visita = visitaMap.get(lead.id);
      let stage: KanbanStage = "lead_gerado";
      if (lead.status === "fechado") stage = "fechado";
      else if (lead.status === "proposta_enviada" || lead.status === "em_negociacao") stage = "proposta";
      else if (visita?.status === "realizada") stage = "visitado";
      else if (visita?.status === "em_visita") stage = "em_visita";
      else if (visita) stage = "roteirizado";
      return {
        id: lead.id,
        empresa: lead.empresa,
        comercial: lead.responsavel,
        stage,
        endereco: lead.endereco || lead.bairro,
      };
    });
    setKanbanCards(cards);
  }, [leads, visitas]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("visitas")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      toast({ title: "Status atualizado", description: `Visita marcada como "${newStatus}"` });
      fetchVisitas();
    }
  };

  const handleFinalizarClick = (visita: Visita) => {
    setFinalizarVisita(visita);
  };

  const handleFinalizarComplete = async (data: RegistroVisitaData) => {
    if (!finalizarVisita) return;
    const notas = `Status: ${data.statusVisita}\nObservação: ${data.observacao}\nPróxima ação: ${data.proximaAcao}${data.fotos.length > 0 ? `\nFotos: ${data.fotos.length} arquivo(s)` : ""}`;
    await supabase
      .from("visitas")
      .update({ status: "realizada", notas })
      .eq("id", finalizarVisita.id);
    toast({ title: "Visita finalizada!", description: `${finalizarVisita.lead_empresa} — ${data.statusVisita}` });
    setFinalizarVisita(null);
    fetchVisitas();
  };

  const moveKanbanCard = (cardId: string, newStage: KanbanStage) => {
    setKanbanCards(prev => prev.map(c => c.id === cardId ? { ...c, stage: newStage } : c));
    toast({ title: "Card movido", description: `Movido para ${KANBAN_STAGES.find(s => s.key === newStage)?.label}` });
  };

  // Stats
  const totalHoje = visitas.length;
  const realizadas = visitas.filter(v => v.status === "realizada").length;
  const naoRealizadas = visitas.filter(v => v.status === "cancelada" || v.status === "nao_realizada").length;
  const taxa = totalHoje > 0 ? Math.round((realizadas / totalHoje) * 100) : 0;
  const vendedorCount: Record<string, number> = {};
  visitas.filter(v => v.status === "realizada").forEach(v => {
    vendedorCount[v.comercial] = (vendedorCount[v.comercial] || 0) + 1;
  });
  const topVendedor = Object.entries(vendedorCount).sort((a, b) => b[1] - a[1])[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case "em_visita": return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30"><MapPin className="h-3 w-3 mr-1" />Em visita</Badge>;
      case "realizada": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Finalizado</Badge>;
      case "cancelada":
      case "nao_realizada": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Não visitado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-6 w-6 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold">Execução de Campo</h1>
        <span className="text-sm text-muted-foreground ml-2">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </span>
      </div>

      {/* Cards de visão geral */}
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
            <p className="text-2xl font-bold text-emerald-600">{realizadas}</p>
            <p className="text-xs text-muted-foreground">Realizadas</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/30">
          <CardContent className="p-4 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-500 mb-1" />
            <p className="text-2xl font-bold text-red-600">{naoRealizadas}</p>
            <p className="text-xs text-muted-foreground">Não realizadas</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-amber-500 mb-1" />
            <p className="text-2xl font-bold text-amber-600">{taxa}%</p>
            <p className="text-xs text-muted-foreground">Taxa de conversão</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center">
            <Trophy className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-sm font-bold truncate">{topVendedor ? topVendedor[0] : "—"}</p>
            <p className="text-xs text-muted-foreground">
              {topVendedor ? `${topVendedor[1]} visita(s)` : "Top vendedor"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban de Fluxo de Execução */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            🔄 Fluxo de Execução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <KanbanBoard cards={kanbanCards} onMoveCard={moveKanbanCard} />
        </CardContent>
      </Card>

      {/* Mapa de check-in */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Mapa de Visitas — Check-in em tempo real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MapaCheckin visitas={visitas} leads={leads} onUpdateStatus={updateStatus} />
        </CardContent>
      </Card>

      {/* Lista de visitas do dia */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">📋 Visitas do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm text-center py-8">Carregando visitas...</p>
          ) : visitas.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">Nenhuma visita agendada para hoje.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estabelecimento</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitas.map(v => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {v.lead_empresa}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {v.endereco || "—"}
                      </TableCell>
                      <TableCell>{getStatusBadge(v.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3" /> {v.comercial}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(parseISO(v.data_visita), "HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {v.status === "pendente" && (
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-500/30 h-7 text-xs"
                              onClick={() => updateStatus(v.id, "em_visita")}>
                              <Play className="h-3 w-3 mr-1" /> Iniciar
                            </Button>
                          )}
                          {v.status === "em_visita" && (
                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-500/30 h-7 text-xs"
                              onClick={() => handleFinalizarClick(v)}>
                              <Square className="h-3 w-3 mr-1" /> Finalizar
                            </Button>
                          )}
                          {(v.status === "pendente" || v.status === "cancelada" || v.status === "nao_realizada") && (
                            <Button size="sm" variant="ghost" className="text-muted-foreground h-7 text-xs"
                              onClick={() => updateStatus(v.id, "nao_realizada")}>
                              <RotateCcw className="h-3 w-3 mr-1" /> Remarcar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Registro de Visita */}
      {finalizarVisita && (
        <RegistroVisitaDialog
          visita={finalizarVisita}
          open={!!finalizarVisita}
          onClose={() => setFinalizarVisita(null)}
          onSubmit={handleFinalizarComplete}
        />
      )}
    </div>
  );
}

// ==================== KANBAN BOARD ====================

function KanbanBoard({ cards, onMoveCard }: { cards: KanbanCard[]; onMoveCard: (id: string, stage: KanbanStage) => void }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent, cardId: string) => {
    setDraggedId(cardId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent, stage: KanbanStage) => {
    e.preventDefault();
    if (draggedId) {
      onMoveCard(draggedId, stage);
      setDraggedId(null);
    }
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-[900px]">
        {KANBAN_STAGES.map(stage => {
          const stageCards = cards.filter(c => c.stage === stage.key);
          return (
            <div
              key={stage.key}
              className="flex-1 min-w-[140px]"
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, stage.key)}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <span className="text-xs font-semibold">{stage.icon} {stage.label}</span>
                <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5">{stageCards.length}</Badge>
              </div>
              <div className="space-y-1.5 min-h-[80px] rounded-md bg-muted/20 border border-dashed border-border p-1.5">
                {stageCards.length === 0 && (
                  <p className="text-[10px] text-muted-foreground text-center py-4">Arraste aqui</p>
                )}
                {stageCards.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={e => handleDragStart(e, card.id)}
                    className={`rounded border bg-card p-2 text-xs cursor-grab active:cursor-grabbing shadow-sm hover:shadow transition-shadow ${draggedId === card.id ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start gap-1">
                      <GripVertical className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{card.empresa}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{card.comercial}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== REGISTRO DE VISITA ====================

interface RegistroVisitaData {
  statusVisita: string;
  observacao: string;
  proximaAcao: string;
  fotos: File[];
  contrato: File | null;
}

function RegistroVisitaDialog({ visita, open, onClose, onSubmit }: {
  visita: Visita; open: boolean; onClose: () => void; onSubmit: (data: RegistroVisitaData) => void;
}) {
  const [statusVisita, setStatusVisita] = useState("");
  const [observacao, setObservacao] = useState("");
  const [proximaAcao, setProximaAcao] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [contrato, setContrato] = useState<File | null>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const contratoInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = statusVisita && observacao.trim().length > 0 && proximaAcao;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ statusVisita, observacao, proximaAcao, fotos, contrato });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Registro da Visita
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{visita.lead_empresa}</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status da visita */}
          <div>
            <Label className="text-xs font-semibold">Status da Visita *</Label>
            <Select value={statusVisita} onValueChange={setStatusVisita}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o resultado..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interessado">
                  <span className="flex items-center gap-2">✅ Interessado</span>
                </SelectItem>
                <SelectItem value="nao_interessado">
                  <span className="flex items-center gap-2">❌ Não interessado</span>
                </SelectItem>
                <SelectItem value="voltar_depois">
                  <span className="flex items-center gap-2">🔄 Voltar depois</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observação */}
          <div>
            <Label className="text-xs font-semibold">Observação *</Label>
            <Textarea
              className="mt-1"
              placeholder="Descreva o que aconteceu na visita..."
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
              rows={3}
            />
          </div>

          {/* Upload de fotos */}
          <div>
            <Label className="text-xs font-semibold">Fotos do local</Label>
            <div className="mt-1 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fotoInputRef.current?.click()}
                className="text-xs"
              >
                <Camera className="h-3 w-3 mr-1" /> Adicionar foto
              </Button>
              <input
                ref={fotoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFotoChange}
              />
              {fotos.length > 0 && (
                <span className="text-xs text-muted-foreground">{fotos.length} foto(s)</span>
              )}
            </div>
            {fotos.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {fotos.map((f, i) => (
                  <div key={i} className="relative w-12 h-12 rounded border overflow-hidden">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    <button
                      className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl text-[8px] px-1"
                      onClick={() => setFotos(prev => prev.filter((_, idx) => idx !== i))}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload de contrato */}
          <div>
            <Label className="text-xs font-semibold">Contrato (opcional)</Label>
            <div className="mt-1 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => contratoInputRef.current?.click()}
                className="text-xs"
              >
                <FileText className="h-3 w-3 mr-1" /> Anexar contrato
              </Button>
              <input
                ref={contratoInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="hidden"
                onChange={e => e.target.files?.[0] && setContrato(e.target.files[0])}
              />
              {contrato && (
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">{contrato.name}</span>
              )}
            </div>
          </div>

          {/* Próxima ação */}
          <div>
            <Label className="text-xs font-semibold">Próxima Ação *</Label>
            <Select value={proximaAcao} onValueChange={setProximaAcao}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="O que fazer a seguir..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ligar">
                  <span className="flex items-center gap-2"><Phone className="h-3 w-3" /> Ligar</span>
                </SelectItem>
                <SelectItem value="voltar">
                  <span className="flex items-center gap-2"><RotateCcw className="h-3 w-3" /> Voltar</span>
                </SelectItem>
                <SelectItem value="enviar_proposta">
                  <span className="flex items-center gap-2"><Send className="h-3 w-3" /> Enviar proposta</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Finalizar Visita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== MAPA CHECKIN ====================

function MapaCheckin({ visitas, leads, onUpdateStatus }: {
  visitas: Visita[]; leads: Lead[]; onUpdateStatus: (id: string, s: string) => void;
}) {
  if (visitas.length === 0) {
    return (
      <div className="h-64 rounded-lg bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Nenhuma visita para exibir no mapa</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="h-48 rounded-lg bg-gradient-to-br from-muted/20 to-muted/40 border border-border p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {visitas.map(v => {
            const statusColor = v.status === "realizada" ? "border-emerald-500 bg-emerald-500/5"
              : v.status === "em_visita" ? "border-blue-500 bg-blue-500/5"
              : v.status === "cancelada" || v.status === "nao_realizada" ? "border-red-500 bg-red-500/5"
              : "border-amber-500 bg-amber-500/5";
            return (
              <div key={v.id} className={`rounded-md border p-2 text-xs ${statusColor} flex items-center justify-between`}>
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate font-medium">{v.lead_empresa}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  {v.status === "pendente" && (
                    <Button size="sm" variant="ghost" className="h-5 px-1 text-[10px] text-blue-600"
                      onClick={() => onUpdateStatus(v.id, "em_visita")}>Check-in</Button>
                  )}
                  {v.status === "em_visita" && (
                    <Button size="sm" variant="ghost" className="h-5 px-1 text-[10px] text-emerald-600"
                      onClick={() => onUpdateStatus(v.id, "realizada")}>Finalizar</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pendente</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Em visita</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Finalizado</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Não visitado</span>
      </div>
    </div>
  );
}
