export type LeadStatus =
  | "novo"
  | "sem_contato"
  | "primeiro_contato"
  | "em_conversa"
  | "reuniao_agendada"
  | "proposta_enviada"
  | "em_negociacao"
  | "fechado"
  | "perdido";

export type LeadTemperature = "frio" | "morno" | "quente";
export type LeadPotential = "baixo" | "medio" | "alto" | "premium";

export type Nicho =
  | "Clínica de Estética"
  | "Odontologia"
  | "Pet Shop"
  | "Academia"
  | "Clínica de Saúde"
  | "Nutrição"
  | "Psicologia"
  | "Automotivo"
  | "Serviços B2B"
  | "Salão de Beleza"
  | "Fisioterapia"
  | "Educação"
  | "Coworking"
  | "Contabilidade"
  | "Limpeza Empresarial";

export type Bairro =
  | "Centro"
  | "Jardim dos Estados"
  | "Chácara Cachoeira"
  | "Santa Fé"
  | "Aero Rancho"
  | "Vila Alba"
  | "Vila Nasser"
  | "Coronel Antonino"
  | "Universitário"
  | "Outras";

export interface LeadInteraction {
  date: string;
  type: string;
  note: string;
  author?: string;
}

export interface Lead {
  id: string;
  empresa: string;
  segmento: Nicho;
  bairro: Bairro;
  telefone: string;
  instagram: string;
  potencial: LeadPotential;
  temperatura: LeadTemperature;
  status: LeadStatus;
  ultimoContato: string;
  proximaAcao: string;
  responsavel: string;
  observacoes: string;
  descricao: string;
  motivoRecorrencia: string;
  historico: LeadInteraction[];
  lat?: number;
  lng?: number;
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  sem_contato: "Sem contato",
  primeiro_contato: "Primeiro contato",
  em_conversa: "Em conversa",
  reuniao_agendada: "Reunião agendada",
  proposta_enviada: "Proposta enviada",
  em_negociacao: "Em negociação",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  novo: "bg-blue-100 text-blue-800",
  sem_contato: "bg-gray-100 text-gray-800",
  primeiro_contato: "bg-yellow-100 text-yellow-800",
  em_conversa: "bg-orange-100 text-orange-800",
  reuniao_agendada: "bg-purple-100 text-purple-800",
  proposta_enviada: "bg-indigo-100 text-indigo-800",
  em_negociacao: "bg-cyan-100 text-cyan-800",
  fechado: "bg-green-100 text-green-800",
  perdido: "bg-red-100 text-red-800",
};

export const TEMP_COLORS: Record<LeadTemperature, string> = {
  frio: "bg-sky-100 text-sky-800",
  morno: "bg-amber-100 text-amber-800",
  quente: "bg-red-100 text-red-800",
};

export const POTENTIAL_COLORS: Record<LeadPotential, string> = {
  baixo: "bg-gray-100 text-gray-600",
  medio: "bg-blue-100 text-blue-700",
  alto: "bg-emerald-100 text-emerald-700",
  premium: "bg-yellow-100 text-yellow-800",
};

export const NICHOS: Nicho[] = [
  "Clínica de Estética", "Odontologia", "Pet Shop", "Academia",
  "Clínica de Saúde", "Nutrição", "Psicologia", "Automotivo",
  "Serviços B2B", "Salão de Beleza", "Fisioterapia", "Educação",
  "Coworking", "Contabilidade", "Limpeza Empresarial",
];

export const BAIRROS: Bairro[] = [
  "Centro", "Jardim dos Estados", "Chácara Cachoeira", "Santa Fé",
  "Aero Rancho", "Vila Alba", "Vila Nasser", "Coronel Antonino",
  "Universitário", "Outras",
];

export const BAIRRO_COORDS: Record<Bairro, [number, number]> = {
  "Centro": [-20.4697, -54.6201],
  "Jardim dos Estados": [-20.4580, -54.6150],
  "Chácara Cachoeira": [-20.4520, -54.6050],
  "Santa Fé": [-20.4800, -54.6350],
  "Aero Rancho": [-20.5000, -54.6500],
  "Vila Alba": [-20.4750, -54.5950],
  "Vila Nasser": [-20.4850, -54.6100],
  "Coronel Antonino": [-20.4650, -54.6400],
  "Universitário": [-20.5050, -54.6150],
  "Outras": [-20.4900, -54.5800],
};

