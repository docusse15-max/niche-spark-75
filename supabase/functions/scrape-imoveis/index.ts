const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cidade, bairro } = await req.json();

    if (!cidade) {
      return new Response(
        JSON.stringify({ success: false, error: 'Cidade é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl não configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchQuery = bairro
      ? `casas à venda ${bairro} ${cidade} 2024 2025`
      : `casas à venda ${cidade} 2024 2025`;

    console.log('Searching:', searchQuery);

    // Use Firecrawl search to find real estate listings
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 20,
        lang: 'pt-br',
        country: 'BR',
        scrapeOptions: {
          formats: ['markdown'],
          onlyMainContent: true,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Erro ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse results into structured listings
    const listings = (data.data || []).map((item: any, idx: number) => {
      const markdown = item.markdown || '';
      const title = item.title || item.metadata?.title || 'Imóvel à venda';
      const url = item.url || item.metadata?.sourceURL || '';
      const description = item.description || '';

      // Try to extract price from markdown/title/description
      const priceMatch = (markdown + ' ' + title + ' ' + description).match(/R\$\s*([\d.,]+)/);
      const price = priceMatch ? priceMatch[0] : null;

      // Try to extract area
      const areaMatch = (markdown + ' ' + title + ' ' + description).match(/(\d+)\s*m²/);
      const area = areaMatch ? parseInt(areaMatch[1]) : null;

      // Try to extract bedrooms
      const bedroomMatch = (markdown + ' ' + title + ' ' + description).match(/(\d+)\s*(quartos?|dormit)/i);
      const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : null;

      return {
        id: `listing-${idx}`,
        titulo: title.slice(0, 120),
        descricao: description.slice(0, 200),
        preco: price,
        area,
        quartos: bedrooms,
        url,
        fonte: url.includes('olx') ? 'OLX' : url.includes('zapimoveis') ? 'Zap Imóveis' : url.includes('vivareal') ? 'Viva Real' : url.includes('imovelweb') ? 'Imóvel Web' : 'Web',
        cidade,
        bairro: bairro || null,
      };
    }).filter((l: any) => l.url && l.titulo);

    console.log(`Found ${listings.length} listings`);

    return new Response(
      JSON.stringify({ success: true, data: listings }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
