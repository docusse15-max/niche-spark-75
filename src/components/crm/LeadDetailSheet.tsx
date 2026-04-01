import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lead, STATUS_LABELS, STATUS_COLORS, TEMP_COLORS, POTENTIAL_COLORS, SCRIPTS } from "@/data/leads";
import { Phone, Instagram, MapPin, Building, MessageSquare, Copy, User } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onAddNote: (id: string, note: string, author: string) => void;
}

export default function LeadDetailSheet({ lead, open, onClose, onAddNote }: LeadDetailSheetProps) {
  const [note, setNote] = useState("");
  const [author, setAuthor] = useState("");

  if (!lead) return null;

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
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">{lead.empresa}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-5">
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <Badge className={STATUS_COLORS[lead.status]}>{STATUS_LABELS[lead.status]}</Badge>
              <Badge variant="outline" className={TEMP_COLORS[lead.temperatura]}>{lead.temperatura}</Badge>
              <Badge variant="outline" className={POTENTIAL_COLORS[lead.potencial]}>{lead.potencial}</Badge>
            </div>
            <div className="grid gap-1.5 text-sm mt-3">
              <p className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground" />{lead.segmento}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{lead.bairro}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{lead.telefone}</p>
              <p className="flex items-center gap-2"><Instagram className="h-4 w-4 text-muted-foreground" />{lead.instagram}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">Sobre o negócio</h4>
            <p className="text-sm text-muted-foreground">{lead.descricao}</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <h4 className="font-semibold text-sm text-emerald-800 mb-1">💡 Por que recorrência?</h4>
            <p className="text-sm text-emerald-700">{lead.motivoRecorrencia}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">📝 Script de abordagem</h4>
            <div className="space-y-2">
              {[
                { label: "Abertura", text: SCRIPTS.abertura },
                { label: "Gatilho", text: SCRIPTS.gatilho },
                { label: "Fechamento", text: SCRIPTS.fechamento },
              ].map(s => (
                <div key={s.label} className="bg-muted/50 rounded p-2 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-xs text-muted-foreground">{s.label}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyScript(s.text)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs mt-1">{s.text.replace("[SEGMENTO]", lead.segmento)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">📞 Histórico</h4>
            {lead.historico.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma interação registrada</p>
            ) : (
              <div className="space-y-2">
                {lead.historico.map((h, i) => (
                  <div key={i} className="flex gap-2 text-sm border-l-2 border-primary/30 pl-3">
                    <div>
                      <span className="font-medium text-xs">{h.date}</span>
                      <span className="mx-1 text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{h.type}</span>
                      {h.author && <span className="mx-1 text-xs font-medium text-primary">· {h.author}</span>}
                      <p className="text-xs">{h.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">✏️ Nova anotação</h4>
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <User className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Seu nome..."
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>
            <Textarea placeholder="Registrar contato, observação..." value={note} onChange={e => setNote(e.target.value)} className="text-sm" rows={2} />
            <Button size="sm" className="mt-2" onClick={handleAddNote} disabled={!note.trim() || !author.trim()}>
              <MessageSquare className="h-4 w-4 mr-1" />Registrar
            </Button>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-1">🎯 Próxima ação</h4>
            <p className="text-sm">{lead.proximaAcao}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