export const COMERCIAIS = ["Dorileu", "Felipe", "Gabi", "Janna"] as const;
export type Comercial = typeof COMERCIAIS[number];

export const RESPONSAVEIS = ["Dorileu", "Felipe", "Gabi", "Janna"];

function lead(id: string, empresa: string, segmento: Nicho, bairro: Bairro, telefone: string, instagram: string, potencial: LeadPotential, descricao: string, motivoRecorrencia: string): Lead {
  const base = BAIRRO_COORDS[bairro];
  return {
    id, empresa, segmento, bairro, telefone, instagram, potencial,
    temperatura: "frio", status: "novo", ultimoContato: "", proximaAcao: "",
    responsavel: "", observacoes: "", descricao, motivoRecorrencia,
    historico: [],
    lat: base[0] + (Math.random() - 0.5) * 0.012,
    lng: base[1] + (Math.random() - 0.5) * 0.012,
  };
}

// ===== EMPRESA NAMES PER NICHO =====
const EMPRESA_NAMES: Record<Nicho, string[]> = {
  "Clínica de Estética": ["Estética Prime", "Bella Vita", "Dermavida", "Skin Center", "Corpo Ideal", "Estética Royal", "Beleza Pura", "Glow Clinic", "Estética Avançada", "Face Art", "Beauty Lab", "Estética Zen", "DermaGold", "Pele Perfeita", "Estética Sublime", "Beauty Premium", "Harmonia Facial", "Spa Beleza", "Estética Renova", "Studio Beauty"],
  "Odontologia": ["Odonto Premium", "Sorriso Perfeito", "Dente Saudável", "Odonto Smile", "Oral Center", "Clínica Sorriso", "Odonto Plus", "Dental Care CG", "OdontoVida", "Sorriso CG", "Implante Fácil", "Dental Gold", "Odonto Master", "Sorriso Real", "Dental Prime", "OdontoExcel", "Clínica Dental Art", "Odonto Family", "Sorriso Brilhante", "Dental Saúde"],
  "Pet Shop": ["PetLove CG", "Vet Life", "Dog & Cat Pet", "PetBanho", "Pet Center", "Bicho Bom", "Pet Feliz", "Au Au Pet", "Miau & Cia", "Pet Paradise", "Animal Planet CG", "Pet Amigo", "Vet Care CG", "PetClean", "Pet Saúde", "Animal Life", "Pet Style", "Vet Plus", "PetMania", "Zoo Pet"],
  "Academia": ["CrossFit CG Box", "Gym Power", "Studio Fitness Pro", "Academia Flex", "Espaço Zen Yoga", "Iron Body", "Fit & Strong", "Power Gym", "Body Tech CG", "Fitness Gold", "Muscle Factory", "Energy Gym", "Funcional CG", "Alpha Fitness", "Strong Body", "Mega Gym", "Wellness Studio", "Fit4Life", "Pro Training", "Athletic Center"],
  "Clínica de Saúde": ["Clínica Derma Plus", "Clínica Vitalis", "Saúde Integral", "MedCenter CG", "Clínica Vida", "Centro Médico CG", "Clínica Saúde+", "MedVida", "Clínica Bem Estar", "Saúde Premium", "Centro Clínico CG", "Clínica Harmonia", "MedGold", "Clínica Popular CG", "Saúde Total", "Clínica Nova Vida", "MedPlus CG", "Clínica Esperança", "Centro Saúde", "Clínica Renascer"],
  "Nutrição": ["Dra. Camila Nutrição", "Nutri Vida", "Nutri Fit", "Nutri Balance", "Saúde no Prato", "Nutri Corpo", "NutriPlan CG", "Nutri Gold", "Vida Saudável", "Nutri Expert", "NutriCenter", "Dieta Certa", "Nutri Soul", "Nutri Funcional", "Nutri Prime", "Nutri Lab", "Nutri Natural", "Nutri Wellness", "Nutri Plus CG", "Nutri Master"],
  "Psicologia": ["Psi Mente", "Espaço Terapia", "Mente Viva", "Psi Center", "Equilíbrio Mental", "Psi Saúde", "Mente Plena", "Psi Care", "Sentir & Ser", "Psi Gold", "Clínica da Mente", "Psi Bem Estar", "Mente & Corpo", "Psi Integral", "Psi Acolher", "Mente Livre", "Psi Harmonia", "Mente Sã", "Psi Renova", "Psi Evolução"],
  "Automotivo": ["Auto Shine Detailing", "Lava Jato Premium", "Auto Center", "Mecânica do Povo", "Car Clean", "Auto Pro", "Speed Car", "Auto Gold", "Car Spa", "Auto Brilho", "MasterCar", "Auto Express", "Car Premium", "Auto Mais", "Auto Total", "Car Life", "Auto Élite", "Speed Lav", "Auto Clean CG", "Car Tech"],
  "Serviços B2B": ["Tech Solutions CG", "Copy & Print", "Solar Clean", "ContaFácil", "Empada da Boa", "Digital Force", "Promo CG", "Marketing Pro", "Data Systems", "Office Solutions", "BizTech CG", "Smart Services", "Pro Solutions", "Connect CG", "Inova Serviços", "Alfa Soluções", "NetWork CG", "Business Pro", "Serv Mais", "Soluções CG"],
  "Salão de Beleza": ["Barber King CG", "Salão da Rê", "Beleza & Arte", "Instituto Cabelo", "Barbearia Corte Certo", "Studio Hair", "Hair Gold", "Beleza Express", "Salão Premium", "Corte & Estilo", "Hair Master", "Salão Charme", "Beauty Hair", "Hair Pro", "Salão da Ana", "Barbearia Style", "Hair Center", "Salão Glamour", "Corte & Cor", "Hair Studio"],
  "Fisioterapia": ["Fisio Move", "Fisio Integral", "Fisio Life", "Fisio Center", "Fisio Plus", "Fisio Gold", "Reabilitar CG", "Fisio Sport", "Corpo Ativo", "Fisio Saúde", "Fisio Expert", "Fisio Premium", "Fisio Funcional", "Reab Center", "Fisio Body", "Fisio Care", "Movimento Vital", "Fisio Total", "Fisio Bem Estar", "Fisio Master"],
  "Educação": ["English Now CG", "Escola Futuro Brilhante", "CursoCG", "Aprender+", "Instituto Saber", "Escola Moderna", "Educação Prime", "Centro Educacional", "Saber Mais CG", "Instituto CG", "Academia do Saber", "Escola Tech", "Cursinho CG", "EduCenter", "Aprendiz CG", "Escola Nova", "Instituto Ensino", "Edu Plus", "Escola Criativa", "Centro de Cursos"],
  "Coworking": ["Smart Cowork", "Espaço Maker", "Hub CG", "Cowork Prime", "Office Hub", "Work Center", "Co.Lab CG", "Cowork Gold", "StartHub", "Work Space CG", "Business Hub", "Cowork Plus", "Innovation Hub", "Desk CG", "Work & Create", "Cowork Life", "Hub Digital", "Space Work", "Cowork Connect", "Office Share"],
  "Contabilidade": ["ContaFácil", "Contabilidade Prime", "Conta Certa", "ContaGold", "Fiscal Plus", "Contabil CG", "Conta Fiel", "ContaMais", "Gestão Contábil", "Contabil Expert", "Conta Pro", "Fiscal CG", "ContaCenter", "Gestão Fiscal", "ContaExpress", "Fiscal Total", "Conta Master", "ContaVida", "Gestão CG", "Fiscal Prime"],
  "Limpeza Empresarial": ["CleanPro", "Clean House", "Limpeza Total MS", "Super Clean", "Clean Gold", "Clean Express", "Limpeza Premium", "Clean Master", "Higiene Total", "Clean & Shine", "Limpeza Pro", "Clean Care", "Brilho Total", "Clean Force", "Limpeza Fácil", "Clean Jet", "Limpeza CG", "Clean Star", "Limpeza Excel", "Clean Plus"],
};

