import { Lead, BAIRROS } from "@/data/leads";
import { cn } from "@/lib/utils";

interface HeatMapProps {
  leads: Lead[];
  selectedBairro: string;
  onSelectBairro: (b: string) => void;
  selectedLeadId: string | null;
  onSelectLeadOnMap: (lead: Lead) => void;
}

const MAP_BOUNDS = {
  minLat: -20.53,
  maxLat: -20.42,
  minLng: -54.69,
  maxLng: -54.56,
};

function projectLeadToMap(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = (1 - (lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return {
    x: Math.max(2, Math.min(98, x)),
    y: Math.max(2, Math.min(98, y)),
  };
}

export default function HeatMap({ leads, selectedBairro, onSelectBairro, selectedLeadId, onSelectLeadOnMap }: HeatMapProps) {
  const counts = BAIRROS.reduce((acc, b) => {
    acc[b] = leads.filter((l) => l.bairro === b).length;
    return acc;
  }, {} as Record<string, number>);

  const max = Math.max(...Object.values(counts), 1);

  const getIntensity = (count: number) => {
    const ratio = count / max;
    if (ratio === 0) return "bg-secondary text-muted-foreground hover:bg-secondary/80";
    if (ratio < 0.3) return "bg-primary/15 text-primary hover:bg-primary/25";
    if (ratio < 0.6) return "bg-primary/30 text-primary hover:bg-primary/40";
    return "bg-primary/50 text-primary-foreground hover:bg-primary/60";
  };

  const visibleLeads = selectedBairro ? leads.filter((l) => l.bairro === selectedBairro) : leads;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <h3 className="font-semibold text-sm p-4 pb-2 gold-text">📍 Mapa de Leads — Campo Grande, MS</h3>

      <div className="relative h-[350px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d58880.26662508398!2d-54.6295!3d-20.4697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1711929600000"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de Campo Grande"
        />

        <div className="absolute inset-0 pointer-events-none">
          {visibleLeads.map((lead) => {
            if (!lead.lat || !lead.lng) return null;
            const { x, y } = projectLeadToMap(lead.lat, lead.lng);
            const selected = selectedLeadId === lead.id;

            return (
              <button
                key={lead.id}
                type="button"
                onClick={() => onSelectLeadOnMap(lead)}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all pointer-events-auto",
                  selected
                    ? "h-4 w-4 bg-primary border-primary-foreground ring-4 ring-primary/40"
                    : "h-3 w-3 bg-primary/80 border-background hover:scale-125",
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
                title={lead.empresa}
              />
            );
          })}
        </div>
      </div>

      <div className="p-3">
        <p className="text-[10px] text-muted-foreground mb-2">Filtrar por região:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
          {BAIRROS.map((b) => (
            <button
              key={b}
              onClick={() => onSelectBairro(selectedBairro === b ? "" : b)}
              className={cn(
                "rounded-md px-2 py-1.5 text-center transition-all cursor-pointer border text-xs font-medium",
                getIntensity(counts[b]),
                selectedBairro === b ? "border-primary ring-1 ring-primary/40" : "border-transparent",
              )}
            >
              <span>{b}</span>
              <span className="ml-1 font-bold">({counts[b]})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
