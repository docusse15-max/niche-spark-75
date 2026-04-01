import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NICHOS, BAIRROS, Lead } from "@/data/leads";
import { useState } from "react";

interface NewLeadDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
}

export default function NewLeadDialog({ open, onClose, onSave }: NewLeadDialogProps) {
  const [form, setForm] = useState({
    empresa: "", segmento: "" as any, bairro: "" as any, telefone: "", instagram: "",
    potencial: "medio" as any, observacoes: "",
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.empresa || !form.segmento || !form.bairro) return;
    const lead: Lead = {
      id: Date.now().toString(),
      empresa: form.empresa,
      segmento: form.segmento,
      bairro: form.bairro,
      telefone: form.telefone,
      instagram: form.instagram,
      potencial: form.potencial,
      temperatura: "frio",
      status: "novo",
      ultimoContato: "",
      proximaAcao: "Primeiro contato",
      responsavel: "",
      observacoes: form.observacoes,
      descricao: "",
      motivoRecorrencia: "",
      historico: [],
    };
    onSave(lead);
    setForm({ empresa: "", segmento: "" as any, bairro: "" as any, telefone: "", instagram: "", potencial: "medio", observacoes: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Novo Lead</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div><Label className="text-xs">Empresa *</Label><Input value={form.empresa} onChange={e => set("empresa", e.target.value)} placeholder="Nome da empresa" className="h-9" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Segmento *</Label>
              <Select value={form.segmento || undefined} onValueChange={v => set("segmento", v)}><SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{NICHOS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select>
            </div>
            <div><Label className="text-xs">Bairro *</Label>
              <Select value={form.bairro || undefined} onValueChange={v => set("bairro", v)}><SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{BAIRROS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Telefone</Label><Input value={form.telefone} onChange={e => set("telefone", e.target.value)} placeholder="(67) 99999-0000" className="h-9" /></div>
            <div><Label className="text-xs">Instagram</Label><Input value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@perfil" className="h-9" /></div>
          </div>
          <div>
            <Label className="text-xs">Potencial</Label>
            <Select value={form.potencial} onValueChange={v => set("potencial", v)}><SelectTrigger className="h-9"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="baixo">Baixo</SelectItem><SelectItem value="medio">Médio</SelectItem><SelectItem value="alto">Alto</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select>
          </div>
          <div><Label className="text-xs">Observações</Label><Textarea value={form.observacoes} onChange={e => set("observacoes", e.target.value)} placeholder="Notas iniciais..." rows={2} className="text-sm" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!form.empresa || !form.segmento || !form.bairro}>Salvar Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
