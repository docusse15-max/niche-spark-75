import { Lead, COMERCIAIS } from "@/data/leads";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

interface ContactTimelineProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

interface TimelineEntry {
  lead: Lead;
  date: string;
  author: string;
  note: string;
  type: "past" | "today" | "future";
}

function getDateLabel(dateStr: string): string {
  const today = new Date();
  const date = new Date(dateStr + "T12:00:00");
  const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  if (diffDays > 1 && diffDays <= 7) return `Em ${diffDays} dias`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} dias atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function generatePlannedContacts(leads: Lead[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Past interactions from history
  leads.forEach(l => {
    l.historico.forEach(h => {
      if (h.date && h.author) {
        entries.push({
          lead: l,
          date: h.date,
          author: h.author,
          note: h.note,
          type: h.date < todayStr ? "past" : h.date === todayStr ? "today" : "future",
        });
      }
    });
  });

  // Generate planned contacts for leads without recent interaction
  const comerciais = [...COMERCIAIS];
  let cIdx = 0;
  leads.forEach((l, i) => {
    if (l.status === "fechado" || l.status === "perdido") return;
    if (l.historico.length > 0) return; // already has history, skip planned

    // Spread planned contacts over next 14 days
    const dayOffset = Math.floor(i / 8) + 1;
    if (dayOffset > 14) return;
    const planned = new Date(today);
    planned.setDate(planned.getDate() + dayOffset);
    const dateStr = planned.toISOString().split("T")[0];

    entries.push({
      lead: l,
      date: dateStr,
      author: l.responsavel || comerciais[cIdx % comerciais.length],
      note: `Primeiro contato planejado — ${l.segmento}`,
      type: dateStr === todayStr ? "today" : "future",
    });
    cIdx++;
  });

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

export default function ContactTimeline({ leads, onSelectLead }: ContactTimelineProps) {
  const entries = generatePlannedContacts(leads);

  // Group by date
  const grouped = new Map<string, TimelineEntry[]>();
  entries.forEach(e => {
    const existing = grouped.get(e.date) || [];
    existing.push(e);
    grouped.set(e.date, existing);
  });

  // Show only next 7 days + today + last 2 days
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() - 2);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 7);
  const minStr = minDate.toISOString().split("T")[0];
  const maxStr = maxDate.toISOString().split("T")[0];

  const visibleDates = Array.from(grouped.keys())
    .filter(d => d >= minStr && d <= maxStr)
    .sort();

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <h3 className="font-semibold text-sm mb-3 gold-text flex items-center gap-2">
        <Calendar className="h-4 w-4" /> Linha do Tempo de Contatos
      </h3>

      {visibleDates.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Nenhum contato planejado. Interaja com os leads para criar a linha do tempo.
        </p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {visibleDates.map(date => {
            const dayEntries = grouped.get(date) || [];
            const isToday = date === todayStr;
            const isPast = date < todayStr;

            return (
              <div key={date} className="relative">
                <div className={`flex items-center gap-2 mb-1.5 sticky top-0 bg-card z-10 py-0.5 ${isToday ? "gold-text font-bold" : isPast ? "text-muted-foreground" : "text-foreground"}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isToday ? "bg-primary animate-pulse" : isPast ? "bg-muted-foreground/40" : "bg-primary/60"}`} />
                  <span className="text-xs font-semibold">{getDateLabel(date)}</span>
                  <span className="text-[10px] text-muted-foreground">({dayEntries.length})</span>
                </div>
                <div className="ml-4 border-l border-border/50 pl-3 space-y-1.5">
                  {dayEntries.slice(0, 5).map((entry, i) => (
                    <div
                      key={`${entry.lead.id}-${i}`}
                      className={`flex items-start gap-2 p-1.5 rounded cursor-pointer hover:bg-muted/50 transition-colors ${isPast ? "opacity-60" : ""}`}
                      onClick={() => onSelectLead(entry.lead)}
                    >
                      <ArrowRight className="h-3 w-3 mt-0.5 text-primary/60 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-foreground truncate">{entry.lead.empresa}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <User className="h-2.5 w-2.5" />{entry.author}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">{entry.note}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {dayEntries.length > 5 && (
                    <p className="text-[10px] text-muted-foreground ml-5">+{dayEntries.length - 5} mais</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
