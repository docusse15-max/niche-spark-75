import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NICHOS, RESPONSAVEIS, getInitialLeads } from "@/data/leads";
import { CIDADES } from "@/data/cities";
import { X, Search, SlidersHorizontal } from "lucide-react";

export interface Filters {
  search: string;
  nicho: string;
  bairro: string;
  cidade: string;
  temperatura: string;
  status: string;
  potencial: string;
  responsavel: string;
}

interface CRMFiltersProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

/** Extract clean bairro name from address-style strings like "380 - Vila Vilas Boas" */
function extractBairroName(bairro: string): string {
  if (!bairro) return "";
  const parts = bairro.split(" - ");
  if (parts.length >= 2) {
    return parts[parts.length - 1].trim();
  }
  return bairro.trim();
}

export { extractBairroName };

export default function CRMFilters({ filters, onChange }: CRMFiltersProps) {
  const set = (key: keyof Filters, val: string) => {
    const updated = { ...filters, [key]: val === "all" ? "" : val };
    if (key === "cidade") updated.bairro = "";
    onChange(updated);
  };

  const activeCount = Object.entries(filters).filter(([k, v]) => v !== "" && k !== "search").length;
  const hasFilters = Object.values(filters).some(v => v !== "");

  // Build bairro options from actual lead data, filtered by city
  const bairrosOptions = useMemo(() => {
    const leads = getInitialLeads();
    const bairroSet = new Set<string>();
    for (const lead of leads) {
      if (filters.cidade && lead.cidade !== filters.cidade) continue;
      const name = extractBairroName(lead.bairro);
      if (name && name !== "MS") bairroSet.add(name);
    }
    return Array.from(bairroSet).sort();
  }, [filters.cidade]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 items-center p-3 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-1.5 text-muted-foreground mr-1">
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
              {activeCount}
            </Badge>
          )}
        </div>

        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar empresa..." value={filters.search} onChange={e => set("search", e.target.value)} className="pl-8 h-9 bg-secondary border-border" />
        </div>

        <Select value={filters.cidade || "all"} onValueChange={v => set("cidade", v)}>
          <SelectTrigger className="w-[155px] h-9 bg-secondary border-border">
            <SelectValue placeholder="Cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🏙️ Todas Cidades</SelectItem>
            {CIDADES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.bairro || "all"} onValueChange={v => set("bairro", v)}>
          <SelectTrigger className="w-[155px] h-9 bg-secondary border-border">
            <SelectValue placeholder="Bairro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📍 Todos Bairros</SelectItem>
            {bairrosOptions.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.nicho || "all"} onValueChange={v => set("nicho", v)}>
          <SelectTrigger className="w-[160px] h-9 bg-secondary border-border">
            <SelectValue placeholder="Nicho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🏢 Todos Nichos</SelectItem>
            {NICHOS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.status || "all"} onValueChange={v => set("status", v)}>
          <SelectTrigger className="w-[155px] h-9 bg-secondary border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📊 Todos Status</SelectItem>
            <SelectItem value="novo">🆕 Novo</SelectItem>
            <SelectItem value="sem_contato">⬜ Sem contato</SelectItem>
            <SelectItem value="primeiro_contato">📞 Primeiro contato</SelectItem>
            <SelectItem value="em_conversa">💬 Em conversa</SelectItem>
            <SelectItem value="reuniao_agendada">📅 Reunião agendada</SelectItem>
            <SelectItem value="proposta_enviada">📄 Proposta enviada</SelectItem>
            <SelectItem value="em_negociacao">🤝 Em negociação</SelectItem>
            <SelectItem value="fechado">✅ Fechado</SelectItem>
            <SelectItem value="perdido">❌ Perdido</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.temperatura || "all"} onValueChange={v => set("temperatura", v)}>
          <SelectTrigger className="w-[120px] h-9 bg-secondary border-border">
            <SelectValue placeholder="Temp." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌡️ Todas</SelectItem>
            <SelectItem value="frio">❄️ Frio</SelectItem>
            <SelectItem value="morno">🌤 Morno</SelectItem>
            <SelectItem value="quente">🔥 Quente</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.potencial || "all"} onValueChange={v => set("potencial", v)}>
          <SelectTrigger className="w-[130px] h-9 bg-secondary border-border">
            <SelectValue placeholder="Potencial" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">💰 Todos</SelectItem>
            <SelectItem value="baixo">Baixo</SelectItem>
            <SelectItem value="medio">Médio</SelectItem>
            <SelectItem value="alto">Alto</SelectItem>
            <SelectItem value="premium">⭐ Premium</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.responsavel || "all"} onValueChange={v => set("responsavel", v)}>
          <SelectTrigger className="w-[140px] h-9 bg-secondary border-border">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">👤 Todos</SelectItem>
            <SelectItem value="sem_responsavel">Sem responsável</SelectItem>
            {RESPONSAVEIS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 shrink-0" onClick={() => onChange({ search: "", nicho: "", bairro: "", cidade: "", temperatura: "", status: "", potencial: "", responsavel: "" })}>
            <X className="h-4 w-4 mr-1" />Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
