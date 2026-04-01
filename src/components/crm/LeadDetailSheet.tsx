import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lead, STATUS_LABELS, SCRIPTS } from "@/data/leads";
import { Phone, Instagram, MapPin, Building, MessageSquare, Copy, User, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

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
              <p className="flex items-center gap-2 text-foreground"><MapPin className="h-4 w-4 text-muted-foreground" />{lead.bairro}</p>
              <p className="flex items-center gap-2 text-foreground"><Phone className="h-4 w-4 text-muted-foreground" />{lead.telefone}</p>
              <p className="flex items-center gap-2 text-foreground"><Instagram className="h-4 w-4 text-muted-foreground" />{lead.instagram}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1 text-foreground">Sobre o negócio</h4>
            <p className="text-sm text-muted-foreground">{lead.descricao}</p>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
