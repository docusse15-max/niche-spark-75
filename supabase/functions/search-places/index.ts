import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Helper: wait ms (needed for pagetoken to become valid)
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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

    const query = `${nicho} em ${cidade}, Mato Grosso do Sul, Brasil`;
    console.log("Searching Google Places:", query);

    // Fetch up to 60 results (3 pages of 20) using next_page_token
    const allPlaces: any[] = [];
    let pageToken: string | null = null;
    const MAX_PAGES = 3;

    for (let page = 0; page < MAX_PAGES; page++) {
      let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=pt-BR&key=${API_KEY}`;
      if (pageToken) {
        searchUrl += `&pagetoken=${pageToken}`;
      }

      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.status === "ZERO_RESULTS") break;
      if (searchData.status !== "OK") {
        console.error("Places API error:", searchData.status, searchData.error_message);
        if (page === 0) throw new Error(`Google Places API: ${searchData.status} - ${searchData.error_message || ""}`);
        break;
      }

      allPlaces.push(...(searchData.results || []));
      console.log(`Page ${page + 1}: ${searchData.results?.length || 0} results (total: ${allPlaces.length})`);

      pageToken = searchData.next_page_token || null;
      if (!pageToken) break;

      // Google requires ~2s delay before next_page_token becomes valid
      await sleep(2500);
    }

    console.log(`Total places found: ${allPlaces.length}`);

    // Get details for each place (phone, photos, etc.)
    const leads = [];
    for (const place of allPlaces.slice(0, 60)) {
      try {
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,international_phone_number,formatted_address,geometry,photos,website,url,rating,user_ratings_total,opening_hours,types&language=pt-BR&key=${API_KEY}`;
        const detailRes = await fetch(detailUrl);
        const detailData = await detailRes.json();
        const d = detailData.result || {};

        const photos: string[] = [];
        if (d.photos && d.photos.length > 0) {
          for (const photo of d.photos.slice(0, 3)) {
            photos.push(
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${API_KEY}`
            );
          }
        }

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
