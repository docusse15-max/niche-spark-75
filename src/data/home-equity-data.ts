export interface BairroEquity {
  nome: string;
  cidade: string;
  coords: [number, number];
  valorMedioM2: number;
  totalImoveis: number;
  oportunidades: number;
  ticketMedio: number;
  crescimento12m: number;
  nivel: "alto" | "medio" | "baixo";
}

export const BAIRROS_EQUITY: BairroEquity[] = [
  // ── MATO GROSSO DO SUL ──
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

  // Sidrolândia
  { nome: "Centro", cidade: "Sidrolândia", coords: [-20.932, -54.961], valorMedioM2: 2800, totalImoveis: 100, oportunidades: 14, ticketMedio: 210000, crescimento12m: 4.5, nivel: "baixo" },

  // Rio Brilhante
  { nome: "Centro", cidade: "Rio Brilhante", coords: [-21.8025, -54.5461], valorMedioM2: 2600, totalImoveis: 85, oportunidades: 12, ticketMedio: 195000, crescimento12m: 3.9, nivel: "baixo" },

  // Três Lagoas
  { nome: "Centro", cidade: "Três Lagoas", coords: [-20.7511, -51.6783], valorMedioM2: 4800, totalImoveis: 260, oportunidades: 35, ticketMedio: 380000, crescimento12m: 8.0, nivel: "medio" },
  { nome: "Colinos", cidade: "Três Lagoas", coords: [-20.748, -51.685], valorMedioM2: 5500, totalImoveis: 140, oportunidades: 20, ticketMedio: 460000, crescimento12m: 9.2, nivel: "alto" },
  { nome: "Santos Dumont", cidade: "Três Lagoas", coords: [-20.755, -51.67], valorMedioM2: 3500, totalImoveis: 180, oportunidades: 28, ticketMedio: 270000, crescimento12m: 5.1, nivel: "baixo" },

  // Naviraí
  { nome: "Centro", cidade: "Naviraí", coords: [-23.065, -54.191], valorMedioM2: 3200, totalImoveis: 110, oportunidades: 15, ticketMedio: 245000, crescimento12m: 4.8, nivel: "baixo" },

  // Nova Andradina
  { nome: "Centro", cidade: "Nova Andradina", coords: [-22.2328, -53.3437], valorMedioM2: 3000, totalImoveis: 95, oportunidades: 13, ticketMedio: 230000, crescimento12m: 4.3, nivel: "baixo" },

  // Coxim
  { nome: "Centro", cidade: "Coxim", coords: [-18.5067, -54.76], valorMedioM2: 2500, totalImoveis: 80, oportunidades: 10, ticketMedio: 185000, crescimento12m: 3.5, nivel: "baixo" },

  // Paranaíba
  { nome: "Centro", cidade: "Paranaíba", coords: [-19.676, -51.191], valorMedioM2: 2700, totalImoveis: 90, oportunidades: 12, ticketMedio: 200000, crescimento12m: 3.8, nivel: "baixo" },

  // Jardim
  { nome: "Centro", cidade: "Jardim", coords: [-21.48, -56.138], valorMedioM2: 2900, totalImoveis: 75, oportunidades: 10, ticketMedio: 215000, crescimento12m: 4.0, nivel: "baixo" },

  // Amambai
  { nome: "Centro", cidade: "Amambai", coords: [-23.105, -55.226], valorMedioM2: 2500, totalImoveis: 70, oportunidades: 9, ticketMedio: 180000, crescimento12m: 3.2, nivel: "baixo" },

  // Chapadão do Sul
  { nome: "Centro", cidade: "Chapadão do Sul", coords: [-18.788, -52.626], valorMedioM2: 4200, totalImoveis: 100, oportunidades: 18, ticketMedio: 350000, crescimento12m: 7.5, nivel: "medio" },

  // Costa Rica (MS)
  { nome: "Centro", cidade: "Costa Rica", coords: [-18.543, -53.129], valorMedioM2: 3800, totalImoveis: 85, oportunidades: 14, ticketMedio: 300000, crescimento12m: 6.8, nivel: "medio" },

  // ── MATO GROSSO ──
  // Cuiabá
  { nome: "Centro", cidade: "Cuiabá", coords: [-15.601, -56.0974], valorMedioM2: 5800, totalImoveis: 400, oportunidades: 55, ticketMedio: 480000, crescimento12m: 8.5, nivel: "medio" },
  { nome: "Goiabeiras", cidade: "Cuiabá", coords: [-15.58, -56.08], valorMedioM2: 7200, totalImoveis: 200, oportunidades: 30, ticketMedio: 650000, crescimento12m: 10.5, nivel: "alto" },
  { nome: "Jardim das Américas", cidade: "Cuiabá", coords: [-15.61, -56.07], valorMedioM2: 6500, totalImoveis: 180, oportunidades: 25, ticketMedio: 560000, crescimento12m: 9.0, nivel: "alto" },
  { nome: "Coxipó", cidade: "Cuiabá", coords: [-15.63, -56.06], valorMedioM2: 4200, totalImoveis: 300, oportunidades: 45, ticketMedio: 320000, crescimento12m: 5.8, nivel: "medio" },
  { nome: "Pedra 90", cidade: "Cuiabá", coords: [-15.64, -56.1], valorMedioM2: 3500, totalImoveis: 350, oportunidades: 50, ticketMedio: 260000, crescimento12m: 4.5, nivel: "baixo" },

  // Várzea Grande
  { nome: "Centro", cidade: "Várzea Grande", coords: [-15.646, -56.132], valorMedioM2: 3800, totalImoveis: 250, oportunidades: 38, ticketMedio: 280000, crescimento12m: 5.5, nivel: "medio" },
  { nome: "Cristo Rei", cidade: "Várzea Grande", coords: [-15.65, -56.14], valorMedioM2: 3200, totalImoveis: 200, oportunidades: 30, ticketMedio: 240000, crescimento12m: 4.2, nivel: "baixo" },

  // Rondonópolis
  { nome: "Centro", cidade: "Rondonópolis", coords: [-16.4711, -54.6356], valorMedioM2: 4500, totalImoveis: 220, oportunidades: 30, ticketMedio: 360000, crescimento12m: 7.0, nivel: "medio" },
  { nome: "Vila Aurora", cidade: "Rondonópolis", coords: [-16.465, -54.64], valorMedioM2: 5200, totalImoveis: 130, oportunidades: 20, ticketMedio: 430000, crescimento12m: 8.2, nivel: "alto" },
  { nome: "Jardim Iguassu", cidade: "Rondonópolis", coords: [-16.475, -54.625], valorMedioM2: 3500, totalImoveis: 180, oportunidades: 25, ticketMedio: 270000, crescimento12m: 5.0, nivel: "baixo" },

  // Sinop
  { nome: "Centro", cidade: "Sinop", coords: [-11.864, -55.509], valorMedioM2: 5000, totalImoveis: 190, oportunidades: 28, ticketMedio: 420000, crescimento12m: 9.5, nivel: "alto" },
  { nome: "Residencial", cidade: "Sinop", coords: [-11.87, -55.5], valorMedioM2: 4000, totalImoveis: 250, oportunidades: 35, ticketMedio: 320000, crescimento12m: 7.0, nivel: "medio" },

  // Sorriso
  { nome: "Centro", cidade: "Sorriso", coords: [-12.5425, -55.7211], valorMedioM2: 4800, totalImoveis: 150, oportunidades: 22, ticketMedio: 400000, crescimento12m: 8.8, nivel: "alto" },

  // Lucas do Rio Verde
  { nome: "Centro", cidade: "Lucas do Rio Verde", coords: [-13.05, -55.91], valorMedioM2: 4600, totalImoveis: 130, oportunidades: 20, ticketMedio: 380000, crescimento12m: 8.5, nivel: "alto" },

  // Primavera do Leste
  { nome: "Centro", cidade: "Primavera do Leste", coords: [-15.56, -54.296], valorMedioM2: 5000, totalImoveis: 120, oportunidades: 18, ticketMedio: 420000, crescimento12m: 9.0, nivel: "alto" },

  // ── GOIÁS ──
  // Goiânia
  { nome: "Setor Bueno", cidade: "Goiânia", coords: [-16.706, -49.273], valorMedioM2: 9500, totalImoveis: 500, oportunidades: 65, ticketMedio: 950000, crescimento12m: 13.0, nivel: "alto" },
  { nome: "Setor Marista", cidade: "Goiânia", coords: [-16.71, -49.27], valorMedioM2: 10200, totalImoveis: 350, oportunidades: 45, ticketMedio: 1050000, crescimento12m: 14.2, nivel: "alto" },
  { nome: "Jardim Goiás", cidade: "Goiânia", coords: [-16.695, -49.245], valorMedioM2: 8800, totalImoveis: 280, oportunidades: 38, ticketMedio: 880000, crescimento12m: 11.5, nivel: "alto" },
  { nome: "Centro", cidade: "Goiânia", coords: [-16.6799, -49.255], valorMedioM2: 5500, totalImoveis: 400, oportunidades: 55, ticketMedio: 420000, crescimento12m: 6.0, nivel: "medio" },
  { nome: "Setor Oeste", cidade: "Goiânia", coords: [-16.682, -49.265], valorMedioM2: 7500, totalImoveis: 220, oportunidades: 30, ticketMedio: 680000, crescimento12m: 9.5, nivel: "alto" },
  { nome: "Campinas", cidade: "Goiânia", coords: [-16.673, -49.28], valorMedioM2: 4500, totalImoveis: 350, oportunidades: 48, ticketMedio: 340000, crescimento12m: 5.5, nivel: "medio" },
  { nome: "Vila Nova", cidade: "Goiânia", coords: [-16.72, -49.25], valorMedioM2: 3800, totalImoveis: 300, oportunidades: 42, ticketMedio: 280000, crescimento12m: 4.8, nivel: "baixo" },

  // Aparecida de Goiânia
  { nome: "Centro", cidade: "Aparecida de Goiânia", coords: [-16.82, -49.244], valorMedioM2: 3500, totalImoveis: 350, oportunidades: 50, ticketMedio: 260000, crescimento12m: 6.5, nivel: "medio" },
  { nome: "Cidade Vera Cruz", cidade: "Aparecida de Goiânia", coords: [-16.835, -49.25], valorMedioM2: 3000, totalImoveis: 280, oportunidades: 40, ticketMedio: 220000, crescimento12m: 5.0, nivel: "baixo" },

  // Anápolis
  { nome: "Centro", cidade: "Anápolis", coords: [-16.3267, -48.953], valorMedioM2: 4200, totalImoveis: 200, oportunidades: 28, ticketMedio: 340000, crescimento12m: 6.8, nivel: "medio" },
  { nome: "Jundiaí", cidade: "Anápolis", coords: [-16.32, -48.96], valorMedioM2: 5000, totalImoveis: 130, oportunidades: 18, ticketMedio: 420000, crescimento12m: 8.0, nivel: "alto" },

  // Rio Verde (GO)
  { nome: "Centro", cidade: "Rio Verde (GO)", coords: [-17.793, -50.919], valorMedioM2: 4500, totalImoveis: 160, oportunidades: 22, ticketMedio: 370000, crescimento12m: 7.5, nivel: "medio" },

  // Jataí (GO)
  { nome: "Centro", cidade: "Jataí", coords: [-17.882, -51.719], valorMedioM2: 3800, totalImoveis: 110, oportunidades: 15, ticketMedio: 300000, crescimento12m: 6.0, nivel: "medio" },

  // Caldas Novas
  { nome: "Centro", cidade: "Caldas Novas", coords: [-17.741, -48.625], valorMedioM2: 5200, totalImoveis: 180, oportunidades: 28, ticketMedio: 450000, crescimento12m: 10.0, nivel: "alto" },

  // ── MINAS GERAIS (Triângulo / Oeste) ──
  // Uberlândia
  { nome: "Centro", cidade: "Uberlândia", coords: [-18.9186, -48.2772], valorMedioM2: 6200, totalImoveis: 380, oportunidades: 50, ticketMedio: 520000, crescimento12m: 8.5, nivel: "medio" },
  { nome: "Santa Mônica", cidade: "Uberlândia", coords: [-18.91, -48.27], valorMedioM2: 7500, totalImoveis: 200, oportunidades: 28, ticketMedio: 650000, crescimento12m: 10.0, nivel: "alto" },
  { nome: "Saraiva", cidade: "Uberlândia", coords: [-18.925, -48.285], valorMedioM2: 5000, totalImoveis: 250, oportunidades: 35, ticketMedio: 400000, crescimento12m: 6.5, nivel: "medio" },

  // Uberaba
  { nome: "Centro", cidade: "Uberaba", coords: [-19.748, -47.932], valorMedioM2: 4800, totalImoveis: 220, oportunidades: 30, ticketMedio: 380000, crescimento12m: 6.8, nivel: "medio" },
  { nome: "Mercês", cidade: "Uberaba", coords: [-19.74, -47.94], valorMedioM2: 5500, totalImoveis: 140, oportunidades: 20, ticketMedio: 450000, crescimento12m: 8.0, nivel: "alto" },

  // ── SÃO PAULO (Interior / Oeste) ──
  // Presidente Prudente
  { nome: "Centro", cidade: "Presidente Prudente", coords: [-22.1207, -51.3882], valorMedioM2: 4800, totalImoveis: 200, oportunidades: 28, ticketMedio: 380000, crescimento12m: 6.5, nivel: "medio" },
  { nome: "Jardim Aviação", cidade: "Presidente Prudente", coords: [-22.115, -51.395], valorMedioM2: 5500, totalImoveis: 120, oportunidades: 18, ticketMedio: 460000, crescimento12m: 8.0, nivel: "alto" },

  // Araçatuba
  { nome: "Centro", cidade: "Araçatuba", coords: [-21.209, -50.433], valorMedioM2: 4200, totalImoveis: 180, oportunidades: 25, ticketMedio: 340000, crescimento12m: 6.0, nivel: "medio" },

  // Marília
  { nome: "Centro", cidade: "Marília", coords: [-22.2139, -49.9461], valorMedioM2: 4500, totalImoveis: 190, oportunidades: 26, ticketMedio: 360000, crescimento12m: 6.2, nivel: "medio" },

  // Bauru
  { nome: "Centro", cidade: "Bauru", coords: [-22.3147, -49.0606], valorMedioM2: 5200, totalImoveis: 280, oportunidades: 38, ticketMedio: 430000, crescimento12m: 7.5, nivel: "medio" },
  { nome: "Jardim América", cidade: "Bauru", coords: [-22.31, -49.05], valorMedioM2: 6000, totalImoveis: 150, oportunidades: 22, ticketMedio: 520000, crescimento12m: 8.8, nivel: "alto" },

  // Ribeirão Preto
  { nome: "Centro", cidade: "Ribeirão Preto", coords: [-21.1775, -47.8103], valorMedioM2: 6500, totalImoveis: 350, oportunidades: 48, ticketMedio: 550000, crescimento12m: 9.0, nivel: "alto" },
  { nome: "Jardim Irajá", cidade: "Ribeirão Preto", coords: [-21.17, -47.82], valorMedioM2: 7800, totalImoveis: 180, oportunidades: 25, ticketMedio: 700000, crescimento12m: 10.5, nivel: "alto" },
  { nome: "Campos Elíseos", cidade: "Ribeirão Preto", coords: [-21.185, -47.8], valorMedioM2: 5000, totalImoveis: 280, oportunidades: 40, ticketMedio: 400000, crescimento12m: 6.5, nivel: "medio" },

  // São José do Rio Preto
  { nome: "Centro", cidade: "São José do Rio Preto", coords: [-20.8113, -49.3758], valorMedioM2: 5500, totalImoveis: 300, oportunidades: 42, ticketMedio: 460000, crescimento12m: 7.8, nivel: "medio" },
  { nome: "Redentora", cidade: "São José do Rio Preto", coords: [-20.805, -49.38], valorMedioM2: 6800, totalImoveis: 160, oportunidades: 22, ticketMedio: 580000, crescimento12m: 9.5, nivel: "alto" },

  // ── PARANÁ (Norte / Oeste) ──
  // Londrina
  { nome: "Centro", cidade: "Londrina", coords: [-23.3045, -51.1696], valorMedioM2: 5800, totalImoveis: 320, oportunidades: 45, ticketMedio: 480000, crescimento12m: 8.0, nivel: "medio" },
  { nome: "Gleba Palhano", cidade: "Londrina", coords: [-23.33, -51.18], valorMedioM2: 7500, totalImoveis: 180, oportunidades: 25, ticketMedio: 680000, crescimento12m: 11.0, nivel: "alto" },
  { nome: "Bela Suíça", cidade: "Londrina", coords: [-23.31, -51.16], valorMedioM2: 4500, totalImoveis: 250, oportunidades: 35, ticketMedio: 350000, crescimento12m: 5.8, nivel: "medio" },

  // Maringá
  { nome: "Centro", cidade: "Maringá", coords: [-23.4209, -51.9331], valorMedioM2: 6200, totalImoveis: 300, oportunidades: 42, ticketMedio: 520000, crescimento12m: 9.0, nivel: "alto" },
  { nome: "Zona 7", cidade: "Maringá", coords: [-23.415, -51.94], valorMedioM2: 7000, totalImoveis: 170, oportunidades: 24, ticketMedio: 620000, crescimento12m: 10.2, nivel: "alto" },
  { nome: "Zona 2", cidade: "Maringá", coords: [-23.425, -51.925], valorMedioM2: 5000, totalImoveis: 220, oportunidades: 32, ticketMedio: 400000, crescimento12m: 6.8, nivel: "medio" },

  // Cascavel
  { nome: "Centro", cidade: "Cascavel", coords: [-24.9578, -53.459], valorMedioM2: 5000, totalImoveis: 240, oportunidades: 35, ticketMedio: 420000, crescimento12m: 7.5, nivel: "medio" },
  { nome: "Coqueiral", cidade: "Cascavel", coords: [-24.95, -53.45], valorMedioM2: 5800, totalImoveis: 130, oportunidades: 20, ticketMedio: 500000, crescimento12m: 8.8, nivel: "alto" },

  // Foz do Iguaçu
  { nome: "Centro", cidade: "Foz do Iguaçu", coords: [-25.5163, -54.5854], valorMedioM2: 4500, totalImoveis: 280, oportunidades: 40, ticketMedio: 360000, crescimento12m: 7.0, nivel: "medio" },
  { nome: "Jardim Lancaster", cidade: "Foz do Iguaçu", coords: [-25.51, -54.58], valorMedioM2: 5200, totalImoveis: 150, oportunidades: 22, ticketMedio: 440000, crescimento12m: 8.5, nivel: "alto" },
  { nome: "Vila A", cidade: "Foz do Iguaçu", coords: [-25.505, -54.575], valorMedioM2: 3800, totalImoveis: 200, oportunidades: 30, ticketMedio: 280000, crescimento12m: 5.0, nivel: "baixo" },

  // Umuarama
  { nome: "Centro", cidade: "Umuarama", coords: [-23.766, -53.325], valorMedioM2: 3500, totalImoveis: 130, oportunidades: 18, ticketMedio: 270000, crescimento12m: 5.5, nivel: "medio" },

  // ── RONDÔNIA ──
  // Porto Velho
  { nome: "Centro", cidade: "Porto Velho", coords: [-8.761, -63.9004], valorMedioM2: 4000, totalImoveis: 250, oportunidades: 35, ticketMedio: 320000, crescimento12m: 6.5, nivel: "medio" },
  { nome: "Embratel", cidade: "Porto Velho", coords: [-8.77, -63.89], valorMedioM2: 3200, totalImoveis: 300, oportunidades: 45, ticketMedio: 240000, crescimento12m: 4.8, nivel: "baixo" },

  // ── DISTRITO FEDERAL ──
  // Brasília
  { nome: "Asa Sul", cidade: "Brasília", coords: [-15.83, -47.92], valorMedioM2: 12000, totalImoveis: 400, oportunidades: 50, ticketMedio: 1200000, crescimento12m: 10.0, nivel: "alto" },
  { nome: "Asa Norte", cidade: "Brasília", coords: [-15.75, -47.88], valorMedioM2: 11500, totalImoveis: 380, oportunidades: 48, ticketMedio: 1100000, crescimento12m: 9.5, nivel: "alto" },
  { nome: "Águas Claras", cidade: "Brasília", coords: [-15.84, -48.02], valorMedioM2: 7500, totalImoveis: 500, oportunidades: 70, ticketMedio: 620000, crescimento12m: 8.5, nivel: "alto" },
  { nome: "Taguatinga", cidade: "Brasília", coords: [-15.837, -48.05], valorMedioM2: 4800, totalImoveis: 400, oportunidades: 55, ticketMedio: 380000, crescimento12m: 6.0, nivel: "medio" },
  { nome: "Samambaia", cidade: "Brasília", coords: [-15.877, -48.08], valorMedioM2: 3500, totalImoveis: 450, oportunidades: 65, ticketMedio: 260000, crescimento12m: 4.5, nivel: "baixo" },

  // ── SÃO PAULO ── (Zona Sul: Av. Paulista → Jabaquara)
  { nome: "Bela Vista", cidade: "São Paulo", coords: [-23.5614, -46.6469], valorMedioM2: 13500, totalImoveis: 520, oportunidades: 70, ticketMedio: 1250000, crescimento12m: 8.5, nivel: "alto" },
  { nome: "Jardim Paulista", cidade: "São Paulo", coords: [-23.5707, -46.6663], valorMedioM2: 16800, totalImoveis: 480, oportunidades: 60, ticketMedio: 1850000, crescimento12m: 9.2, nivel: "alto" },
  { nome: "Cerqueira César", cidade: "São Paulo", coords: [-23.5613, -46.6700], valorMedioM2: 15500, totalImoveis: 360, oportunidades: 48, ticketMedio: 1650000, crescimento12m: 8.8, nivel: "alto" },
  { nome: "Consolação", cidade: "São Paulo", coords: [-23.5547, -46.6610], valorMedioM2: 12800, totalImoveis: 410, oportunidades: 55, ticketMedio: 980000, crescimento12m: 7.5, nivel: "alto" },
  { nome: "Itaim Bibi", cidade: "São Paulo", coords: [-23.5859, -46.6770], valorMedioM2: 17500, totalImoveis: 450, oportunidades: 58, ticketMedio: 1950000, crescimento12m: 10.1, nivel: "alto" },
  { nome: "Vila Olímpia", cidade: "São Paulo", coords: [-23.5955, -46.6859], valorMedioM2: 16200, totalImoveis: 380, oportunidades: 50, ticketMedio: 1700000, crescimento12m: 9.8, nivel: "alto" },
  { nome: "Moema", cidade: "São Paulo", coords: [-23.6018, -46.6650], valorMedioM2: 15000, totalImoveis: 520, oportunidades: 65, ticketMedio: 1450000, crescimento12m: 8.7, nivel: "alto" },
  { nome: "Vila Mariana", cidade: "São Paulo", coords: [-23.5895, -46.6347], valorMedioM2: 12500, totalImoveis: 490, oportunidades: 62, ticketMedio: 1100000, crescimento12m: 7.9, nivel: "alto" },
  { nome: "Paraíso", cidade: "São Paulo", coords: [-23.5751, -46.6448], valorMedioM2: 13800, totalImoveis: 320, oportunidades: 42, ticketMedio: 1180000, crescimento12m: 8.0, nivel: "alto" },
  { nome: "Aclimação", cidade: "São Paulo", coords: [-23.5683, -46.6275], valorMedioM2: 11500, totalImoveis: 280, oportunidades: 38, ticketMedio: 920000, crescimento12m: 7.2, nivel: "medio" },
  { nome: "Ipiranga", cidade: "São Paulo", coords: [-23.5879, -46.6101], valorMedioM2: 8500, totalImoveis: 410, oportunidades: 55, ticketMedio: 680000, crescimento12m: 6.5, nivel: "medio" },
  { nome: "Saúde", cidade: "São Paulo", coords: [-23.6189, -46.6396], valorMedioM2: 11000, totalImoveis: 380, oportunidades: 50, ticketMedio: 880000, crescimento12m: 7.0, nivel: "medio" },
  { nome: "Mirandópolis", cidade: "São Paulo", coords: [-23.6094, -46.6463], valorMedioM2: 11800, totalImoveis: 290, oportunidades: 38, ticketMedio: 950000, crescimento12m: 7.3, nivel: "alto" },
  { nome: "Vila Clementino", cidade: "São Paulo", coords: [-23.5985, -46.6398], valorMedioM2: 12200, totalImoveis: 320, oportunidades: 42, ticketMedio: 1020000, crescimento12m: 7.6, nivel: "alto" },
  { nome: "Campo Belo", cidade: "São Paulo", coords: [-23.6206, -46.6705], valorMedioM2: 13500, totalImoveis: 360, oportunidades: 45, ticketMedio: 1280000, crescimento12m: 8.2, nivel: "alto" },
  { nome: "Brooklin", cidade: "São Paulo", coords: [-23.6128, -46.6853], valorMedioM2: 14200, totalImoveis: 400, oportunidades: 52, ticketMedio: 1380000, crescimento12m: 8.5, nivel: "alto" },
  { nome: "Santo Amaro", cidade: "São Paulo", coords: [-23.6500, -46.7090], valorMedioM2: 9500, totalImoveis: 470, oportunidades: 60, ticketMedio: 760000, crescimento12m: 6.8, nivel: "medio" },
  { nome: "Jabaquara", cidade: "São Paulo", coords: [-23.6469, -46.6428], valorMedioM2: 8200, totalImoveis: 520, oportunidades: 70, ticketMedio: 620000, crescimento12m: 6.2, nivel: "medio" },
  { nome: "Vila Guarani", cidade: "São Paulo", coords: [-23.6358, -46.6395], valorMedioM2: 7800, totalImoveis: 380, oportunidades: 50, ticketMedio: 580000, crescimento12m: 5.8, nivel: "medio" },
  { nome: "Planalto Paulista", cidade: "São Paulo", coords: [-23.6229, -46.6531], valorMedioM2: 12500, totalImoveis: 240, oportunidades: 32, ticketMedio: 1080000, crescimento12m: 7.5, nivel: "alto" },
  { nome: "Chácara Klabin", cidade: "São Paulo", coords: [-23.5871, -46.6230], valorMedioM2: 11800, totalImoveis: 260, oportunidades: 35, ticketMedio: 1000000, crescimento12m: 7.4, nivel: "alto" },
  { nome: "Cambuci", cidade: "São Paulo", coords: [-23.5689, -46.6191], valorMedioM2: 8800, totalImoveis: 310, oportunidades: 42, ticketMedio: 680000, crescimento12m: 6.0, nivel: "medio" },
];

export const CIDADES_EQUITY = [...new Set(BAIRROS_EQUITY.map(b => b.cidade))];
