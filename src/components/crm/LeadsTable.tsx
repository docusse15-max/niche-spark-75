import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Lead, STATUS_LABELS, STATUS_COLORS, TEMP_COLORS, POTENTIAL_COLORS, LeadStatus } from "@/data/leads";
import { MoreVertical, Eye, MessageSquare, Clock, FileText, Trophy } from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

function getLastAuthor(lead: Lead): string {
  if (lead.historico.length === 0) return "—";
  const last = lead.historico[lead.historico.length - 1];
  return last.author || "—";
}

// Dark-friendly status colors
const DARK_STATUS: Record<LeadStatus, string> = {
  novo: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  sem_contato: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  primeiro_contato: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  em_conversa: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  reuniao_agendada: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  proposta_enviada: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  em_negociacao: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  fechado: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  perdido: "bg-red-500/20 text-red-400 border-red-500/30",
};

const DARK_TEMP: Record<string, string> = {
  frio: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  morno: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  quente: "bg-red-500/20 text-red-400 border-red-500/30",
};

const DARK_POTENTIAL: Record<string, string> = {
  baixo: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  medio: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  alto: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  premium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export default function LeadsTable({ leads, onSelectLead, onUpdateStatus }: LeadsTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm"><span className="gold-text">📋 Leads</span> <span className="text-muted-foreground">({leads.length})</span></h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="min-w-[180px] text-muted-foreground">Empresa</TableHead>
              <TableHead className="text-muted-foreground">Segmento</TableHead>
              <TableHead className="text-muted-foreground">Bairro</TableHead>
              <TableHead className="text-muted-foreground">Potencial</TableHead>
              <TableHead className="text-muted-foreground">Temp.</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Última interação</TableHead>
              <TableHead className="text-muted-foreground">Próxima Ação</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Nenhum lead encontrado</TableCell></TableRow>
            )}
            {leads.map(lead => (
              <TableRow key={lead.id} className="cursor-pointer border-border hover:bg-primary/5" onClick={() => onSelectLead(lead)}>
                <TableCell className="font-medium text-foreground">{lead.empresa}</TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{lead.segmento}</span></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{lead.bairro} · {lead.cidade}</span></TableCell>
                <TableCell><Badge variant="outline" className={`text-[10px] border ${DARK_POTENTIAL[lead.potencial]}`}>{lead.potencial.toUpperCase()}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={`text-[10px] border ${DARK_TEMP[lead.temperatura]}`}>{lead.temperatura === "frio" ? "❄️" : lead.temperatura === "morno" ? "🌤" : "🔥"} {lead.temperatura}</Badge></TableCell>
                <TableCell><Badge className={`text-[10px] border ${DARK_STATUS[lead.status]}`}>{STATUS_LABELS[lead.status]}</Badge></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{getLastAuthor(lead)}</span></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{lead.proximaAcao || "—"}</span></TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem onClick={() => onSelectLead(lead)}><Eye className="h-4 w-4 mr-2" />Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "primeiro_contato")}><MessageSquare className="h-4 w-4 mr-2" />Registrar contato</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "reuniao_agendada")}><Clock className="h-4 w-4 mr-2" />Agendar follow-up</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "proposta_enviada")}><FileText className="h-4 w-4 mr-2" />Proposta enviada</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "fechado")}><Trophy className="h-4 w-4 mr-2" />Venda fechada</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
