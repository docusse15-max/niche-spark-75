import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { nicho, cidade } = await req.json();
    if (!nicho || !cidade) {
      return new Response(JSON.stringify({ error: "nicho e cidade são obrigatórios" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!API_KEY) throw new Error("GOOGLE_PLACES_API_KEY not configured");

    // Step 1: Text Search for businesses
    const query = `${nicho} em ${cidade}, Mato Grosso do Sul, Brasil`;
    console.log("Searching Google Places:", query);

    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=pt-BR&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== "OK" && searchData.status !== "ZERO_RESULTS") {
      console.error("Places API error:", searchData.status, searchData.error_message);
      throw new Error(`Google Places API: ${searchData.status} - ${searchData.error_message || ""}`);
    }

    const places = searchData.results || [];
    console.log(`Found ${places.length} places`);

    // Step 2: Get details for each place (phone, website, etc.)
    const leads = [];
    for (const place of places.slice(0, 20)) {
      try {
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,international_phone_number,formatted_address,geometry,photos,website,url,rating,user_ratings_total,opening_hours,types&language=pt-BR&key=${API_KEY}`;
        const detailRes = await fetch(detailUrl);
        const detailData = await detailRes.json();
        const d = detailData.result || {};

        // Build photo URLs
        const photos: string[] = [];
        if (d.photos && d.photos.length > 0) {
          for (const photo of d.photos.slice(0, 3)) {
            photos.push(
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${API_KEY}`
            );
          }
        }

        // Extract bairro from address
        const addressParts = (d.formatted_address || place.formatted_address || "").split(",");
        const bairro = addressParts.length >= 3 ? addressParts[1]?.trim() : addressParts[0]?.trim();

        leads.push({
          empresa: d.name || place.name,
          telefone: d.formatted_phone_number || "",
          telefoneInternacional: d.international_phone_number || "",
          endereco: d.formatted_address || place.formatted_address || "",
          bairro: bairro || "",
          lat: d.geometry?.location?.lat || place.geometry?.location?.lat,
          lng: d.geometry?.location?.lng || place.geometry?.location?.lng,
          googleMapsUrl: d.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          placeId: place.place_id,
          fotos: photos,
          website: d.website || "",
          avaliacao: d.rating || null,
          totalAvaliacoes: d.user_ratings_total || 0,
          horarioFuncionamento: d.opening_hours?.weekday_text || [],
        });
      } catch (detailErr) {
        console.error("Error fetching place details:", detailErr);
        // Still add basic info
        leads.push({
          empresa: place.name,
          telefone: "",
          telefoneInternacional: "",
          endereco: place.formatted_address || "",
          bairro: "",
          lat: place.geometry?.location?.lat,
          lng: place.geometry?.location?.lng,
          googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          placeId: place.place_id,
          fotos: [],
          website: "",
          avaliacao: place.rating || null,
          totalAvaliacoes: place.user_ratings_total || 0,
          horarioFuncionamento: [],
        });
      }
    }

    return new Response(JSON.stringify({ leads }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-places error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
