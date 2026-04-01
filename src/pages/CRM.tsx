import { useState, useMemo, useCallback } from "react";
import { Lead, LeadStatus, getInitialLeads, saveLeads, addActivityLog } from "@/data/leads";
import CRMHeader from "@/components/crm/CRMHeader";
import CRMFilters, { Filters } from "@/components/crm/CRMFilters";
import HeatMap from "@/components/crm/HeatMap";
import LeadsTable from "@/components/crm/LeadsTable";
import LeadDetailSheet from "@/components/crm/LeadDetailSheet";
import DailyPriorities from "@/components/crm/DailyPriorities";
import SalesArguments from "@/components/crm/SalesArguments";
import ProductivityPanel from "@/components/crm/ProductivityPanel";
import ComercialRanking from "@/components/crm/ComercialRanking";
import ContactTimeline from "@/components/crm/ContactTimeline";
import NewLeadDialog from "@/components/crm/NewLeadDialog";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EMPTY_FILTERS: Filters = { search: "", nicho: "", bairro: "", cidade: "", temperatura: "", status: "" };

interface CRMProps {
  currentUser: string;
  onLogout: () => void;
}

export default function CRM({ currentUser, onLogout }: CRMProps) {
  const [leads, setLeads] = useState<Lead[]>(getInitialLeads);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const navigate = useNavigate();

  const persist = useCallback((updated: Lead[]) => {
    setLeads(updated);
    saveLeads(updated);
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (filters.search && !l.empresa.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.nicho && l.segmento !== filters.nicho) return false;
      if (filters.bairro && l.bairro !== filters.bairro) return false;
      if (filters.cidade && l.cidade !== filters.cidade) return false;
      if (filters.temperatura && l.temperatura !== filters.temperatura) return false;
      if (filters.status && l.status !== filters.status) return false;
      return true;
    });
  }, [leads, filters]);

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setSelectedLeadId(lead.id);
    setSheetOpen(true);
  };

  const handleSelectLeadOnMap = (lead: Lead) => {
    setSelectedLeadId(lead.id);
    setSelectedLead(lead);
    setSheetOpen(true);
  };

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    const lead = leads.find(l => l.id === id);
    const updated = leads.map(l => l.id === id ? { ...l, status, ultimoContato: new Date().toISOString().split("T")[0] } : l);
    persist(updated);
    if (lead) {
      addActivityLog({ action: "status_alterado", leadEmpresa: lead.empresa, leadId: id, author: currentUser, details: `Status → ${status}` });
    }
    toast({ title: "Status atualizado" });
  };

  const handleAddNote = (id: string, note: string, author: string) => {
    const updated = leads.map(l => {
      if (l.id !== id) return l;
      return {
        ...l,
        historico: [...l.historico, { date: new Date().toISOString().split("T")[0], type: "Anotação", note, author }],
      };
    });
    persist(updated);
    const updatedLead = updated.find(l => l.id === id);
    if (updatedLead) {
      setSelectedLead(updatedLead);
      addActivityLog({ action: "nota_adicionada", leadEmpresa: updatedLead.empresa, leadId: id, author, details: note });
    }
    toast({ title: "Anotação registrada", description: `por ${author}` });
  };

  const handleNewLead = (lead: Lead) => {
    persist([lead, ...leads]);
    addActivityLog({ action: "lead_criado", leadEmpresa: lead.empresa, leadId: lead.id, author: currentUser, details: `${lead.segmento} · ${lead.bairro}` });
    toast({ title: "Lead adicionado!", description: lead.empresa });
  };

  const handleDeleteLead = (id: string) => {
    const lead = leads.find(l => l.id === id);
    const updated = leads.filter(l => l.id !== id);
    persist(updated);
    if (lead) {
      addActivityLog({ action: "lead_excluido", leadEmpresa: lead.empresa, leadId: id, author: currentUser, details: "Lead removido" });
    }
    toast({ title: "Lead excluído" });
  };

  const handleExport = () => {
    const headers = ["Empresa", "Segmento", "Bairro", "Telefone", "Instagram", "Potencial", "Temperatura", "Status"];
    const rows = leads.map(l => [l.empresa, l.segmento, l.bairro, l.telefone, l.instagram, l.potencial, l.temperatura, l.status]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leads-recorrencia-cg.csv"; a.click();
    URL.revokeObjectURL(url);
    addActivityLog({ action: "lead_exportado", leadEmpresa: "Base completa", leadId: "", author: currentUser, details: `${leads.length} leads exportados` });
    toast({ title: "Base exportada!" });
  };

  const handleBairroFilter = (bairro: string) => {
    setFilters(f => ({ ...f, bairro }));
    setSelectedLeadId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CRMHeader leads={leads} onNewLead={() => setNewLeadOpen(true)} onRefresh={() => { persist(getInitialLeads()); toast({ title: "Base atualizada" }); }} onExport={handleExport} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1"><CRMFilters filters={filters} onChange={setFilters} /></div>
          <Button variant="outline" size="sm" className="ml-2 shrink-0" onClick={() => navigate("/log")}>
            <ScrollText className="h-4 w-4 mr-1" />Log
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <HeatMap leads={leads} selectedBairro={filters.bairro} onSelectBairro={handleBairroFilter} selectedLeadId={selectedLeadId} onSelectLeadOnMap={handleSelectLeadOnMap} />
            <LeadsTable leads={filteredLeads} onSelectLead={handleSelectLead} onUpdateStatus={handleUpdateStatus} />
          </div>
          <div className="space-y-4">
            <ComercialRanking leads={leads} />
            <ContactTimeline leads={leads} onSelectLead={handleSelectLead} />
            <DailyPriorities leads={leads} onSelectLead={handleSelectLead} />
            <ProductivityPanel leads={leads} />
            <SalesArguments />
          </div>
        </div>
      </div>

      <LeadDetailSheet lead={selectedLead} open={sheetOpen} onClose={() => setSheetOpen(false)} onAddNote={handleAddNote} onDeleteLead={handleDeleteLead} />
      <NewLeadDialog open={newLeadOpen} onClose={() => setNewLeadOpen(false)} onSave={handleNewLead} />
    </div>
  );
}
