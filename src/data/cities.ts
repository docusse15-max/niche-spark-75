export type Cidade =
  | "Campo Grande"
  | "Dourados"
  | "Ponta Porã"
  | "Aquidauana"
  | "Sidrolândia"
  | "Bonito"
  | "Corumbá"
  | "Maracaju"
  | "Rio Brilhante"
  | "Costa Rica"
  | "Cuiabá"
  | "Brasília"
  | "Goiânia"
  | "São Paulo";

export const CIDADES: Cidade[] = [
  "Campo Grande", "Dourados", "Ponta Porã", "Aquidauana",
  "Sidrolândia", "Bonito", "Corumbá", "Maracaju", "Rio Brilhante", "Costa Rica",
  "Cuiabá", "Brasília", "Goiânia", "São Paulo",
];

export type Bairro = string;

export interface CidadeConfig {
  center: [number, number];
  bairros: { nome: string; coords: [number, number] }[];
}

export const CIDADE_CONFIGS: Record<Cidade, CidadeConfig> = {
  "Campo Grande": {
    center: [-20.4697, -54.6201],
    bairros: [
      { nome: "Centro", coords: [-20.4697, -54.6201] },
      { nome: "Jardim dos Estados", coords: [-20.4580, -54.6150] },
      { nome: "Chácara Cachoeira", coords: [-20.4520, -54.6050] },
      { nome: "Santa Fé", coords: [-20.4800, -54.6350] },
      { nome: "Aero Rancho", coords: [-20.5000, -54.6500] },
      { nome: "Vila Alba", coords: [-20.4750, -54.5950] },
      { nome: "Vila Nasser", coords: [-20.4850, -54.6100] },
      { nome: "Coronel Antonino", coords: [-20.4650, -54.6400] },
      { nome: "Universitário", coords: [-20.5050, -54.6150] },
      { nome: "Tiradentes", coords: [-20.4550, -54.6300] },
      { nome: "Monte Castelo", coords: [-20.4620, -54.6050] },
      { nome: "Carandá Bosque", coords: [-20.4480, -54.5980] },
    ],
  },
  "Dourados": {
    center: [-22.2233, -54.8083],
    bairros: [
      { nome: "Centro", coords: [-22.2233, -54.8083] },
      { nome: "Jardim América", coords: [-22.2180, -54.8150] },
      { nome: "Vila Industrial", coords: [-22.2300, -54.8000] },
      { nome: "Parque das Nações", coords: [-22.2150, -54.8050] },
      { nome: "Jardim Clímax", coords: [-22.2280, -54.8180] },
      { nome: "Vila Progresso", coords: [-22.2350, -54.8100] },
    ],
  },
  "Ponta Porã": {
    center: [-22.5357, -55.7256],
    bairros: [
      { nome: "Centro", coords: [-22.5357, -55.7256] },
      { nome: "Vila Rica", coords: [-22.5300, -55.7200] },
      { nome: "Jardim Europa", coords: [-22.5400, -55.7300] },
      { nome: "Vila Nova", coords: [-22.5280, -55.7180] },
    ],
  },
  "Aquidauana": {
    center: [-20.4711, -55.7872],
    bairros: [
      { nome: "Centro", coords: [-20.4711, -55.7872] },
      { nome: "Vila Trindade", coords: [-20.4750, -55.7900] },
      { nome: "Cidade Nova", coords: [-20.4680, -55.7830] },
      { nome: "Vila Boa", coords: [-20.4730, -55.7950] },
    ],
  },
  "Sidrolândia": {
    center: [-20.9306, -54.9611],
    bairros: [
      { nome: "Centro", coords: [-20.9306, -54.9611] },
      { nome: "Vila Alegre", coords: [-20.9280, -54.9580] },
      { nome: "Jardim Primavera", coords: [-20.9340, -54.9650] },
    ],
  },
  "Bonito": {
    center: [-21.1261, -56.4836],
    bairros: [
      { nome: "Centro", coords: [-21.1261, -56.4836] },
      { nome: "Vila Donária", coords: [-21.1230, -56.4800] },
      { nome: "Jardim das Colinas", coords: [-21.1290, -56.4870] },
    ],
  },
  "Corumbá": {
    center: [-19.0092, -57.6513],
    bairros: [
      { nome: "Centro", coords: [-19.0092, -57.6513] },
      { nome: "Cristo Redentor", coords: [-19.0050, -57.6480] },
      { nome: "Dom Bosco", coords: [-19.0130, -57.6550] },
      { nome: "Popular Nova", coords: [-19.0070, -57.6600] },
    ],
  },
  "Maracaju": {
    center: [-21.6142, -55.1678],
    bairros: [
      { nome: "Centro", coords: [-21.6142, -55.1678] },
      { nome: "Vila Margarida", coords: [-21.6120, -55.1650] },
      { nome: "Jardim das Flores", coords: [-21.6170, -55.1710] },
    ],
  },
  "Rio Brilhante": {
    center: [-21.8014, -54.5461],
    bairros: [
      { nome: "Centro", coords: [-21.8014, -54.5461] },
      { nome: "Vila Nova", coords: [-21.7990, -54.5430] },
      { nome: "Jardim Progresso", coords: [-21.8040, -54.5490] },
    ],
  },
  "Costa Rica": {
    center: [-18.5443, -53.1281],
    bairros: [
      { nome: "Centro", coords: [-18.5443, -53.1281] },
      { nome: "Vila Alta", coords: [-18.5420, -53.1250] },
      { nome: "Jardim Aeroporto", coords: [-18.5470, -53.1310] },
      { nome: "Vila São Pedro", coords: [-18.5400, -53.1300] },
      { nome: "Bairro Industrial", coords: [-18.5490, -53.1230] },
    ],
  },
  "Cuiabá": {
    center: [-15.6014, -56.0979],
    bairros: [
      { nome: "Centro", coords: [-15.6014, -56.0979] },
      { nome: "Jardim Aclimação", coords: [-15.5870, -56.0900] },
      { nome: "Goiabeiras", coords: [-15.5780, -56.0850] },
      { nome: "Bosque da Saúde", coords: [-15.6100, -56.1000] },
      { nome: "Jardim Cuiabá", coords: [-15.5950, -56.0750] },
      { nome: "Coxipó", coords: [-15.6300, -56.0650] },
      { nome: "Santa Rosa", coords: [-15.5900, -56.0650] },
      { nome: "Ribeirão do Lipa", coords: [-15.5650, -56.0900] },
    ],
  },
  "Brasília": {
    center: [-15.7942, -47.8822],
    bairros: [
      { nome: "Asa Sul", coords: [-15.8200, -47.9100] },
      { nome: "Asa Norte", coords: [-15.7600, -47.8700] },
      { nome: "Lago Sul", coords: [-15.8400, -47.8700] },
      { nome: "Lago Norte", coords: [-15.7400, -47.8400] },
      { nome: "Sudoeste", coords: [-15.8000, -47.9300] },
      { nome: "Águas Claras", coords: [-15.8350, -48.0250] },
      { nome: "Taguatinga", coords: [-15.8330, -48.0570] },
      { nome: "Park Sul", coords: [-15.8280, -47.9530] },
      { nome: "Noroeste", coords: [-15.7530, -47.9100] },
    ],
  },
  "Goiânia": {
    center: [-16.6864, -49.2643],
    bairros: [
      { nome: "Setor Bueno", coords: [-16.7050, -49.2780] },
      { nome: "Setor Marista", coords: [-16.7000, -49.2650] },
      { nome: "Setor Oeste", coords: [-16.6800, -49.2750] },
      { nome: "Jardim Goiás", coords: [-16.7100, -49.2400] },
      { nome: "Setor Sul", coords: [-16.6950, -49.2550] },
      { nome: "Alto da Glória", coords: [-16.7150, -49.2520] },
      { nome: "Setor Bela Vista", coords: [-16.7200, -49.2680] },
      { nome: "Centro", coords: [-16.6800, -49.2530] },
      { nome: "Setor Aeroporto", coords: [-16.6950, -49.2280] },
    ],
  },
  "São Paulo": {
    center: [-23.6100, -46.6500],
    bairros: [
      { nome: "Bela Vista", coords: [-23.5614, -46.6500] },
      { nome: "Jardim Paulista", coords: [-23.5680, -46.6580] },
      { nome: "Cerqueira César", coords: [-23.5620, -46.6680] },
      { nome: "Paraíso", coords: [-23.5760, -46.6450] },
      { nome: "Vila Mariana", coords: [-23.5870, -46.6340] },
      { nome: "Aclimação", coords: [-23.5750, -46.6260] },
      { nome: "Ipiranga", coords: [-23.5920, -46.6100] },
      { nome: "Saúde", coords: [-23.6180, -46.6400] },
      { nome: "Mirandópolis", coords: [-23.6080, -46.6500] },
      { nome: "Bosque da Saúde", coords: [-23.6200, -46.6280] },
      { nome: "Moema", coords: [-23.6010, -46.6650] },
      { nome: "Indianópolis", coords: [-23.5930, -46.6620] },
      { nome: "Campo Belo", coords: [-23.6230, -46.6720] },
      { nome: "Brooklin", coords: [-23.6100, -46.6900] },
      { nome: "Vila Olímpia", coords: [-23.5960, -46.6840] },
      { nome: "Itaim Bibi", coords: [-23.5860, -46.6750] },
      { nome: "Chácara Klabin", coords: [-23.5990, -46.6280] },
      { nome: "Praça da Árvore", coords: [-23.6240, -46.6390] },
      { nome: "Conceição", coords: [-23.6360, -46.6420] },
      { nome: "Jabaquara", coords: [-23.6470, -46.6440] },
      { nome: "Planalto Paulista", coords: [-23.6160, -46.6580] },
      { nome: "Vila Clementino", coords: [-23.5980, -46.6440] },
    ],
  },
};

export function getAllBairros(): string[] {
  const bairros = new Set<string>();
  for (const cidade of CIDADES) {
    for (const b of CIDADE_CONFIGS[cidade].bairros) {
      bairros.add(`${b.nome} - ${cidade}`);
    }
  }
  return Array.from(bairros);
}

export function getBairroCoords(bairroLabel: string): [number, number] | null {
  for (const cidade of CIDADES) {
    for (const b of CIDADE_CONFIGS[cidade].bairros) {
      if (`${b.nome} - ${cidade}` === bairroLabel) return b.coords;
    }
  }
  return null;
}
