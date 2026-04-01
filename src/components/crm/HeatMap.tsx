import { Lead, Bairro, BAIRROS } from "@/data/leads";
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
    if (ratio === 0) return "bg-muted/40";
    if (ratio < 0.3) return "bg-blue-200 hover:bg-blue-300";
    if (ratio < 0.6) return "bg-blue-400 hover:bg-blue-500 text-white";
    return "bg-blue-600 hover:bg-blue-700 text-white";
  };

  return (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-semibold text-sm mb-3">📍 Mapa de Calor — Campo Grande</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {BAIRROS.map(b => (
          <button
            key={b}
            onClick={() => onSelectBairro(selectedBairro === b ? "" : b)}
            className={cn(
              "rounded-lg p-3 text-center transition-all cursor-pointer border-2",
              getIntensity(counts[b]),
              selectedBairro === b ? "border-primary ring-2 ring-primary/30" : "border-transparent"
            )}
          >
            <p className="font-semibold text-sm leading-tight">{b}</p>
            <p className="text-lg font-bold">{counts[b]}</p>
            <p className="text-[10px] opacity-80">leads</p>
          </button>
        ))}
      </div>
    </div>
  );
}
