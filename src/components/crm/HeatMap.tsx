import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Lead } from "@/data/leads";
import { CIDADES } from "@/data/cities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeatMapProps {
  leads: Lead[];
  selectedBairro: string;
  onSelectBairro: (b: string) => void;
  selectedLeadId: string | null;
  onSelectLeadOnMap: (lead: Lead) => void;
}

export default function HeatMap({ leads, selectedBairro, onSelectBairro, selectedLeadId, onSelectLeadOnMap }: HeatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const selectedCityRef = useRef<string>("all");

  const visibleLeads = useMemo(() => {
    return selectedBairro ? leads.filter(l => l.bairro === selectedBairro) : leads;
  }, [leads, selectedBairro]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-21.5, -55.5],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstance.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    visibleLeads.forEach(lead => {
      if (!lead.lat || !lead.lng) return;
      
      const isSelected = selectedLeadId === lead.id;
      const color = isSelected ? "#D4AF37" : "#8B6914";
      const radius = isSelected ? 10 : 6;
      const fillOpacity = isSelected ? 1 : 0.7;

      const marker = L.circleMarker([lead.lat, lead.lng], {
        radius,
        fillColor: color,
        color: isSelected ? "#FFD700" : "#5a4510",
        weight: isSelected ? 3 : 1,
        fillOpacity,
      });

      marker.bindTooltip(`<strong>${lead.empresa}</strong><br/>${lead.segmento}<br/>${lead.bairro} - ${lead.cidade}`, {
        direction: "top",
        offset: [0, -8],
      });

      marker.on("click", () => {
        onSelectLeadOnMap(lead);
      });

      marker.addTo(markersRef.current!);
    });
  }, [visibleLeads, selectedLeadId, onSelectLeadOnMap]);

  // Fly to selected lead
  useEffect(() => {
    if (!mapInstance.current || !selectedLeadId) return;
    const lead = leads.find(l => l.id === selectedLeadId);
    if (lead?.lat && lead?.lng) {
      mapInstance.current.flyTo([lead.lat, lead.lng], 14, { duration: 0.8 });
    }
  }, [selectedLeadId, leads]);

  const handleCityFilter = (city: string) => {
    selectedCityRef.current = city;
    if (city === "all") {
      mapInstance.current?.flyTo([-21.5, -55.5], 7, { duration: 0.8 });
    } else {
      const cityLeads = leads.filter(l => l.cidade === city);
      if (cityLeads.length > 0) {
        const bounds = L.latLngBounds(cityLeads.filter(l => l.lat && l.lng).map(l => [l.lat!, l.lng!]));
        mapInstance.current?.flyToBounds(bounds, { padding: [30, 30], duration: 0.8 });
      }
    }
    onSelectBairro("");
  };

  // Count leads per city
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of CIDADES) counts[c] = leads.filter(l => l.cidade === c).length;
    return counts;
  }, [leads]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="font-semibold text-sm gold-text">📍 Mapa de Leads — Mato Grosso do Sul</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{visibleLeads.length} leads visíveis</span>
          <Select defaultValue="all" onValueChange={handleCityFilter}>
            <SelectTrigger className="w-[150px] h-7 text-xs bg-secondary border-border">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Cidades</SelectItem>
              {CIDADES.map(c => (
                <SelectItem key={c} value={c}>{c} ({cityCounts[c]})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div ref={mapRef} className="h-[400px] w-full" style={{ zIndex: 1 }} />

      <div className="p-3">
        <p className="text-[10px] text-muted-foreground mb-1">
          Clique nos pontos para ver detalhes do lead. Use scroll para zoom.
        </p>
      </div>
    </div>
  );
}
