import { useMemo, useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, CircleF, InfoWindowF } from "@react-google-maps/api";
import { BAIRROS_EQUITY, CIDADES_EQUITY, type BairroEquity } from "@/data/home-equity-data";
import { cn } from "@/lib/utils";
import { Home, TrendingUp, MapPin, DollarSign, Building2, Target, Search, ExternalLink, Loader2, Bed, Maximize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_MAPS_KEY = "AIzaSyAPHdxmB8MWTBHHulY7YKjWpf7l5clpUps";
const containerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: -18.5, lng: -52.0 };

interface Listing {
  id: string;
  titulo: string;
  descricao: string;
  preco: string | null;
  area: number | null;
  quartos: number | null;
  url: string;
  fonte: string;
  cidade: string;
  bairro: string | null;
}

function getHeatColor(nivel: string, valorM2: number, maxValorM2: number): string {
  const ratio = valorM2 / maxValorM2;
  if (nivel === "alto") return ratio > 0.8 ? "#ef4444" : "#f97316";
  if (nivel === "medio") return "#eab308";
  return "#22c55e";
}

function getCircleRadius(oportunidades: number): number {
  return Math.max(400, Math.min(1200, oportunidades * 18));
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

const fonteBadgeColors: Record<string, string> = {
  "OLX": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Zap Imóveis": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Viva Real": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Imóvel Web": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Web": "bg-secondary text-muted-foreground border-border",
};

export default function HomeEquity() {
  const currentUser = typeof window !== "undefined" ? sessionStorage.getItem("crm_user") : null;
  const isThyrson = currentUser === "Thyrson";
  const [selectedCity, setSelectedCity] = useState<string>(isThyrson ? "São Paulo" : "Campo Grande");
  const [infoBairro, setInfoBairro] = useState<BairroEquity | null>(null);
  const [sortBy, setSortBy] = useState<"valor" | "oportunidades" | "crescimento">("valor");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [searchedBairro, setSearchedBairro] = useState<string>("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const { toast } = useToast();

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_KEY });

  const filteredBairros = useMemo(() => {
    return BAIRROS_EQUITY.filter(b => b.cidade === selectedCity);
  }, [selectedCity]);

  const maxValorM2 = useMemo(() => Math.max(...BAIRROS_EQUITY.map(b => b.valorMedioM2)), []);

  const sortedBairros = useMemo(() => {
    const sorted = [...filteredBairros];
    if (sortBy === "valor") sorted.sort((a, b) => b.valorMedioM2 - a.valorMedioM2);
    else if (sortBy === "oportunidades") sorted.sort((a, b) => b.oportunidades - a.oportunidades);
    else sorted.sort((a, b) => b.crescimento12m - a.crescimento12m);
    return sorted;
  }, [filteredBairros, sortBy]);

  const totals = useMemo(() => {
    const t = filteredBairros.reduce(
      (acc, b) => ({
        imoveis: acc.imoveis + b.totalImoveis,
        oportunidades: acc.oportunidades + b.oportunidades,
        valorMedio: acc.valorMedio + b.ticketMedio,
      }),
      { imoveis: 0, oportunidades: 0, valorMedio: 0 }
    );
    return { ...t, valorMedio: filteredBairros.length > 0 ? Math.round(t.valorMedio / filteredBairros.length) : 0 };
  }, [filteredBairros]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleCityClick = useCallback((city: string) => {
    setSelectedCity(city);
    setInfoBairro(null);
    setListings([]);
    setSearchedBairro("");
    if (!mapRef.current) return;
    const cityBairros = BAIRROS_EQUITY.filter(b => b.cidade === city);
    if (cityBairros.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      cityBairros.forEach(b => bounds.extend({ lat: b.coords[0], lng: b.coords[1] }));
      mapRef.current.fitBounds(bounds, 60);
    }
  }, []);

  const handleBairroClick = useCallback((bairro: BairroEquity) => {
    setInfoBairro(bairro);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: bairro.coords[0], lng: bairro.coords[1] });
      mapRef.current.setZoom(14);
    }
  }, []);

  const searchListings = useCallback(async (cidade: string, bairro?: string) => {
    setLoadingListings(true);
    setSearchedBairro(bairro || cidade);
    try {
      const { data, error } = await supabase.functions.invoke("scrape-imoveis", {
        body: { cidade, bairro },
      });
      if (error) throw error;
      if (data?.success && data.data) {
        setListings(data.data);
        toast({ title: "Anúncios encontrados", description: `${data.data.length} imóveis à venda em ${bairro || cidade}` });
      } else {
        setListings([]);
        toast({ title: "Sem resultados", description: "Nenhum anúncio encontrado", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erro", description: "Falha ao buscar anúncios", variant: "destructive" });
      setListings([]);
    } finally {
      setLoadingListings(false);
    }
  }, [toast]);

  const nivelBadge = (nivel: string) => {
    const colors: Record<string, string> = {
      alto: "bg-red-500/20 text-red-400 border-red-500/30",
      medio: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      baixo: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return colors[nivel] || "";
  };

  return (
    <div className="p-4 space-y-4 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3">
        <Home className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold gold-text">Home Equity — Mapa de Oportunidades</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Imóveis</span>
            </div>
            <p className="text-lg font-bold text-foreground mt-1">{totals.imoveis.toLocaleString("pt-BR")}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-red-400" />
              <span className="text-xs text-muted-foreground">Oportunidades</span>
            </div>
            <p className="text-lg font-bold text-foreground mt-1">{totals.oportunidades}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-xs text-muted-foreground">Ticket Médio</span>
            </div>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(totals.valorMedio)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Bairros Mapeados</span>
            </div>
            <p className="text-lg font-bold text-foreground mt-1">{filteredBairros.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* City filter */}
      <div className="flex flex-wrap gap-1.5">
        {(isThyrson ? ["São Paulo"] : CIDADES_EQUITY).map(c => (
          <button
            key={c}
            onClick={() => handleCityClick(c)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer border",
              selectedCity === c
                ? "bg-primary/30 text-primary border-primary ring-1 ring-primary/40"
                : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 pb-1">
            <h3 className="font-semibold text-sm gold-text">🔥 Mapa de Calor — Valor Imobiliário</h3>
            <div className="flex gap-2 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Alto</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Médio</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Acessível</span>
            </div>
          </div>

          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={12}
              onLoad={onLoad}
              options={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: true }}
            >
              {filteredBairros.map(bairro => {
                const color = getHeatColor(bairro.nivel, bairro.valorMedioM2, maxValorM2);
                return (
                  <CircleF
                    key={`${bairro.cidade}-${bairro.nome}`}
                    center={{ lat: bairro.coords[0], lng: bairro.coords[1] }}
                    radius={getCircleRadius(bairro.oportunidades)}
                    options={{
                      fillColor: color,
                      fillOpacity: 0.45,
                      strokeColor: color,
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      clickable: true,
                    }}
                    onClick={() => handleBairroClick(bairro)}
                  />
                );
              })}

              {infoBairro && (
                <InfoWindowF
                  position={{ lat: infoBairro.coords[0], lng: infoBairro.coords[1] }}
                  onCloseClick={() => setInfoBairro(null)}
                >
                  <div className="p-1 max-w-[220px]" style={{ color: "#111" }}>
                    <p className="font-bold text-sm">{infoBairro.nome}</p>
                    <p className="text-xs text-gray-500">{infoBairro.cidade}</p>
                    <div className="mt-1.5 space-y-0.5 text-xs">
                      <p>💰 R$ {infoBairro.valorMedioM2.toLocaleString("pt-BR")}/m²</p>
                      <p>🏠 {infoBairro.totalImoveis} imóveis</p>
                      <p>🎯 {infoBairro.oportunidades} oportunidades</p>
                      <p>📊 Ticket: {formatCurrency(infoBairro.ticketMedio)}</p>
                      <p>📈 +{infoBairro.crescimento12m}% (12m)</p>
                    </div>
                    <button
                      onClick={() => searchListings(infoBairro.cidade, infoBairro.nome)}
                      className="mt-2 w-full text-center bg-blue-600 text-white rounded px-2 py-1 text-[10px] font-medium"
                    >
                      🔍 Buscar anúncios reais
                    </button>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-muted-foreground">Carregando mapa...</div>
          )}
        </div>

        {/* Ranking list */}
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm gold-text">📋 Ranking de Bairros</h3>
            <Button
              size="sm"
              variant="outline"
              className="text-[10px] h-7"
              onClick={() => searchListings(selectedCity)}
              disabled={loadingListings}
            >
              {loadingListings ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Search className="h-3 w-3 mr-1" />}
              Buscar anúncios
            </Button>
          </div>

          <div className="flex gap-1 mb-3">
            {(["valor", "oportunidades", "crescimento"] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={cn(
                  "rounded px-2 py-1 text-[10px] font-medium border transition-all",
                  sortBy === s
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-secondary/60 text-muted-foreground border-transparent hover:bg-secondary"
                )}
              >
                {s === "valor" ? "💰 Valor/m²" : s === "oportunidades" ? "🎯 Oportunidades" : "📈 Crescimento"}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {sortedBairros.map((b, idx) => (
              <button
                key={`${b.cidade}-${b.nome}`}
                onClick={() => handleBairroClick(b)}
                className={cn(
                  "w-full text-left rounded-lg border p-2.5 transition-all hover:bg-secondary/60",
                  infoBairro?.nome === b.nome && infoBairro?.cidade === b.cidade
                    ? "border-primary bg-primary/10"
                    : "border-border"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-5">#{idx + 1}</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{b.nome}</p>
                      <p className="text-[10px] text-muted-foreground">{b.totalImoveis} imóveis · {b.oportunidades} oport.</p>
                    </div>
                  </div>
                  <Badge className={cn("text-[9px] border", nivelBadge(b.nivel))}>
                    {b.nivel}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1.5 ml-7">
                  <span className="text-[10px] text-muted-foreground">
                    R$ {b.valorMedioM2.toLocaleString("pt-BR")}/m²
                  </span>
                  <span className="text-[10px] flex items-center gap-0.5 text-green-400">
                    <TrendingUp className="h-3 w-3" />+{b.crescimento12m}%
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatCurrency(b.ticketMedio)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real Estate Listings */}
      {(listings.length > 0 || loadingListings) && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm gold-text">
              🏠 Anúncios Reais — {searchedBairro}
            </h3>
            <span className="text-[10px] text-muted-foreground">
              {listings.length} resultado{listings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingListings ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Buscando anúncios em tempo real...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {listings.map(listing => (
                <a
                  key={listing.id}
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-border p-3 hover:border-primary/50 hover:bg-secondary/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                      {listing.titulo}
                    </p>
                    <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                  </div>

                  {listing.descricao && (
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{listing.descricao}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {listing.preco && (
                      <span className="text-xs font-bold text-primary">{listing.preco}</span>
                    )}
                    {listing.quartos && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Bed className="h-3 w-3" />{listing.quartos}
                      </span>
                    )}
                    {listing.area && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Maximize className="h-3 w-3" />{listing.area}m²
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <Badge className={cn("text-[9px] border", fonteBadgeColors[listing.fonte] || fonteBadgeColors["Web"])}>
                      {listing.fonte}
                    </Badge>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
