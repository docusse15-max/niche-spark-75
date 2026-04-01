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

export default function LeadsTable({ leads, onSelectLead, onUpdateStatus }: LeadsTableProps) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-sm">📋 Leads ({leads.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Empresa</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Bairro</TableHead>
              <TableHead>Potencial</TableHead>
              <TableHead>Temp.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última interação</TableHead>
              <TableHead>Próxima Ação</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Nenhum lead encontrado</TableCell></TableRow>
            )}
            {leads.map(lead => (
              <TableRow key={lead.id} className="cursor-pointer" onClick={() => onSelectLead(lead)}>
                <TableCell className="font-medium">{lead.empresa}</TableCell>
                <TableCell><span className="text-xs">{lead.segmento}</span></TableCell>
                <TableCell><span className="text-xs">{lead.bairro}</span></TableCell>
                <TableCell><Badge variant="outline" className={`text-[10px] ${POTENTIAL_COLORS[lead.potencial]}`}>{lead.potencial.toUpperCase()}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={`text-[10px] ${TEMP_COLORS[lead.temperatura]}`}>{lead.temperatura === "frio" ? "❄️" : lead.temperatura === "morno" ? "🌤" : "🔥"} {lead.temperatura}</Badge></TableCell>
                <TableCell><Badge className={`text-[10px] ${STATUS_COLORS[lead.status]}`}>{STATUS_LABELS[lead.status]}</Badge></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{getLastAuthor(lead)}</span></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{lead.proximaAcao}</span></TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