const DESCRICOES: Record<Nicho, string> = {
  "Clínica de Estética": "Clínica especializada em procedimentos estéticos faciais e corporais.",
  "Odontologia": "Clínica odontológica com foco em tratamentos preventivos e estéticos.",
  "Pet Shop": "Pet shop completo com banho, tosa, veterinário e produtos.",
  "Academia": "Espaço fitness com musculação, aulas coletivas e personal trainer.",
  "Clínica de Saúde": "Clínica médica multiespecialidade com atendimento contínuo.",
  "Nutrição": "Consultório de nutrição com acompanhamento mensal personalizado.",
  "Psicologia": "Clínica de psicologia com atendimento individual e em grupo.",
  "Automotivo": "Centro automotivo com serviços de manutenção e estética veicular.",
  "Serviços B2B": "Empresa de serviços corporativos com contratos empresariais.",
  "Salão de Beleza": "Salão com serviços de cabelo, unhas, maquiagem e estética.",
  "Fisioterapia": "Clínica de fisioterapia com reabilitação e prevenção.",
  "Educação": "Instituição de ensino com cursos e acompanhamento contínuo.",
  "Coworking": "Espaço de trabalho compartilhado com planos mensais.",
  "Contabilidade": "Escritório contábil com gestão fiscal e tributária.",
  "Limpeza Empresarial": "Empresa de limpeza e conservação para espaços comerciais.",
};

