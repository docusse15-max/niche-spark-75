import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lead, STATUS_LABELS, SCRIPTS } from "@/data/leads";
import { Phone, Instagram, MapPin, Building, MessageSquare, Copy, User, Trash2, Navigation, Globe, Star, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onAddNote: (id: string, note: string, author: string) => void;
  onDeleteLead?: (id: string) => void;
}

const DARK_STATUS: Record<string, string> = {
  novo: "bg-blue-500/20 text-blue-400",
  sem_contato: "bg-zinc-500/20 text-zinc-400",
  primeiro_contato: "bg-yellow-500/20 text-yellow-400",
  em_conversa: "bg-orange-500/20 text-orange-400",
  reuniao_agendada: "bg-purple-500/20 text-purple-400",
  proposta_enviada: "bg-indigo-500/20 text-indigo-400",
  em_negociacao: "bg-cyan-500/20 text-cyan-400",
  fechado: "bg-emerald-500/20 text-emerald-400",
  perdido: "bg-red-500/20 text-red-400",
};

export default function LeadDetailSheet({ lead, open, onClose, onAddNote, onDeleteLead }: LeadDetailSheetProps) {
  const [note, setNote] = useState("");
  const [author, setAuthor] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [visitComercial, setVisitComercial] = useState("");
  const [visitNotas, setVisitNotas] = useState("");
  const [visitStatus, setVisitStatus] = useState("pendente");
  const [savingVisit, setSavingVisit] = useState(false);

  if (!lead) return null;

  const handleDelete = () => {
    if (deletePassword === "56239050") {
      onDeleteLead?.(lead.id);
      setDeleteDialogOpen(false);
      setDeletePassword("");
      setDeleteError("");
      onClose();
    } else {
      setDeleteError("Senha incorreta");
    }
  };

  const copyScript = (text: string) => {
    const script = text.replace("[SEGMENTO]", lead.segmento);
    navigator.clipboard.writeText(script);
    toast({ title: "Script copiado!", description: "Cole no WhatsApp" });
  };

  const handleAddNote = () => {
    if (!note.trim() || !author.trim()) return;
    onAddNote(lead.id, note, author);
    setNote("");
  };

  const handleRegisterVisit = async () => {
    if (!visitComercial.trim()) return;
    setSavingVisit(true);
    try {
      const { error } = await supabase.from("visitas").insert({
        lead_id: lead.id,
        lead_empresa: lead.empresa,
        comercial: visitComercial,
        data_visita: new Date().toISOString(),
        status: visitStatus,
        notas: visitNotas || "",
        endereco: lead.endereco || `${lead.bairro} - ${lead.cidade}`,
        lat: lead.lat || null,
        lng: lead.lng || null,
      });
      if (error) throw error;
      toast({ title: "Visita registrada!", description: `Status: ${visitStatus}` });
      setVisitDialogOpen(false);
      setVisitComercial("");
      setVisitNotas("");
      setVisitStatus("pendente");
    } catch (e: any) {
      toast({ title: "Erro ao registrar visita", description: e.message, variant: "destructive" });
    } finally {
      setSavingVisit(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-lg gold-text">{lead.empresa}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-5">
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <Badge className={DARK_STATUS[lead.status]}>{STATUS_LABELS[lead.status]}</Badge>
              <Badge variant="outline" className="border-border text-muted-foreground">{lead.temperatura}</Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">{lead.potencial}</Badge>
            </div>
            <div className="grid gap-1.5 text-sm mt-3">
              <p className="flex items-center gap-2 text-foreground"><Building className="h-4 w-4 text-muted-foreground" />{lead.segmento}</p>
              <p className="flex items-center gap-2 text-foreground"><MapPin className="h-4 w-4 text-muted-foreground" />{lead.bairro} — {lead.cidade}</p>
              <p className="flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4 text-muted-foreground" />{lead.telefone}
                <a
                  href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(SCRIPTS.abertura.replace("[SEGMENTO]", lead.segmento).replace("[CIDADE]", lead.cidade))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 text-xs font-medium ml-1 transition-colors"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />WhatsApp
                </a>
              </p>
              <p className="flex items-center gap-2 text-foreground"><Instagram className="h-4 w-4 text-muted-foreground" />{lead.instagram}</p>
            </div>

            {/* Rating */}
            {lead.avaliacao && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium text-foreground">{lead.avaliacao}</span>
                <span className="text-xs text-muted-foreground">({lead.totalAvaliacoes} avaliações)</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {lead.googleMapsUrl && (
                <a href={lead.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-medium transition-colors">
                  <MapPin className="h-3.5 w-3.5 mr-1" />Google Maps
                </a>
              )}
              {lead.lat && lead.lng && (
                <a href={`https://waze.com/ul?ll=${lead.lat},${lead.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 text-xs font-medium transition-colors">
                  <Navigation className="h-3.5 w-3.5 mr-1" />Waze
                </a>
              )}
              {lead.website && (
                <a href={lead.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 text-xs font-medium transition-colors border border-border">
                  <Globe className="h-3.5 w-3.5 mr-1" />Site
                </a>
              )}
            </div>
          </div>

          {/* Photos */}
          {lead.fotos && lead.fotos.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 text-foreground">📸 Fotos do estabelecimento</h4>
              <div className="grid grid-cols-3 gap-2">
                {lead.fotos.map((url, i) => (
                  <img key={i} src={url} alt={`${lead.empresa} foto ${i + 1}`} className="w-full h-24 object-cover rounded-lg border border-border" loading="lazy" />
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm mb-1 text-foreground">Sobre o negócio</h4>
            <p className="text-sm text-muted-foreground">{lead.descricao || lead.endereco}</p>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <h4 className="font-semibold text-sm text-primary mb-1">💡 Por que recorrência?</h4>
            <p className="text-sm text-primary/80">{lead.motivoRecorrencia}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">📝 Script de abordagem</h4>
            <div className="space-y-2">
              {[
                { label: "Abertura", text: SCRIPTS.abertura },
                { label: "Gatilho", text: SCRIPTS.gatilho },
                { label: "Fechamento", text: SCRIPTS.fechamento },
              ].map(s => (
                <div key={s.label} className="bg-secondary rounded p-2 text-sm border border-border">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-xs text-muted-foreground">{s.label}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => copyScript(s.text)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs mt-1 text-foreground">{s.text.replace("[SEGMENTO]", lead.segmento)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">📞 Histórico</h4>
            {lead.historico.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma interação registrada</p>
            ) : (
              <div className="space-y-2">
                {lead.historico.map((h, i) => (
                  <div key={i} className="flex gap-2 text-sm border-l-2 border-primary/30 pl-3">
                    <div>
                      <span className="font-medium text-xs text-foreground">{h.date}</span>
                      <span className="mx-1 text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{h.type}</span>
                      {h.author && <span className="mx-1 text-xs font-medium text-primary">· {h.author}</span>}
                      <p className="text-xs text-foreground">{h.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registrar Visita */}
          <div className="bg-accent/50 border border-border rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2 text-foreground">📍 Registrar Visita</h4>
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={() => setVisitDialogOpen(true)}>
              <CalendarCheck className="h-4 w-4 mr-1" />Registrar Visita
            </Button>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">✏️ Nova anotação</h4>
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <User className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Seu nome..." value={author} onChange={e => setAuthor(e.target.value)} className="pl-8 h-8 text-sm bg-secondary border-border" />
              </div>
            </div>
            <Textarea placeholder="Registrar contato, observação..." value={note} onChange={e => setNote(e.target.value)} className="text-sm bg-secondary border-border" rows={2} />
            <Button size="sm" className="mt-2 gold-gradient text-background font-semibold hover:opacity-90" onClick={handleAddNote} disabled={!note.trim() || !author.trim()}>
              <MessageSquare className="h-4 w-4 mr-1" />Registrar
            </Button>
          </div>

          {lead.proximaAcao && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <h4 className="font-semibold text-sm mb-1 text-primary">🎯 Próxima ação</h4>
              <p className="text-sm text-foreground">{lead.proximaAcao}</p>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <Button variant="destructive" size="sm" onClick={() => { setDeleteDialogOpen(true); setDeletePassword(""); setDeleteError(""); }}>
              <Trash2 className="h-4 w-4 mr-1" />Excluir Lead
            </Button>
          </div>
        </div>

        <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">📍 Registrar Visita — {lead.empresa}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">Comercial *</label>
                <Input placeholder="Nome do comercial..." value={visitComercial} onChange={e => setVisitComercial(e.target.value)} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Status da visita</label>
                <Select value={visitStatus} onValueChange={setVisitStatus}>
                  <SelectTrigger className="bg-secondary border-border mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">⏳ Pendente</SelectItem>
                    <SelectItem value="em_visita">📍 Em visita</SelectItem>
                    <SelectItem value="finalizado">✅ Finalizado</SelectItem>
                    <SelectItem value="interessado">🔥 Interessado</SelectItem>
                    <SelectItem value="nao_interessado">❌ Não interessado</SelectItem>
                    <SelectItem value="voltar_depois">🔄 Voltar depois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Observações</label>
                <Textarea placeholder="Detalhes da visita..." value={visitNotas} onChange={e => setVisitNotas(e.target.value)} className="bg-secondary border-border mt-1" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setVisitDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleRegisterVisit} disabled={!visitComercial.trim() || savingVisit} className="bg-primary text-primary-foreground">
                {savingVisit ? "Salvando..." : "Registrar Visita"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Digite a senha para excluir <strong className="text-foreground">{lead.empresa}</strong>:</p>
            <Input type="password" placeholder="Senha..." value={deletePassword} onChange={e => { setDeletePassword(e.target.value); setDeleteError(""); }} className="bg-secondary border-border" />
            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
}
