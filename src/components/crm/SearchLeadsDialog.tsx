import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Plus, MessageSquare } from "lucide-react";
import { NICHOS, type Nicho, type Lead } from "@/data/leads";
import { CIDADES, CIDADE_CONFIGS, type Cidade } from "@/data/cities";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SearchLeadsDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (leads: Lead[]) => void;
  existingLeads: Lead[];
}

interface AILead {
  empresa: string;
  telefone: string;
  bairro: string;
  instagram: string;
  descricao: string;
}

export default function SearchLeadsDialog({ open, onClose, onImport, existingLeads }: SearchLeadsDialogProps) {
  const [nicho, setNicho] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AILead[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!nicho || !cidade) {
      toast({ title: "Selecione nicho e cidade", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResults([]);
    setSelected(new Set());
    setSearched(false);

    try {
      const { data, error } = await supabase.functions.invoke("search-leads", {
        body: { nicho, cidade },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const leads = data?.leads || [];
      setResults(leads);
      setSelected(new Set(leads.map((_: any, i: number) => i)));
      setSearched(true);

      if (leads.length === 0) {
        toast({ title: "Nenhum resultado encontrado", description: "Tente outro nicho ou cidade." });
      }
    } catch (e: any) {
      console.error(e);
      toast({ title: "Erro na busca", description: e.message || "Tente novamente", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (idx: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === results.length) setSelected(new Set());
    else setSelected(new Set(results.map((_, i) => i)));
  };

  const handleImport = () => {
    const maxId = existingLeads.reduce((max, l) => Math.max(max, parseInt(l.id) || 0), 0);
    const cidadeTyped = cidade as Cidade;
    const config = CIDADE_CONFIGS[cidadeTyped];
    const bairros = config?.bairros || [];

    const newLeads: Lead[] = Array.from(selected).map((idx, i) => {
      const r = results[idx];
      const bairroObj = bairros.find(b => b.nome.toLowerCase() === r.bairro?.toLowerCase()) || bairros[0];
      return {
        id: String(maxId + i + 1),
        empresa: r.empresa,
        segmento: nicho as Nicho,
        bairro: r.bairro || bairroObj?.nome || "",
        cidade: cidadeTyped,
        telefone: r.telefone,
        instagram: r.instagram || "",
        potencial: "medio" as const,
        temperatura: "frio" as const,
        status: "novo" as const,
        ultimoContato: "",
        proximaAcao: "",
        responsavel: "",
        observacoes: "Importado via busca IA",
        descricao: r.descricao || "",
        motivoRecorrencia: "",
        historico: [],
        lat: bairroObj ? bairroObj.coords[0] + (Math.random() - 0.5) * 0.01 : undefined,
        lng: bairroObj ? bairroObj.coords[1] + (Math.random() - 0.5) * 0.01 : undefined,
      };
    });

    onImport(newLeads);
    toast({ title: `${newLeads.length} leads importados!`, description: `${nicho} em ${cidade}` });
    setResults([]);
    setSearched(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Buscar Leads Reais com IA
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Nicho</Label>
            <Select value={nicho} onValueChange={setNicho}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Selecione o nicho" /></SelectTrigger>
              <SelectContent>
                {NICHOS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Cidade</Label>
            <Select value={cidade} onValueChange={setCidade}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Selecione a cidade" /></SelectTrigger>
              <SelectContent>
                {CIDADES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSearch} disabled={loading || !nicho || !cidade} className="gold-gradient text-background font-semibold">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Buscando com IA...</> : <><Search className="h-4 w-4 mr-2" />Buscar Estabelecimentos</>}
        </Button>

        {searched && results.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{results.length} encontrados · {selected.size} selecionados</p>
              <Button variant="ghost" size="sm" onClick={toggleAll} className="text-xs">
                {selected.size === results.length ? "Desmarcar todos" : "Selecionar todos"}
              </Button>
            </div>
            <ScrollArea className="flex-1 max-h-[350px] border rounded-md">
              <div className="divide-y divide-border">
                {results.map((r, idx) => (
                  <label key={idx} className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <Checkbox checked={selected.has(idx)} onCheckedChange={() => toggleSelect(idx)} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{r.empresa}</p>
                      <p className="text-xs text-muted-foreground">{r.bairro}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{r.telefone}</Badge>
                        {r.instagram && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{r.instagram}</Badge>}
                      </div>
                      {r.descricao && <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{r.descricao}</p>}
                    </div>
                    <a
                      href={`https://wa.me/55${r.telefone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="shrink-0 mt-1 inline-flex items-center rounded bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-[10px] transition-colors"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />Zap
                    </a>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        {searched && results.length > 0 && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleImport} disabled={selected.size === 0} className="gold-gradient text-background font-semibold">
              <Plus className="h-4 w-4 mr-1" />Importar {selected.size} leads
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
