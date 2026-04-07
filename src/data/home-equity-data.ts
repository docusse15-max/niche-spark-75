export interface BairroEquity {
  nome: string;
  cidade: string;
  coords: [number, number];
  valorMedioM2: number; // R$/m²
  totalImoveis: number;
  oportunidades: number;
  ticketMedio: number; // valor médio do imóvel
  crescimento12m: number; // % valorização últimos 12 meses
  nivel: "alto" | "medio" | "baixo"; // nível de oportunidade
}

export const BAIRROS_EQUITY: BairroEquity[] = [
  // Campo Grande
  { nome: "Jardim dos Estados", cidade: "Campo Grande", coords: [-20.458, -54.615], valorMedioM2: 8500, totalImoveis: 320, oportunidades: 45, ticketMedio: 850000, crescimento12m: 12.5, nivel: "alto" },
  { nome: "Chácara Cachoeira", cidade: "Campo Grande", coords: [-20.452, -54.605], valorMedioM2: 7800, totalImoveis: 280, oportunidades: 38, ticketMedio: 720000, crescimento12m: 10.2, nivel: "alto" },
  { nome: "Carandá Bosque", cidade: "Campo Grande", coords: [-20.448, -54.598], valorMedioM2: 7200, totalImoveis: 250, oportunidades: 32, ticketMedio: 680000, crescimento12m: 9.8, nivel: "alto" },
  { nome: "Centro", cidade: "Campo Grande", coords: [-20.4697, -54.6201], valorMedioM2: 5500, totalImoveis: 450, oportunidades: 60, ticketMedio: 420000, crescimento12m: 6.5, nivel: "medio" },
  { nome: "Santa Fé", cidade: "Campo Grande", coords: [-20.48, -54.635], valorMedioM2: 4800, totalImoveis: 380, oportunidades: 55, ticketMedio: 350000, crescimento12m: 7.1, nivel: "medio" },
  { nome: "Tiradentes", cidade: "Campo Grande", coords: [-20.455, -54.63], valorMedioM2: 6200, totalImoveis: 200, oportunidades: 28, ticketMedio: 520000, crescimento12m: 8.3, nivel: "medio" },
  { nome: "Monte Castelo", cidade: "Campo Grande", coords: [-20.462, -54.605], valorMedioM2: 6800, totalImoveis: 180, oportunidades: 22, ticketMedio: 580000, crescimento12m: 7.9, nivel: "medio" },
  { nome: "Coronel Antonino", cidade: "Campo Grande", coords: [-20.465, -54.64], valorMedioM2: 4200, totalImoveis: 300, oportunidades: 48, ticketMedio: 310000, crescimento12m: 5.4, nivel: "medio" },
  { nome: "Vila Nasser", cidade: "Campo Grande", coords: [-20.485, -54.61], valorMedioM2: 3800, totalImoveis: 350, oportunidades: 52, ticketMedio: 280000, crescimento12m: 4.8, nivel: "baixo" },
  { nome: "Aero Rancho", cidade: "Campo Grande", coords: [-20.5, -54.65], valorMedioM2: 3200, totalImoveis: 420, oportunidades: 65, ticketMedio: 220000, crescimento12m: 3.5, nivel: "baixo" },
  { nome: "Vila Alba", cidade: "Campo Grande", coords: [-20.475, -54.595], valorMedioM2: 4500, totalImoveis: 270, oportunidades: 40, ticketMedio: 340000, crescimento12m: 5.9, nivel: "medio" },
  { nome: "Universitário", cidade: "Campo Grande", coords: [-20.505, -54.615], valorMedioM2: 4000, totalImoveis: 310, oportunidades: 42, ticketMedio: 300000, crescimento12m: 6.2, nivel: "medio" },

  // Dourados
  { nome: "Centro", cidade: "Dourados", coords: [-22.2233, -54.8083], valorMedioM2: 4500, totalImoveis: 280, oportunidades: 35, ticketMedio: 380000, crescimento12m: 7.2, nivel: "medio" },
  { nome: "Jardim América", cidade: "Dourados", coords: [-22.218, -54.815], valorMedioM2: 5200, totalImoveis: 150, oportunidades: 22, ticketMedio: 450000, crescimento12m: 8.5, nivel: "alto" },
  { nome: "Parque das Nações", cidade: "Dourados", coords: [-22.215, -54.805], valorMedioM2: 5800, totalImoveis: 120, oportunidades: 18, ticketMedio: 520000, crescimento12m: 9.1, nivel: "alto" },
  { nome: "Vila Industrial", cidade: "Dourados", coords: [-22.23, -54.8], valorMedioM2: 3200, totalImoveis: 200, oportunidades: 30, ticketMedio: 240000, crescimento12m: 4.5, nivel: "baixo" },
  { nome: "Jardim Clímax", cidade: "Dourados", coords: [-22.228, -54.818], valorMedioM2: 3800, totalImoveis: 180, oportunidades: 25, ticketMedio: 290000, crescimento12m: 5.3, nivel: "medio" },

  // Ponta Porã
  { nome: "Centro", cidade: "Ponta Porã", coords: [-22.5358, -55.7256], valorMedioM2: 3800, totalImoveis: 200, oportunidades: 28, ticketMedio: 320000, crescimento12m: 6.0, nivel: "medio" },
  { nome: "Residencial", cidade: "Ponta Porã", coords: [-22.53, -55.72], valorMedioM2: 3200, totalImoveis: 150, oportunidades: 20, ticketMedio: 250000, crescimento12m: 4.8, nivel: "baixo" },

  // Corumbá
  { nome: "Centro", cidade: "Corumbá", coords: [-19.0089, -57.6513], valorMedioM2: 3500, totalImoveis: 180, oportunidades: 25, ticketMedio: 280000, crescimento12m: 5.5, nivel: "medio" },
  { nome: "Popular", cidade: "Corumbá", coords: [-19.005, -57.645], valorMedioM2: 2800, totalImoveis: 220, oportunidades: 35, ticketMedio: 200000, crescimento12m: 3.8, nivel: "baixo" },

  // Aquidauana
  { nome: "Centro", cidade: "Aquidauana", coords: [-20.4711, -55.7878], valorMedioM2: 3000, totalImoveis: 140, oportunidades: 18, ticketMedio: 240000, crescimento12m: 4.2, nivel: "baixo" },

  // Bonito
  { nome: "Centro", cidade: "Bonito", coords: [-21.1261, -56.4836], valorMedioM2: 5500, totalImoveis: 90, oportunidades: 15, ticketMedio: 480000, crescimento12m: 11.0, nivel: "alto" },

  // Maracaju
  { nome: "Centro", cidade: "Maracaju", coords: [-21.6106, -55.1678], valorMedioM2: 3300, totalImoveis: 120, oportunidades: 16, ticketMedio: 260000, crescimento12m: 5.0, nivel: "medio" },
];

export const CIDADES_EQUITY = [...new Set(BAIRROS_EQUITY.map(b => b.cidade))];