const MOTIVOS: Record<Nicho, string> = {
  "Clínica de Estética": "Tratamentos estéticos requerem múltiplas sessões e manutenção contínua.",
  "Odontologia": "Manutenção ortodôntica e check-ups semestrais geram recorrência natural.",
  "Pet Shop": "Banho e tosa mensal, ração por assinatura, plano de saúde pet.",
  "Academia": "Mensalidades recorrentes são o modelo padrão do setor.",
  "Clínica de Saúde": "Acompanhamento de pacientes crônicos e check-ups periódicos.",
  "Nutrição": "Consultas mensais de acompanhamento e planos alimentares.",
  "Psicologia": "Terapia é naturalmente recorrente com sessões semanais/quinzenais.",
  "Automotivo": "Manutenção preventiva periódica e lavagem recorrente.",
  "Serviços B2B": "Contratos de serviço mensal são padrão no segmento.",
  "Salão de Beleza": "Clientes retornam a cada 15-30 dias para manutenção.",
  "Fisioterapia": "Sessões contínuas por semanas/meses com pacotes de tratamento.",
  "Educação": "Mensalidades de cursos e acompanhamento educacional contínuo.",
  "Coworking": "Planos mensais de uso do espaço e serviços adicionais.",
  "Contabilidade": "Honorários mensais fixos para gestão contábil e fiscal.",
  "Limpeza Empresarial": "Contratos mensais/quinzenais de limpeza e conservação.",
};

function generatePhone(): string {
  const prefix = ["67"];
  const mid = ["99", "98", "97", "96"];
  const p = prefix[0];
  const m = mid[Math.floor(Math.random() * mid.length)];
  const n1 = String(Math.floor(Math.random() * 900) + 100);
  const n2 = String(Math.floor(Math.random() * 9000) + 1000);
  return `(${p}) ${m}${n1}-${n2}`;
}

function generateLeads(): Lead[] {
  const leads: Lead[] = [];
  let id = 1;
  const potenciais: LeadPotential[] = ["baixo", "medio", "alto", "premium"];
  const potencialWeights = [0.15, 0.35, 0.35, 0.15];

  function pickPotencial(): LeadPotential {
    const r = Math.random();
    let cum = 0;
    for (let i = 0; i < potenciais.length; i++) {
      cum += potencialWeights[i];
      if (r < cum) return potenciais[i];
    }
    return "medio";
  }

  // Distribute ~300 leads across nichos and bairros
  for (const nicho of NICHOS) {
    const names = EMPRESA_NAMES[nicho];
    const count = Math.floor(300 / NICHOS.length); // ~20 per nicho
    for (let i = 0; i < count && i < names.length; i++) {
      const bairro = BAIRROS[Math.floor(Math.random() * BAIRROS.length)];
      const empresa = names[i] + (bairro !== "Outras" ? ` ${bairro.split(" ")[0]}` : "");
      const instagram = `@${names[i].toLowerCase().replace(/[^a-z0-9]/g, "")}.cg`;
      leads.push(lead(
        String(id++),
        empresa,
        nicho,
        bairro,
        generatePhone(),
        instagram,
        pickPotencial(),
        DESCRICOES[nicho],
        MOTIVOS[nicho],
      ));
    }
  }

  return leads;
}

