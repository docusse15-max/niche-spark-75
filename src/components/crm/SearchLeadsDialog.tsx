import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Plus, MessageSquare, MapPin, Navigation, Star, Phone, Globe } from "lucide-react";
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

interface PlaceLead {
  empresa: string;
  telefone: string;
  telefoneInternacional: string;
  endereco: string;
  bairro: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  placeId: string;
  fotos: string[];
  website: string;
  avaliacao: number | null;
  totalAvaliacoes: number;
  horarioFuncionamento: string[];
}

export default function SearchLeadsDialog({ open, onClose, onImport, existingLeads }: SearchLeadsDialogProps) {
  const [nicho, setNicho] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlaceLead[]>([]);
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
      const { data, error } = await supabase.functions.invoke("search-places", {
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
      } else {
        toast({ title: `${leads.length} estabelecimentos reais encontrados!`, description: "Dados do Google Maps" });
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

  const getWazeUrl = (lat: number, lng: number) => `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  const getWhatsAppUrl = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    // If already has country code
    if (cleaned.startsWith("55")) return `https://wa.me/${cleaned}`;
    return `https://wa.me/55${cleaned}`;
  };

  const handleImport = () => {
    const maxId = existingLeads.reduce((max, l) => Math.max(max, parseInt(l.id) || 0), 0);
    const cidadeTyped = cidade as Cidade;

    const newLeads: Lead[] = Array.from(selected).map((idx, i) => {
      const r = results[idx];
      return {
        id: String(maxId + i + 1),
        empresa: r.empresa,
        segmento: nicho as Nicho,
        bairro: r.bairro || "",
        cidade: cidadeTyped,
        telefone: r.telefone || "",
        instagram: "",
        potencial: "medio" as const,
        temperatura: "frio" as const,
        status: "novo" as const,
        ultimoContato: "",
        proximaAcao: "",
        responsavel: "",
        observacoes: "",
        descricao: r.endereco || "",
        motivoRecorrencia: "",
        historico: [],
        lat: r.lat,
        lng: r.lng,
        googleMapsUrl: r.googleMapsUrl,
        fotos: r.fotos,
        endereco: r.endereco,
        avaliacao: r.avaliacao,
        totalAvaliacoes: r.totalAvaliacoes,
        website: r.website,
      };
    });

    onImport(newLeads);
    toast({ title: `${newLeads.length} leads reais importados!`, description: `${nicho} em ${cidade} — Google Maps` });
    setResults([]);
    setSearched(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Buscar Leads Reais — Google Maps
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
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Buscando no Google Maps...</> : <><Search className="h-4 w-4 mr-2" />Buscar no Google Maps</>}
        </Button>

        {searched && results.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{results.length} encontrados · {selected.size} selecionados</p>
              <Button variant="ghost" size="sm" onClick={toggleAll} className="text-xs">
                {selected.size === results.length ? "Desmarcar todos" : "Selecionar todos"}
              </Button>
            </div>
            <ScrollArea className="flex-1 max-h-[400px] border rounded-md">
              <div className="divide-y divide-border">
                {results.map((r, idx) => (
                  <label key={idx} className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <Checkbox checked={selected.has(idx)} onCheckedChange={() => toggleSelect(idx)} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground truncate">{r.empresa}</p>
                        {r.avaliacao && (
                          <span className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                            <Star className="h-3 w-3 fill-yellow-500" />{r.avaliacao} ({r.totalAvaliacoes})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{r.endereco}</p>

                      {/* Photos */}
                      {r.fotos.length > 0 && (
                        <div className="flex gap-1 mt-1.5">
                          {r.fotos.slice(0, 3).map((url, fi) => (
                            <img key={fi} src={url} alt={r.empresa} className="h-12 w-16 object-cover rounded border border-border" loading="lazy" />
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {r.telefone && (
                          <a href={getWhatsAppUrl(r.telefone)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className="inline-flex items-center rounded bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 text-[10px] transition-colors">
                            <MessageSquare className="h-3 w-3 mr-1" />WhatsApp
                          </a>
                        )}
                        <a href={r.googleMapsUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          className="inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 text-[10px] transition-colors">
                          <MapPin className="h-3 w-3 mr-1" />Google Maps
                        </a>
                        {r.lat && r.lng && (
                          <a href={getWazeUrl(r.lat, r.lng)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className="inline-flex items-center rounded bg-cyan-600 hover:bg-cyan-700 text-white px-2 py-0.5 text-[10px] transition-colors">
                            <Navigation className="h-3 w-3 mr-1" />Waze
                          </a>
                        )}
                        {r.website && (
                          <a href={r.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className="inline-flex items-center rounded bg-muted hover:bg-muted/80 text-foreground px-2 py-0.5 text-[10px] transition-colors border border-border">
                            <Globe className="h-3 w-3 mr-1" />Site
                          </a>
                        )}
                        {r.telefone && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            <Phone className="h-2.5 w-2.5 mr-0.5" />{r.telefone}
                          </Badge>
                        )}
                      </div>
                    </div>
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
              <Plus className="h-4 w-4 mr-1" />Importar {selected.size} leads reais
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
