import { useState, useEffect, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { getInitialLeads, Lead, COMERCIAIS } from "@/data/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, Trash2,
  CheckCircle2, XCircle, AlertCircle, Phone, Building2
} from "lucide-react";

interface Visita {
  id: string;
  lead_id: string;
  lead_empresa: string;
  comercial: string;
  data_visita: string;
  duracao_min: number;
  status: string;
  notas: string | null;
  endereco: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: { label: "Pendente", color: "bg-amber-500/20 text-amber-400", icon: <AlertCircle className="h-3 w-3" /> },
  realizada: { label: "Realizada", color: "bg-emerald-500/20 text-emerald-400", icon: <CheckCircle2 className="h-3 w-3" /> },
  cancelada: { label: "Cancelada", color: "bg-red-500/20 text-red-400", icon: <XCircle className="h-3 w-3" /> },
};

export default function VisitCalendar() {
  const leads = useMemo(() => getInitialLeads(), []);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVisita, setEditingVisita] = useState<Visita | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formLeadId, setFormLeadId] = useState("");
  const [formComercial, setFormComercial] = useState("");
  const [formHora, setFormHora] = useState("09:00");
  const [formDuracao, setFormDuracao] = useState("30");
  const [formNotas, setFormNotas] = useState("");

  const fetchVisitas = async () => {
    const { data, error } = await supabase.from("visitas").select("*").order("data_visita", { ascending: true });
    if (!error && data) setVisitas(data);
    setLoading(false);
  };

  useEffect(() => { fetchVisitas(); }, []);

  // Calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const visitasByDate = useMemo(() => {
    const map = new Map<string, Visita[]>();
    visitas.forEach(v => {
      const key = format(new Date(v.data_visita), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(v);
    });
    return map;
  }, [visitas]);

  const selectedDateVisitas = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return (visitasByDate.get(key) || []).sort((a, b) => a.data_visita.localeCompare(b.data_visita));
  }, [selectedDate, visitasByDate]);

  // Today's visits
  const todayVisitas = useMemo(() => {
    const key = format(new Date(), "yyyy-MM-dd");
    return (visitasByDate.get(key) || [])
      .filter(v => v.status === "pendente")
      .sort((a, b) => a.data_visita.localeCompare(b.data_visita));
  }, [visitasByDate]);

  const openNewVisita = (date?: Date) => {
    setEditingVisita(null);
    setFormLeadId("");
    setFormComercial("");
    setFormHora("09:00");
    setFormDuracao("30");
    setFormNotas("");
    if (date) setSelectedDate(date);
    setDialogOpen(true);
  };

  const openEditVisita = (v: Visita) => {
    setEditingVisita(v);
    setFormLeadId(v.lead_id);
    setFormComercial(v.comercial);
    setFormHora(format(new Date(v.data_visita), "HH:mm"));
    setFormDuracao(String(v.duracao_min));
    setFormNotas(v.notas || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formLeadId || !formComercial || !selectedDate) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    const lead = leads.find(l => l.id === formLeadId);
    if (!lead) return;

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const dataVisita = `${dateStr}T${formHora}:00`;

    const record = {
      lead_id: lead.id,
      lead_empresa: lead.empresa,
      comercial: formComercial,
      data_visita: dataVisita,
      duracao_min: parseInt(formDuracao),
      notas: formNotas,
      endereco: lead.endereco || "",
      lat: lead.lat || null,
      lng: lead.lng || null,
    };

    if (editingVisita) {
      const { error } = await supabase.from("visitas").update(record).eq("id", editingVisita.id);
      if (error) { toast({ title: "Erro ao atualizar", variant: "destructive" }); return; }
      toast({ title: "Visita atualizada!" });
    } else {
      const { error } = await supabase.from("visitas").insert(record);
      if (error) { toast({ title: "Erro ao agendar", variant: "destructive" }); return; }
      toast({ title: "Visita agendada!", description: `${lead.empresa} — ${formHora}` });
    }
    setDialogOpen(false);
    fetchVisitas();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from("visitas").update({ status }).eq("id", id);
    fetchVisitas();
    toast({ title: `Visita marcada como ${STATUS_CONFIG[status]?.label || status}` });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("visitas").delete().eq("id", id);
    fetchVisitas();
    toast({ title: "Visita removida" });
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" /> Agenda de Visitas
          </h1>
          <p className="text-sm text-muted-foreground">Agende e acompanhe visitas aos leads</p>
        </div>
        <Button onClick={() => { setSelectedDate(new Date()); openNewVisita(new Date()); }}>
          <Plus className="h-4 w-4 mr-1" /> Nova Visita
        </Button>
      </div>

      {/* Today summary */}
      {todayVisitas.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-3">
            <p className="text-xs font-semibold text-primary mb-2">📅 Visitas de Hoje — {format(new Date(), "dd/MM/yyyy")}</p>
            <div className="flex flex-wrap gap-2">
              {todayVisitas.map(v => (
                <Badge key={v.id} variant="outline" className="text-xs cursor-pointer hover:bg-muted" onClick={() => { setSelectedDate(new Date()); }}>
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(v.data_visita), "HH:mm")} — {v.lead_empresa} ({v.comercial})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-base capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week headers */}
            <div className="grid grid-cols-7 mb-1">
              {weekDays.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {calendarDays.map(day => {
                const key = format(day, "yyyy-MM-dd");
                const dayVisitas = visitasByDate.get(key) || [];
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const pending = dayVisitas.filter(v => v.status === "pendente").length;
                const done = dayVisitas.filter(v => v.status === "realizada").length;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[80px] p-1 cursor-pointer transition-colors bg-card hover:bg-muted/50
                      ${!isCurrentMonth ? "opacity-40" : ""}
                      ${isSelected ? "ring-2 ring-primary ring-inset" : ""}
                      ${isToday(day) ? "bg-primary/5" : ""}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${isToday(day) ? "text-primary font-bold" : "text-foreground"}`}>
                        {format(day, "d")}
                      </span>
                      {dayVisitas.length > 0 && (
                        <div className="flex gap-0.5">
                          {pending > 0 && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                          {done > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                      )}
                    </div>
                    <div className="mt-0.5 space-y-0.5">
                      {dayVisitas.slice(0, 3).map(v => (
                        <div
                          key={v.id}
                          className={`text-[9px] px-1 py-0.5 rounded truncate ${
                            v.status === "realizada" ? "bg-emerald-500/20 text-emerald-400" :
                            v.status === "cancelada" ? "bg-red-500/20 text-red-400 line-through" :
                            "bg-primary/10 text-primary"
                          }`}
                        >
                          {format(new Date(v.data_visita), "HH:mm")} {v.lead_empresa.split(" ")[0]}
                        </div>
                      ))}
                      {dayVisitas.length > 3 && (
                        <span className="text-[9px] text-muted-foreground">+{dayVisitas.length - 3} mais</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day detail */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>
                {selectedDate
                  ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
                  : "Selecione um dia"}
              </span>
              {selectedDate && (
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openNewVisita(selectedDate)}>
                  <Plus className="h-3 w-3 mr-1" /> Agendar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {selectedDateVisitas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhuma visita agendada</p>
                  {selectedDate && (
                    <Button variant="link" size="sm" className="mt-2" onClick={() => openNewVisita(selectedDate)}>
                      Agendar visita
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateVisitas.map(v => {
                    const sc = STATUS_CONFIG[v.status] || STATUS_CONFIG.pendente;
                    return (
                      <div key={v.id} className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                              {v.lead_empresa}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{format(new Date(v.data_visita), "HH:mm")}</span>
                              <span>{v.duracao_min}min</span>
                              <span className="flex items-center gap-0.5"><User className="h-3 w-3" />{v.comercial}</span>
                            </div>
                          </div>
                          <Badge className={`${sc.color} border-0 text-[10px] flex items-center gap-0.5`}>
                            {sc.icon} {sc.label}
                          </Badge>
                        </div>

                        {v.endereco && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" /> {v.endereco}
                          </p>
                        )}
                        {v.notas && <p className="text-[10px] text-muted-foreground italic">💬 {v.notas}</p>}

                        <div className="flex items-center gap-1 pt-1">
                          {v.status === "pendente" && (
                            <>
                              <Button variant="outline" size="sm" className="h-6 text-[10px] text-emerald-500" onClick={() => handleStatusChange(v.id, "realizada")}>
                                <CheckCircle2 className="h-3 w-3 mr-0.5" /> Realizada
                              </Button>
                              <Button variant="outline" size="sm" className="h-6 text-[10px] text-red-400" onClick={() => handleStatusChange(v.id, "cancelada")}>
                                <XCircle className="h-3 w-3 mr-0.5" /> Cancelar
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => openEditVisita(v)}>
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive" onClick={() => handleDelete(v.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* New/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingVisita ? "Editar Visita" : "Agendar Nova Visita"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label className="text-xs">Lead / Empresa</Label>
              <Select value={formLeadId} onValueChange={setFormLeadId}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecione o lead" /></SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {leads.slice(0, 100).map(l => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.empresa} — {l.segmento}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Comercial</Label>
                <Select value={formComercial} onValueChange={setFormComercial}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {COMERCIAIS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Data</Label>
                <Input value={selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""} readOnly className="h-9 text-xs bg-muted/50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Horário</Label>
                <Input type="time" value={formHora} onChange={e => setFormHora(e.target.value)} className="h-9" />
              </div>
              <div>
                <Label className="text-xs">Duração (min)</Label>
                <Select value={formDuracao} onValueChange={setFormDuracao}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[15, 30, 45, 60, 90, 120].map(m => (
                      <SelectItem key={m} value={String(m)}>{m} min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Observações</Label>
              <Textarea value={formNotas} onChange={e => setFormNotas(e.target.value)} placeholder="Notas sobre a visita..." className="h-16 text-xs" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingVisita ? "Salvar" : "Agendar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
