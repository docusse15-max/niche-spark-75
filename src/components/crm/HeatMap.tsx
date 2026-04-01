import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Lead, BAIRROS, BAIRRO_COORDS } from "@/data/leads";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const selectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface HeatMapProps {
  leads: Lead[];
  selectedBairro: string;
  onSelectBairro: (b: string) => void;
  selectedLeadId: string | null;
  onSelectLeadOnMap: (lead: Lead) => void;
}

function FlyToLead({ lead }: { lead: Lead | null }) {
  const map = useMap();
  useEffect(() => {
    if (lead?.lat && lead?.lng) {
      map.flyTo([lead.lat, lead.lng], 15, { duration: 0.8 });
    }
  }, [lead, map]);
  return null;
}

function FlyToBairro({ bairro }: { bairro: string }) {
  const map = useMap();
  useEffect(() => {
    if (bairro && BAIRRO_COORDS[bairro as keyof typeof BAIRRO_COORDS]) {
      const coords = BAIRRO_COORDS[bairro as keyof typeof BAIRRO_COORDS];
      map.flyTo(coords, 14, { duration: 0.8 });
    } else if (!bairro) {
      map.flyTo([-20.4697, -54.6201], 12, { duration: 0.8 });
    }
  }, [bairro, map]);
  return null;
}

export default function HeatMap({ leads, selectedBairro, onSelectBairro, selectedLeadId, onSelectLeadOnMap }: HeatMapProps) {
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

  const visibleLeads = selectedBairro ? leads.filter(l => l.bairro === selectedBairro) : leads;
  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <h3 className="font-semibold text-sm p-4 pb-2">📍 Mapa de Leads — Campo Grande, MS</h3>
      <div className="relative h-[350px]">
        <MapContainer
          center={[-20.4697, -54.6201]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToLead lead={selectedLead} />
          <FlyToBairro bairro={selectedBairro} />
          {visibleLeads.map(lead => (
            lead.lat && lead.lng ? (
              <Marker
                key={lead.id}
                position={[lead.lat, lead.lng]}
                icon={lead.id === selectedLeadId ? selectedIcon : defaultIcon}
                eventHandlers={{
                  click: () => onSelectLeadOnMap(lead),
                }}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold">{lead.empresa}</p>
                    <p>{lead.segmento}</p>
                    <p className="text-muted-foreground">{lead.bairro}</p>
                  </div>
                </Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>
      </div>
      <div className="p-3">
        <p className="text-[10px] text-muted-foreground mb-2">Filtrar por região:</p>
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
