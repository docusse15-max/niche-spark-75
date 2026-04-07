import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, InfoWindowF } from "@react-google-maps/api";
import { getInitialLeads, Lead, NICHOS, type Nicho, type LeadTemperature, type LeadStatus, STATUS_LABELS } from "@/data/leads";
import { CIDADES, type Cidade } from "@/data/cities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Navigation, Phone, Star, Route, Locate, ExternalLink, Filter, Clock, MessageSquare, LocateFixed } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GOOGLE_MAPS_KEY = "AIzaSyAPHdxmB8MWTBHHulY7YKjWpf7l5clpUps";
const DEFAULT_ADDRESS = "R. Pedro Celestino, 3607 - Centro, Campo Grande - MS, 79010-780";
const containerStyle = { width: "100%", height: "100%" };

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
  const [geoLoading, setGeoLoading] = useState(false);
  const [infoLead, setInfoLead] = useState<Lead | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Filters
  const [filterCidade, setFilterCidade] = useState<string>("todas");
  const [filterNicho, setFilterNicho] = useState<string>("todos");
  const [filterTemp, setFilterTemp] = useState<string>("todas");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterAvaliacao, setFilterAvaliacao] = useState<number>(0);

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
        setDirections(null);
        setSelectedRoute([]);
        toast({ title: "Endereço localizado!", description: result.results[0].formatted_address });
      } else {
        toast({ title: "Endereço não encontrado", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro ao geocodificar", variant: "destructive" });
    }
    setLoading(false);
  }, [address, isLoaded]);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocalização não suportada", variant: "destructive" });
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setOrigin({ lat: latitude, lng: longitude });
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setDirections(null);
        setSelectedRoute([]);
        setGeoLoading(false);
        toast({ title: "📍 Localização atual obtida!", description: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
      },
      () => {
        setGeoLoading(false);
        toast({ title: "Não foi possível obter localização", description: "Verifique as permissões do navegador", variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (isLoaded && !origin) geocodeAddress();
  }, [isLoaded]);

  // Available cities/nichos from leads data
  const availableCidades = useMemo(() => [...new Set(leads.map(l => l.cidade))].sort(), [leads]);
  const availableNichos = useMemo(() => [...new Set(leads.map(l => l.segmento))].sort(), [leads]);

  const nearbyLeads = useMemo(() => {
    if (!origin) return [];
    return leads
      .filter(l => {
        if (!l.lat || !l.lng) return false;
        if (filterCidade !== "todas" && l.cidade !== filterCidade) return false;
        if (filterNicho !== "todos" && l.segmento !== filterNicho) return false;
        if (filterTemp !== "todas" && l.temperatura !== filterTemp) return false;
        if (filterStatus !== "todos" && l.status !== filterStatus) return false;
        if (filterAvaliacao > 0 && (!l.avaliacao || l.avaliacao < filterAvaliacao)) return false;
        return true;
      })
      .map(l => ({ ...l, distance: haversineDistance(origin.lat, origin.lng, l.lat!, l.lng!) }))
      .filter(l => l.distance <= radius)
      .sort((a, b) => {
        const scoreA = (tempScore[a.temperatura] || 0) * 2 + (potScore[a.potencial] || 0) - a.distance * 0.5;
        const scoreB = (tempScore[b.temperatura] || 0) * 2 + (potScore[b.potencial] || 0) - b.distance * 0.5;
        return scoreB - scoreA;
      })
      .slice(0, maxLeads);
  }, [origin, leads, radius, maxLeads, filterCidade, filterNicho, filterTemp, filterStatus, filterAvaliacao]);

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

      if (result.routes && result.routes.length > 0) {
        const order = result.routes[0].waypoint_order;
        const ordered = order.map(i => nearbyLeads[i]);
        setSelectedRoute(ordered);
        setDirections(result);

        // Calculate total distance and time
        const legs = result.routes[0].legs;
        const totalDist = legs.reduce((s, l) => s + (l.distance?.value || 0), 0) / 1000;
        const totalTime = legs.reduce((s, l) => s + (l.duration?.value || 0), 0) / 60;
        toast({
          title: "Roteiro gerado!",
          description: `${ordered.length} paradas · ${totalDist.toFixed(1)} km · ~${Math.round(totalTime)} min de viagem`,
        });
      }
    } catch {
      toast({ title: "Erro no serviço de rotas", variant: "destructive" });
    }
    setLoading(false);
  }, [origin, nearbyLeads, isLoaded]);

  const openInGoogleMaps = () => {
    if (!origin || selectedRoute.length === 0) return;
    const waypoints = selectedRoute.map(l => `${l.lat},${l.lng}`).join("|");
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${origin.lat},${origin.lng}&waypoints=${waypoints}&travelmode=driving`, "_blank");
  };

  const openInWaze = () => {
    if (!origin || selectedRoute.length === 0) return;
    const first = selectedRoute[0];
    window.open(`https://waze.com/ul?ll=${first.lat},${first.lng}&navigate=yes`, "_blank");
  };

  const getWhatsAppUrl = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return `https://wa.me/${cleaned.startsWith("55") ? cleaned : "55" + cleaned}`;
  };

  const tempColor: Record<string, string> = { quente: "text-red-500", morno: "text-amber-500", frio: "text-blue-400" };
  const tempEmoji: Record<string, string> = { quente: "🔥", morno: "🌤️", frio: "❄️" };

  // Route stats
  const routeStats = useMemo(() => {
    if (!directions?.routes?.[0]) return null;
    const legs = directions.routes[0].legs;
    return {
      distance: (legs.reduce((s, l) => s + (l.distance?.value || 0), 0) / 1000).toFixed(1),
      duration: Math.round(legs.reduce((s, l) => s + (l.duration?.value || 0), 0) / 60),
    };
  }, [directions]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" /> Gerador de Roteiro
            </h1>
          </div>
          {routeStats && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>📍 {selectedRoute.length} paradas</span>
              <span>🛣️ {routeStats.distance} km</span>
              <span>⏱️ ~{routeStats.duration} min</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Controls */}
          <Card className="lg:col-span-1 space-y-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">📍 Ponto de Partida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div>
                <div className="flex gap-1.5 mt-1">
                  <Input value={address} onChange={e => setAddress(e.target.value)} className="text-xs h-8" placeholder="Endereço de partida..." />
                  <Button size="sm" className="h-8 px-2" onClick={geocodeAddress} disabled={loading} title="Buscar endereço">
                    <Locate className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-1.5 h-7 text-xs" onClick={useCurrentLocation} disabled={geoLoading}>
                  <LocateFixed className="h-3 w-3 mr-1" />
                  {geoLoading ? "Obtendo localização..." : "Usar minha localização atual"}
                </Button>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
                  <Filter className="h-3 w-3" /> Filtros
                </p>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">Cidade</label>
                    <Select value={filterCidade} onValueChange={setFilterCidade}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as cidades</SelectItem>
                        {availableCidades.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground">Segmento</label>
                    <Select value={filterNicho} onValueChange={setFilterNicho}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os segmentos</SelectItem>
                        {availableNichos.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground">Temperatura</label>
                    <Select value={filterTemp} onValueChange={setFilterTemp}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="quente">🔥 Quente</SelectItem>
                        <SelectItem value="morno">🌤️ Morno</SelectItem>
                        <SelectItem value="frio">❄️ Frio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground">Status</label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground">
                      Avaliação mínima: {filterAvaliacao > 0 ? `⭐ ${filterAvaliacao}+` : "Todas"}
                    </label>
                    <Slider value={[filterAvaliacao]} onValueChange={v => setFilterAvaliacao(v[0])} min={0} max={5} step={0.5} className="mt-1" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">
                    Raio: <span className="text-primary font-bold">{radius} km</span>
                  </label>
                  <Slider value={[radius]} onValueChange={v => setRadius(v[0])} min={1} max={50} step={1} className="mt-1" />
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground">
                    Máx. paradas: <span className="text-primary font-bold">{maxLeads}</span>
                  </label>
                  <Slider value={[maxLeads]} onValueChange={v => setMaxLeads(v[0])} min={3} max={25} step={1} className="mt-1" />
                </div>
              </div>

              <div className="text-xs bg-muted/50 rounded p-2 text-center">
                🎯 <strong>{nearbyLeads.length}</strong> leads no raio de {radius}km
              </div>

              <Button className="w-full" onClick={generateRoute} disabled={loading || nearbyLeads.length === 0}>
                {loading ? "Calculando..." : `🗺️ Gerar Roteiro (${nearbyLeads.length} leads)`}
              </Button>

              {selectedRoute.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={openInGoogleMaps}>
                    <ExternalLink className="h-3 w-3 mr-1" /> Maps
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={openInWaze}>
                    <Navigation className="h-3 w-3 mr-1" /> Waze
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="lg:col-span-3">
            <CardContent className="p-0 overflow-hidden rounded-lg h-[600px]">
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
                      icon={{
                        url: l.temperatura === "quente"
                          ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                          : l.temperatura === "morno"
                          ? "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
                          : "https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
                      }}
                    />
                  ))}
                  {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: false }} />}
                  {infoLead && (
                    <InfoWindowF position={{ lat: infoLead.lat!, lng: infoLead.lng! }} onCloseClick={() => setInfoLead(null)}>
                      <div className="text-xs max-w-[220px] space-y-1">
                        <p className="font-bold text-sm">{infoLead.empresa}</p>
                        <p className="text-muted-foreground">{infoLead.segmento}</p>
                        {infoLead.avaliacao && <p>⭐ {infoLead.avaliacao} ({infoLead.totalAvaliacoes})</p>}
                        {infoLead.endereco && <p>📍 {infoLead.endereco}</p>}
                        {infoLead.telefone && <p>📞 {infoLead.telefone}</p>}
                      </div>
                    </InfoWindowF>
                  )}
                </GoogleMap>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">Carregando mapa...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Route list */}
        {selectedRoute.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>📋 Ordem de Visitas ({selectedRoute.length} paradas)</span>
                {routeStats && (
                  <span className="text-xs font-normal text-muted-foreground">
                    🛣️ {routeStats.distance} km · ⏱️ ~{routeStats.duration} min
                  </span>
                )}
              </CardTitle>
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm truncate">{lead.empresa}</span>
                        <Badge variant="outline" className="text-[10px] shrink-0">{lead.segmento}</Badge>
                        <span className={`text-[10px] font-bold ${tempColor[lead.temperatura]}`}>
                          {tempEmoji[lead.temperatura]} {lead.temperatura}
                        </span>
                        {lead.avaliacao && (
                          <span className="text-[10px] text-amber-500 flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400" /> {lead.avaliacao}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3 shrink-0" />{lead.endereco || lead.bairro}</span>
                        {lead.telefone && <span className="flex items-center gap-0.5 shrink-0"><Phone className="h-3 w-3" />{lead.telefone}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {lead.telefone && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600" onClick={() => window.open(getWhatsAppUrl(lead.telefone), "_blank")} title="WhatsApp">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      )}
                      {lead.googleMapsUrl && (
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => window.open(lead.googleMapsUrl, "_blank")} title="Google Maps">
                          <MapPin className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => window.open(`https://waze.com/ul?ll=${lead.lat},${lead.lng}&navigate=yes`, "_blank")} title="Waze">
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
