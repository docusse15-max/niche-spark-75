import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Lead } from "@/data/leads";
import { CIDADES, CIDADE_CONFIGS, type Cidade } from "@/data/cities";
import { cn } from "@/lib/utils";

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
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const visibleLeads = useMemo(() => {
    let filtered = leads;
    if (selectedCity !== "all") filtered = filtered.filter(l => l.cidade === selectedCity);
    if (selectedBairro) filtered = filtered.filter(l => l.bairro === selectedBairro);
    return filtered;
  }, [leads, selectedCity, selectedBairro]);

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
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstance.current || !markersRef.current) return;
    markersRef.current.clearLayers();
    visibleLeads.forEach(lead => {
      if (!lead.lat || !lead.lng) return;
      const isSelected = selectedLeadId === lead.id;
      const marker = L.circleMarker([lead.lat, lead.lng], {
        radius: isSelected ? 10 : 6,
        fillColor: isSelected ? "#D4AF37" : "#8B6914",
        color: isSelected ? "#FFD700" : "#5a4510",
        weight: isSelected ? 3 : 1,
        fillOpacity: isSelected ? 1 : 0.7,
      });
      marker.bindTooltip(`<strong>${lead.empresa}</strong><br/>${lead.segmento}<br/>${lead.bairro} · ${lead.cidade}`, { direction: "top", offset: [0, -8] });
      marker.on("click", () => onSelectLeadOnMap(lead));
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

  const handleCityClick = useCallback((city: string) => {
    const next = selectedCity === city ? "all" : city;
    setSelectedCity(next);
    onSelectBairro("");
    if (next === "all") {
      mapInstance.current?.flyTo([-21.5, -55.5], 7, { duration: 0.8 });
    } else {
      const cityLeads = leads.filter(l => l.cidade === next && l.lat && l.lng);
      if (cityLeads.length > 0) {
        const bounds = L.latLngBounds(cityLeads.map(l => [l.lat!, l.lng!]));
        mapInstance.current?.flyToBounds(bounds, { padding: [30, 30], duration: 0.8 });
      }
    }
  }, [selectedCity, leads, onSelectBairro]);

  const handleBairroClick = useCallback((bairro: string) => {
    const next = selectedBairro === bairro ? "" : bairro;
    onSelectBairro(next);
    if (next && selectedCity !== "all") {
      const config = CIDADE_CONFIGS[selectedCity as Cidade];
      const b = config?.bairros.find(x => x.nome === next);
      if (b) mapInstance.current?.flyTo(b.coords, 14, { duration: 0.8 });
    }
  }, [selectedBairro, selectedCity, onSelectBairro]);

  // Counts
  const cityCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const city of CIDADES) c[city] = leads.filter(l => l.cidade === city).length;
    return c;
  }, [leads]);

  const bairrosForCity = useMemo(() => {
    if (selectedCity === "all") return [];
    return CIDADE_CONFIGS[selectedCity as Cidade]?.bairros || [];
  }, [selectedCity]);

  const bairroCounts = useMemo(() => {
    if (selectedCity === "all") return {};
    const c: Record<string, number> = {};
    const cityLeads = leads.filter(l => l.cidade === selectedCity);
    for (const b of bairrosForCity) c[b.nome] = cityLeads.filter(l => l.bairro === b.nome).length;
    return c;
  }, [leads, selectedCity, bairrosForCity]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="font-semibold text-sm gold-text">📍 Mapa de Leads — MS</h3>
        <span className="text-[10px] text-muted-foreground">{visibleLeads.length} leads visíveis</span>
      </div>

      <div ref={mapRef} className="h-[400px] w-full" style={{ zIndex: 1 }} />

      {/* City filter buttons */}
      <div className="p-3 space-y-2">
        <p className="text-[10px] text-muted-foreground">Filtrar por cidade:</p>
        <div className="flex flex-wrap gap-1.5">
          {CIDADES.map(c => (
            <button
              key={c}
              onClick={() => handleCityClick(c)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer border",
                selectedCity === c
                  ? "bg-primary/30 text-primary border-primary ring-1 ring-primary/40"
                  : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"
              )}
            >
              {c} <span className="font-bold">({cityCounts[c]})</span>
            </button>
          ))}
        </div>

        {/* Bairro filter when city selected */}
        {bairrosForCity.length > 0 && (
          <>
            <p className="text-[10px] text-muted-foreground mt-2">Bairros de {selectedCity}:</p>
            <div className="flex flex-wrap gap-1.5">
              {bairrosForCity.map(b => (
                <button
                  key={b.nome}
                  onClick={() => handleBairroClick(b.nome)}
                  className={cn(
                    "rounded-md px-2 py-1 text-[11px] font-medium transition-all cursor-pointer border",
                    selectedBairro === b.nome
                      ? "bg-primary/25 text-primary border-primary ring-1 ring-primary/30"
                      : "bg-secondary/60 text-muted-foreground border-transparent hover:bg-secondary/80"
                  )}
                >
                  {b.nome} <span className="font-bold">({bairroCounts[b.nome] || 0})</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
