import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lead } from "@/data/leads";
import { RefreshCw, Plus, Download, Users, UserPlus, Phone, CalendarCheck, FileText, Trophy } from "lucide-react";

interface CRMHeaderProps {
  leads: Lead[];
  onNewLead: () => void;
  onRefresh: () => void;
  onExport: () => void;
}

export default function CRMHeader({ leads, onNewLead, onRefresh, onExport }: CRMHeaderProps) {
  const stats = [
    { label: "Total de Leads", value: leads.length, icon: Users, color: "text-blue-600" },
    { label: "Novos", value: leads.filter(l => l.status === "novo").length, icon: UserPlus, color: "text-emerald-600" },
    { label: "Em Contato", value: leads.filter(l => ["primeiro_contato", "em_conversa"].includes(l.status)).length, icon: Phone, color: "text-amber-600" },
    { label: "Reuniões", value: leads.filter(l => l.status === "reuniao_agendada").length, icon: CalendarCheck, color: "text-purple-600" },
    { label: "Propostas", value: leads.filter(l => l.status === "proposta_enviada").length, icon: FileText, color: "text-indigo-600" },
    { label: "Fechadas", value: leads.filter(l => l.status === "fechado").length, icon: Trophy, color: "text-green-600" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Central Comercial de Leads</h1>
          <p className="text-sm text-muted-foreground">Recorrência Campo Grande — Base estruturada para prospecção, acompanhamento e fechamento</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4 mr-1" />Atualizar</Button>
          <Button size="sm" onClick={onNewLead}><Plus className="h-4 w-4 mr-1" />Novo Lead</Button>
          <Button variant="outline" size="sm" onClick={onExport}><Download className="h-4 w-4 mr-1" />Exportar</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="p-3 flex items-center gap-3">
            <s.icon className={`h-8 w-8 ${s.color} shrink-0`} />
            <div>
              <p className="text-2xl font-bold leading-none">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
