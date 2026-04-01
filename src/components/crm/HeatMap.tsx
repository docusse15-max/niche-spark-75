import { Lead, BAIRROS } from "@/data/leads";
import { cn } from "@/lib/utils";

interface HeatMapProps {
  leads: Lead[];
  selectedBairro: string;
  onSelectBairro: (b: string) => void;
}

export default function HeatMap({ leads, selectedBairro, onSelectBairro }: HeatMapProps) {
  const counts = BAIRROS.reduce((acc, b) => {
    acc[b] = leads.filter(l => l.bairro === b).length;
    return acc;
  }, {} as Record<string, number>);

  const max = Math.max(...Object.values(counts), 1);

  const getIntensity = (count: number) => {
    const ratio = count / max;
    if (ratio === 0) return "bg-muted/40 hover:bg-muted/60";
    if (ratio < 0.3) return "bg-blue-200 hover:bg-blue-300";
    if (ratio < 0.6) return "bg-blue-400 hover:bg-blue-500 text-white";
    return "bg-blue-600 hover:bg-blue-700 text-white";
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <h3 className="font-semibold text-sm p-4 pb-2">📍 Mapa de Calor — Campo Grande, MS</h3>
      <div className="relative">
        {/* Google Maps embed of Campo Grande */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d58880.26662508398!2d-54.6295!3d-20.4697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1711929600000"
          className="w-full h-[280px] border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de Campo Grande"
        />
        {/* Overlay with region buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="p-3">
        <p className="text-[10px] text-muted-foreground mb-2">Clique em uma região para filtrar os leads:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
          {BAIRROS.map(b => (
            <button
              key={b}
              onClick={() => onSelectBairro(selectedBairro === b ? "" : b)}
              className={cn(
                "rounded-md px-2 py-1.5 text-center transition-all cursor-pointer border-2 text-xs",
                getIntensity(counts[b]),
                selectedBairro === b ? "border-primary ring-2 ring-primary/30" : "border-transparent"
              )}
            >
              <span className="font-semibold">{b}</span>
              <span className="ml-1 font-bold">({counts[b]})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
