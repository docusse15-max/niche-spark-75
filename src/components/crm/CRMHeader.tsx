import { Button } from "@/components/ui/button";
import { Lead } from "@/data/leads";
import { RefreshCw, Plus, Download, Users, UserPlus, Phone, CalendarCheck, FileText, Trophy, MapPin, Sparkles } from "lucide-react";
import logoVfmoney from "@/assets/logo-vfmoney.png";

interface CRMHeaderProps {
  leads: Lead[];
  onNewLead: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onSearchLeads: () => void;
  belezaFilter?: boolean;
  onToggleBeleza?: () => void;
}

export default function CRMHeader({ leads, onNewLead, onRefresh, onExport, onSearchLeads }: CRMHeaderProps) {
  const stats = [
    { label: "Total de Leads", value: leads.length, icon: Users, accent: false },
    { label: "Novos", value: leads.filter(l => l.status === "novo").length, icon: UserPlus, accent: true },
    { label: "Em Contato", value: leads.filter(l => ["primeiro_contato", "em_conversa"].includes(l.status)).length, icon: Phone, accent: false },
    { label: "Reuniões", value: leads.filter(l => l.status === "reuniao_agendada").length, icon: CalendarCheck, accent: false },
    { label: "Propostas", value: leads.filter(l => l.status === "proposta_enviada").length, icon: FileText, accent: false },
    { label: "Fechadas", value: leads.filter(l => l.status === "fechado").length, icon: Trophy, accent: true },
  ];

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-card border gold-border gold-glow">
        <div className="flex items-center gap-3">
          <img src={logoVfmoney} alt="VF Money" className="h-11 w-auto" />
          <div>
            <h1 className="text-xl font-bold gold-text">Central Comercial de Leads</h1>
            <p className="text-xs text-muted-foreground">Recorrência Campo Grande — Prospecção · Acompanhamento · Fechamento</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onRefresh} className="border-border hover:border-primary hover:text-primary"><RefreshCw className="h-4 w-4 mr-1" />Atualizar</Button>
          <Button size="sm" onClick={onSearchLeads} className="gold-gradient text-background font-semibold hover:opacity-90"><MapPin className="h-4 w-4 mr-1" />Buscar no Google</Button>
          <Button size="sm" onClick={onNewLead} className="gold-gradient text-background font-semibold hover:opacity-90"><Plus className="h-4 w-4 mr-1" />Novo Lead</Button>
          <Button variant="outline" size="sm" onClick={onExport} className="border-border hover:border-primary hover:text-primary"><Download className="h-4 w-4 mr-1" />Exportar</Button>
        </div>
      </div>
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`p-3 flex items-center gap-3 rounded-lg border ${s.accent ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}`}>
            <s.icon className={`h-7 w-7 shrink-0 ${s.accent ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <p className={`text-2xl font-bold leading-none ${s.accent ? 'text-primary' : 'text-foreground'}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