const MOCK_LEADS: Lead[] = generateLeads();

export function getInitialLeads(): Lead[] {
  const stored = localStorage.getItem("crm_leads_v3");
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  return MOCK_LEADS;
}

export function saveLeads(leads: Lead[]) {
  localStorage.setItem("crm_leads_v3", JSON.stringify(leads));
}

// ===== ACTIVITY LOG =====
export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  leadEmpresa: string;
  leadId: string;
  author: string;
  details: string;
}

export function getActivityLog(): ActivityLogEntry[] {
  const stored = localStorage.getItem("crm_activity_log");
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  return [];
}

export function addActivityLog(entry: Omit<ActivityLogEntry, "id" | "timestamp">) {
  const log = getActivityLog();
  log.unshift({
    ...entry,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("crm_activity_log", JSON.stringify(log.slice(0, 500)));
}

export const SALES_ARGUMENTS = [
  { title: "Previsibilidade de receita", text: "Em vez de depender de vendas pontuais, seu cliente sabe exatamente quanto entra todo mês. Use: 'Imagine saber no dia 1º quanto vai faturar no mês inteiro.'" },
  { title: "Redução de inadimplência", text: "Cobrança automática no cartão reduz inadimplência de 20-30% para menos de 5%. Use: 'Chega de ficar cobrando cliente por cliente.'" },
  { title: "Retenção de clientes", text: "Cliente recorrente fica 3x mais tempo que cliente avulso. Use: 'Seu cliente já volta todo mês — por que não garantir isso no contrato?'" },
  { title: "Aumento de LTV", text: "Cliente recorrente gasta 2.5x mais ao longo do tempo. Use: 'Um cliente de R$200/mês vale R$2.400/ano garantidos.'" },
  { title: "Profissionalização da operação", text: "Sistema de recorrência organiza agenda, pagamento e relacionamento. Use: 'Sair da planilha e do caderninho muda o jogo.'" },
  { title: "Escala sem aumentar equipe", text: "Automatizando cobrança e gestão, cresce sem contratar. Use: 'Você pode dobrar os clientes sem dobrar a dor de cabeça.'" },
  { title: "Valuation do negócio", text: "Negócio com receita recorrente vale 3-5x mais na venda. Use: 'Se um dia quiser vender, recorrência é o que mais valoriza.'" },
  { title: "Previsibilidade de caixa", text: "Permite planejar investimentos, contratar e crescer com segurança. Use: 'Parar de apagar incêndio e começar a planejar crescimento.'" },
];

export const SCRIPTS = {
  abertura: `Olá, tudo bem? Vi que vocês atuam no segmento de [SEGMENTO] aqui em Campo Grande e queria te mostrar uma forma de transformar atendimentos recorrentes em receita mensal previsível, sem aumentar complexidade na operação.`,
  gatilho: `Muitos negócios como o de vocês já têm clientes que voltam todo mês, mas ainda não estruturaram isso da forma certa. O resultado? Perdem clientes que poderiam ficar anos pagando mensalidade.`,
  fechamento: `Se fizer sentido pra vocês, te explico em 15 minutos como isso pode funcionar na prática pro [SEGMENTO]. Sem compromisso — só uma conversa rápida pra ver se faz sentido. Que tal?`,
  followup: `Oi! Passando pra dar continuidade na nossa conversa sobre o modelo de recorrência. Vi que empresas do mesmo segmento que o de vocês estão tendo resultados expressivos. Posso te mostrar rapidamente?`,
};
