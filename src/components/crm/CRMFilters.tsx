import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { NICHOS, BAIRROS } from "@/data/leads";
import { X, Search } from "lucide-react";

export interface Filters {
  search: string;
  nicho: string;
  bairro: string;
  temperatura: string;
  status: string;
}

interface CRMFiltersProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export default function CRMFilters({ filters, onChange }: CRMFiltersProps) {
  const set = (key: keyof Filters, val: string) => onChange({ ...filters, [key]: val });
  const hasFilters = Object.values(filters).some(v => v !== "");

  return (
    <div className="flex flex-wrap gap-2 items-center p-3 bg-card rounded-lg border border-border">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar empresa..." value={filters.search} onChange={e => set("search", e.target.value)} className="pl-8 h-9 bg-secondary border-border" />
      </div>
      <Select value={filters.nicho} onValueChange={v => set("nicho", v)}>
        <SelectTrigger className="w-[160px] h-9 bg-secondary border-border"><SelectValue placeholder="Nicho" /></SelectTrigger>
        <SelectContent>{NICHOS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={filters.bairro} onValueChange={v => set("bairro", v)}>
        <SelectTrigger className="w-[160px] h-9 bg-secondary border-border"><SelectValue placeholder="Bairro" /></SelectTrigger>
        <SelectContent>{BAIRROS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={filters.temperatura} onValueChange={v => set("temperatura", v)}>
        <SelectTrigger className="w-[120px] h-9 bg-secondary border-border"><SelectValue placeholder="Temp." /></SelectTrigger>
        <SelectContent>
          <SelectItem value="frio">❄️ Frio</SelectItem>
          <SelectItem value="morno">🌤 Morno</SelectItem>
          <SelectItem value="quente">🔥 Quente</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.status} onValueChange={v => set("status", v)}>
        <SelectTrigger className="w-[160px] h-9 bg-secondary border-border"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="novo">Novo</SelectItem>
          <SelectItem value="sem_contato">Sem contato</SelectItem>
          <SelectItem value="primeiro_contato">Primeiro contato</SelectItem>
          <SelectItem value="em_conversa">Em conversa</SelectItem>
          <SelectItem value="reuniao_agendada">Reunião agendada</SelectItem>
          <SelectItem value="proposta_enviada">Proposta enviada</SelectItem>
          <SelectItem value="em_negociacao">Em negociação</SelectItem>
          <SelectItem value="fechado">Fechado</SelectItem>
          <SelectItem value="perdido">Perdido</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10" onClick={() => onChange({ search: "", nicho: "", bairro: "", temperatura: "", status: "" })}>
          <X className="h-4 w-4 mr-1" />Limpar
        </Button>
      )}
    </div>
  );
}
