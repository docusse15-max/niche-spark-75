import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, InfoWindowF } from "@react-google-maps/api";
import { getInitialLeads, Lead } from "@/data/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Navigation, Phone, Star, Route, Locate, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GOOGLE_MAPS_KEY = "AIzaSyAPHdxmB8MWTBHHulY7YKjWpf7l5clpUps";
const DEFAULT_ADDRESS = "R. Pedro Celestino, 3607 - Centro, Campo Grande - MS, 79010-780";
const containerStyle = { width: "100%", height: "500px" };

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const tempScore: Record<string, number> = { quente: 3, morno: 2, frio: 1 };
const potScore: Record<string, number> = { premium: 4, alto: 3, medio: 2, baixo: 1 };

export default function RoutePlanner() {
  const navigate = useNavigate();
  const leads = useMemo(() => getInitialLeads(), []);

  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(5);
  const [maxLeads, setMaxLeads] = useState(10);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [infoLead, setInfoLead] = useState<Lead | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_KEY });

  const geocodeAddress = useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address });
      if (result.results.length > 0) {
        const loc = result.results[0].geometry.location;
        setOrigin({ lat: loc.lat(), lng: loc.lng() });
        toast({ title: "Endereço localizado!", description: result.results[0].formatted_address });
      } else {
        toast({ title: "Endereço não encontrado", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro ao geocodificar", variant: "destructive" });
    }
    setLoading(false);
  }, [address, isLoaded]);

  // Auto-geocode on mount
  useEffect(() => {
    if (isLoaded && !origin) geocodeAddress();
  }, [isLoaded]);

  const nearbyLeads = useMemo(() => {
    if (!origin) return [];
    return leads
      .filter(l => l.lat && l.lng)
      .map(l => ({ ...l, distance: haversineDistance(origin.lat, origin.lng, l.lat!, l.lng!) }))
      .filter(l => l.distance <= radius)
      .sort((a, b) => {
        const scoreA = (tempScore[a.temperatura] || 0) * 2 + (potScore[a.potencial] || 0) - a.distance * 0.5;
        const scoreB = (tempScore[b.temperatura] || 0) * 2 + (potScore[b.potencial] || 0) - b.distance * 0.5;
        return scoreB - scoreA;
      })
      .slice(0, maxLeads);
  }, [origin, leads, radius, maxLeads]);

  const generateRoute = useCallback(async () => {
    if (!origin || nearbyLeads.length === 0 || !isLoaded) return;
    setLoading(true);
    setDirections(null);

    const waypoints = nearbyLeads.slice(0, Math.min(nearbyLeads.length, 23)).map(l => ({
      location: new google.maps.LatLng(l.lat!, l.lng!),
      stopover: true,
    }));

    const directionsService = new google.maps.DirectionsService();
    try {
      const result = await directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(origin.lat, origin.lng),
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (result.status === "OK") {
        const order = result.routes[0].waypoint_order;
        const ordered = order.map(i => nearbyLeads[i]);
        setSelectedRoute(ordered);
        setDirections(result);
        toast({ title: "Roteiro gerado!", description: `${ordered.length} paradas otimizadas` });
      } else {
        toast({ title: "Erro ao traçar rota", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro no serviço de rotas", variant: "destructive" });
    }
    setLoading(false);
  }, [origin, nearbyLeads, isLoaded]);

  const openInGoogleMaps = () => {
    if (!origin || selectedRoute.length === 0) return;
    const waypoints = selectedRoute.map(l => `${l.lat},${l.lng}`).join("|");
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${origin.lat},${origin.lng}&waypoints=${waypoints}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const openInWaze = () => {
    if (!origin || selectedRoute.length === 0) return;
    const first = selectedRoute[0];
    window.open(`https://waze.com/ul?ll=${first.lat},${first.lng}&navigate=yes`, "_blank");
  };

  const tempColor: Record<string, string> = { quente: "text-red-500", morno: "text-amber-500", frio: "text-blue-400" };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" /> Gerador de Roteiro
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Controls */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">📍 Configurar Roteiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Endereço de partida</label>
                <div className="flex gap-2 mt-1">
                  <Input value={address} onChange={e => setAddress(e.target.value)} className="text-xs" placeholder="Seu endereço..." />
                  <Button size="sm" onClick={geocodeAddress} disabled={loading}>
                    <Locate className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Raio de busca: <span className="text-primary font-bold">{radius} km</span>
                </label>
                <Slider value={[radius]} onValueChange={v => setRadius(v[0])} min={1} max={30} step={1} className="mt-2" />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Máx. empresas: <span className="text-primary font-bold">{maxLeads}</span>
                </label>
                <Slider value={[maxLeads]} onValueChange={v => setMaxLeads(v[0])} min={3} max={25} step={1} className="mt-2" />
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                🎯 {nearbyLeads.length} leads encontrados no raio de {radius}km
              </div>

              <Button className="w-full" onClick={generateRoute} disabled={loading || nearbyLeads.length === 0}>
                {loading ? "Calculando..." : `🗺️ Gerar Roteiro (${nearbyLeads.length} leads)`}
              </Button>

              {selectedRoute.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={openInGoogleMaps}>
                    <ExternalLink className="h-3 w-3 mr-1" /> Google Maps
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={openInWaze}>
                    <Navigation className="h-3 w-3 mr-1" /> Waze
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0 overflow-hidden rounded-lg">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={origin || { lat: -20.4697, lng: -54.6201 }}
                  zoom={origin ? 13 : 10}
                  onLoad={map => { mapRef.current = map; }}
                  options={{ streetViewControl: false, mapTypeControl: false }}
                >
                  {origin && (
                    <MarkerF
                      position={origin}
                      icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                      title="Ponto de partida"
                    />
                  )}
                  {!directions && nearbyLeads.map(l => (
                    <MarkerF
                      key={l.id}
                      position={{ lat: l.lat!, lng: l.lng! }}
                      onClick={() => setInfoLead(l)}
                      icon={{ url: l.temperatura === "quente" ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png" : l.temperatura === "morno" ? "https://maps.google.com/mapfiles/ms/icons/orange-dot.png" : "https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png" }}
                    />
                  ))}
                  {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: false }} />}
                  {infoLead && (
                    <InfoWindowF position={{ lat: infoLead.lat!, lng: infoLead.lng! }} onCloseClick={() => setInfoLead(null)}>
                      <div className="text-xs max-w-[200px]">
                        <p className="font-bold">{infoLead.empresa}</p>
                        <p>{infoLead.segmento}</p>
                        {infoLead.avaliacao && <p>⭐ {infoLead.avaliacao}</p>}
                        {infoLead.telefone && <p>📞 {infoLead.telefone}</p>}
                      </div>
                    </InfoWindowF>
                  )}
                </GoogleMap>
              ) : (
                <div className="h-[500px] flex items-center justify-center text-muted-foreground">Carregando mapa...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Route list */}
        {selectedRoute.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">📋 Ordem de Visitas ({selectedRoute.length} paradas)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedRoute.map((lead, i) => (
                  <div key={lead.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    {lead.fotos?.[0] && (
                      <img src={lead.fotos[0]} alt={lead.empresa} className="w-12 h-12 rounded object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{lead.empresa}</span>
                        <Badge variant="outline" className="text-[10px] shrink-0">{lead.segmento}</Badge>
                        <span className={`text-[10px] font-bold ${tempColor[lead.temperatura]}`}>
                          {lead.temperatura === "quente" ? "🔥" : lead.temperatura === "morno" ? "🌤️" : "❄️"} {lead.temperatura}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{lead.endereco || lead.bairro}</span>
                        {lead.avaliacao && <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-amber-400" />{lead.avaliacao}</span>}
                        {lead.telefone && <span className="flex items-center gap-0.5"><Phone className="h-3 w-3" />{lead.telefone}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {lead.googleMapsUrl && (
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => window.open(lead.googleMapsUrl, "_blank")}>
                          <MapPin className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => window.open(`https://waze.com/ul?ll=${lead.lat},${lead.lng}&navigate=yes`, "_blank")}>
                        <Navigation className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
