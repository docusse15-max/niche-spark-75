import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { Lead } from "@/data/leads";
import { CIDADES, CIDADE_CONFIGS, type Cidade } from "@/data/cities";
import { cn } from "@/lib/utils";
import { MapPin, Navigation, MessageSquare, Star } from "lucide-react";

const GOOGLE_MAPS_KEY = "AIzaSyAPHdxmB8MWTBHHulY7YKjWpf7l5clpUps";

const containerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: -17.5, lng: -52.0 };

interface HeatMapProps {
  leads: Lead[];
  selectedBairro: string;
  onSelectBairro: (b: string) => void;
  selectedCity?: string;
  onSelectCity?: (c: string) => void;
  selectedLeadId: string | null;
  onSelectLeadOnMap: (lead: Lead) => void;
}

export default function HeatMap({ leads, selectedBairro, onSelectBairro, selectedCity: selectedCityProp, onSelectCity, selectedLeadId, onSelectLeadOnMap }: HeatMapProps) {
  const selectedCity = selectedCityProp && selectedCityProp !== "" ? selectedCityProp : "all";
  const [infoLead, setInfoLead] = useState<Lead | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_KEY,
  });

  const visibleLeads = useMemo(() => {
    let filtered = leads;
    if (selectedCity !== "all") filtered = filtered.filter(l => l.cidade === selectedCity);
    if (selectedBairro) {
      filtered = filtered.filter(l => {
        const parts = (l.bairro || "").split(" - ");
        const name = parts.length >= 2 ? parts[parts.length - 1].trim() : (l.bairro || "").trim();
        return name === selectedBairro || l.bairro === selectedBairro;
      });
    }
    return filtered;
  }, [leads, selectedCity, selectedBairro]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    // Auto-fit bounds to all leads with coordinates
    const withCoords = leads.filter(l => l.lat && l.lng);
    if (withCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      withCoords.forEach(l => bounds.extend({ lat: l.lat!, lng: l.lng! }));
      map.fitBounds(bounds, 60);
    }
  }, [leads]);

  // Fly to selected lead
  useEffect(() => {
    if (!mapRef.current || !selectedLeadId) return;
    const lead = leads.find(l => l.id === selectedLeadId);
    if (lead?.lat && lead?.lng) {
      mapRef.current.panTo({ lat: lead.lat, lng: lead.lng });
      mapRef.current.setZoom(15);
      setInfoLead(lead);
    }
  }, [selectedLeadId, leads]);

  const handleCityClick = useCallback((city: string) => {
    const next = selectedCity === city ? "all" : city;
    onSelectCity?.(next === "all" ? "" : next);
    onSelectBairro("");
    if (!mapRef.current) return;
    if (next === "all") {
      mapRef.current.panTo(defaultCenter);
      mapRef.current.setZoom(7);
    } else {
      const cityLeads = leads.filter(l => l.cidade === next && l.lat && l.lng);
      if (cityLeads.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        cityLeads.forEach(l => bounds.extend({ lat: l.lat!, lng: l.lng! }));
        mapRef.current.fitBounds(bounds, 40);
      }
    }
  }, [selectedCity, leads, onSelectBairro, onSelectCity]);

  const handleBairroClick = useCallback((bairro: string) => {
    const next = selectedBairro === bairro ? "" : bairro;
    onSelectBairro(next);
    if (next && selectedCity !== "all" && mapRef.current) {
      const config = CIDADE_CONFIGS[selectedCity as Cidade];
      const b = config?.bairros.find(x => x.nome === next);
      if (b) {
        mapRef.current.panTo({ lat: b.coords[0], lng: b.coords[1] });
        mapRef.current.setZoom(14);
      }
    }
  }, [selectedBairro, selectedCity, onSelectBairro]);

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

  const getWhatsAppUrl = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.startsWith("55") ? `https://wa.me/${cleaned}` : `https://wa.me/55${cleaned}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="font-semibold text-sm gold-text">📍 Mapa de Leads — Google Maps</h3>
        <span className="text-[10px] text-muted-foreground">{visibleLeads.length} leads visíveis</span>
      </div>

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={7}
          onLoad={onLoad}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          }}
        >
          {visibleLeads.map(lead => {
            if (!lead.lat || !lead.lng) return null;
            const isSelected = selectedLeadId === lead.id;
            return (
              <MarkerF
                key={lead.id}
                position={{ lat: lead.lat, lng: lead.lng }}
                onClick={() => {
                  onSelectLeadOnMap(lead);
                  setInfoLead(lead);
                }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: isSelected ? 12 : 7,
                  fillColor: isSelected ? "#D4AF37" : "#8B6914",
                  fillOpacity: isSelected ? 1 : 0.8,
                  strokeColor: isSelected ? "#FFD700" : "#5a4510",
                  strokeWeight: isSelected ? 3 : 1,
                }}
              />
            );
          })}

          {infoLead && infoLead.lat && infoLead.lng && (
            <InfoWindowF
              position={{ lat: infoLead.lat, lng: infoLead.lng }}
              onCloseClick={() => setInfoLead(null)}
            >
              <div className="p-1 max-w-[240px]" style={{ color: "#111" }}>
                {/* Photo */}
                {infoLead.fotos && infoLead.fotos.length > 0 && (
                  <img src={infoLead.fotos[0]} alt={infoLead.empresa} className="w-full h-20 object-cover rounded mb-1.5" />
                )}
                <p className="font-bold text-sm">{infoLead.empresa}</p>
                <p className="text-xs text-gray-600">{infoLead.segmento} · {infoLead.bairro}</p>
                {infoLead.avaliacao && (
                  <p className="text-xs flex items-center gap-0.5 mt-0.5">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {infoLead.avaliacao} ({infoLead.totalAvaliacoes})
                  </p>
                )}
                <div className="flex gap-1.5 mt-2">
                  {infoLead.telefone && (
                    <a href={getWhatsAppUrl(infoLead.telefone)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center rounded bg-green-600 text-white px-2 py-0.5 text-[10px]">
                      <MessageSquare className="h-3 w-3 mr-0.5" />Zap
                    </a>
                  )}
                  {infoLead.googleMapsUrl && (
                    <a href={infoLead.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center rounded bg-blue-600 text-white px-2 py-0.5 text-[10px]">
                      <MapPin className="h-3 w-3 mr-0.5" />Maps
                    </a>
                  )}
                  <a href={`https://waze.com/ul?ll=${infoLead.lat},${infoLead.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center rounded bg-cyan-600 text-white px-2 py-0.5 text-[10px]">
                    <Navigation className="h-3 w-3 mr-0.5" />Waze
                  </a>
                </div>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Carregando Google Maps...
        </div>
      )}

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
