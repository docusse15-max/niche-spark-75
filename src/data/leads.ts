import { CIDADES, CIDADE_CONFIGS, type Cidade } from "./cities";

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

export type Bairro = string;

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
  bairro: string;
  cidade: Cidade;
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

// Legacy export - now dynamic from cities
export const BAIRROS: string[] = (() => {
  const all: string[] = [];
  for (const cidade of CIDADES) {
    for (const b of CIDADE_CONFIGS[cidade].bairros) {
      all.push(b.nome);
    }
  }
  return [...new Set(all)];
})();

export const COMERCIAIS = ["Dorileu", "Felipe", "Gabi", "Janna"] as const;
export type Comercial = typeof COMERCIAIS[number];
export const RESPONSAVEIS = ["Dorileu", "Felipe", "Gabi", "Janna"];

// ===== EMPRESA NAMES PER NICHO =====
const EMPRESA_NAMES: Record<Nicho, string[]> = {
  "Clínica de Estética": ["Estética Prime", "Bella Vita", "Dermavida", "Skin Center", "Corpo Ideal", "Estética Royal", "Beleza Pura", "Glow Clinic", "Estética Avançada", "Face Art", "Beauty Lab", "Estética Zen", "DermaGold", "Pele Perfeita", "Estética Sublime", "Beauty Premium", "Harmonia Facial", "Spa Beleza", "Estética Renova", "Studio Beauty"],
  "Odontologia": ["Odonto Premium", "Sorriso Perfeito", "Dente Saudável", "Odonto Smile", "Oral Center", "Clínica Sorriso", "Odonto Plus", "Dental Care", "OdontoVida", "Sorriso CG", "Implante Fácil", "Dental Gold", "Odonto Master", "Sorriso Real", "Dental Prime", "OdontoExcel", "Dental Art", "Odonto Family", "Sorriso Brilhante", "Dental Saúde"],
  "Pet Shop": ["PetLove", "Vet Life", "Dog & Cat", "PetBanho", "Pet Center", "Bicho Bom", "Pet Feliz", "Au Au Pet", "Miau & Cia", "Pet Paradise", "Animal Planet", "Pet Amigo", "Vet Care", "PetClean", "Pet Saúde", "Animal Life", "Pet Style", "Vet Plus", "PetMania", "Zoo Pet"],
  "Academia": ["CrossFit Box", "Gym Power", "Studio Fitness", "Academia Flex", "Espaço Zen", "Iron Body", "Fit & Strong", "Power Gym", "Body Tech", "Fitness Gold", "Muscle Factory", "Energy Gym", "Funcional MS", "Alpha Fitness", "Strong Body", "Mega Gym", "Wellness Studio", "Fit4Life", "Pro Training", "Athletic Center"],
  "Clínica de Saúde": ["Clínica Derma Plus", "Clínica Vitalis", "Saúde Integral", "MedCenter", "Clínica Vida", "Centro Médico", "Clínica Saúde+", "MedVida", "Clínica Bem Estar", "Saúde Premium", "Centro Clínico", "Clínica Harmonia", "MedGold", "Clínica Popular", "Saúde Total", "Clínica Nova Vida", "MedPlus", "Clínica Esperança", "Centro Saúde", "Clínica Renascer"],
  "Nutrição": ["Nutri Vida", "Nutri Fit", "Nutri Balance", "Saúde no Prato", "Nutri Corpo", "NutriPlan", "Nutri Gold", "Vida Saudável", "Nutri Expert", "NutriCenter", "Dieta Certa", "Nutri Soul", "Nutri Funcional", "Nutri Prime", "Nutri Lab", "Nutri Natural", "Nutri Wellness", "Nutri Plus", "Nutri Master", "Nutri Ativa"],
  "Psicologia": ["Psi Mente", "Espaço Terapia", "Mente Viva", "Psi Center", "Equilíbrio Mental", "Psi Saúde", "Mente Plena", "Psi Care", "Sentir & Ser", "Psi Gold", "Clínica da Mente", "Psi Bem Estar", "Mente & Corpo", "Psi Integral", "Psi Acolher", "Mente Livre", "Psi Harmonia", "Mente Sã", "Psi Renova", "Psi Evolução"],
  "Automotivo": ["Auto Shine", "Lava Jato Premium", "Auto Center", "Mecânica do Povo", "Car Clean", "Auto Pro", "Speed Car", "Auto Gold", "Car Spa", "Auto Brilho", "MasterCar", "Auto Express", "Car Premium", "Auto Mais", "Auto Total", "Car Life", "Auto Élite", "Speed Lav", "Auto Clean", "Car Tech"],
  "Serviços B2B": ["Tech Solutions", "Copy & Print", "Solar Clean", "ContaFácil", "Digital Force", "Promo MS", "Marketing Pro", "Data Systems", "Office Solutions", "BizTech", "Smart Services", "Pro Solutions", "Connect MS", "Inova Serviços", "Alfa Soluções", "NetWork MS", "Business Pro", "Serv Mais", "Soluções MS", "TechPro"],
  "Salão de Beleza": ["Barber King", "Salão da Rê", "Beleza & Arte", "Instituto Cabelo", "Corte Certo", "Studio Hair", "Hair Gold", "Beleza Express", "Salão Premium", "Corte & Estilo", "Hair Master", "Salão Charme", "Beauty Hair", "Hair Pro", "Salão da Ana", "Barbearia Style", "Hair Center", "Salão Glamour", "Corte & Cor", "Hair Studio"],
  "Fisioterapia": ["Fisio Move", "Fisio Integral", "Fisio Life", "Fisio Center", "Fisio Plus", "Fisio Gold", "Reabilitar", "Fisio Sport", "Corpo Ativo", "Fisio Saúde", "Fisio Expert", "Fisio Premium", "Fisio Funcional", "Reab Center", "Fisio Body", "Fisio Care", "Movimento Vital", "Fisio Total", "Fisio Bem Estar", "Fisio Master"],
  "Educação": ["English Now", "Escola Futuro", "Curso MS", "Aprender+", "Instituto Saber", "Escola Moderna", "Educação Prime", "Centro Educacional", "Saber Mais", "Instituto MS", "Academia do Saber", "Escola Tech", "Cursinho MS", "EduCenter", "Aprendiz MS", "Escola Nova", "Instituto Ensino", "Edu Plus", "Escola Criativa", "Centro de Cursos"],
  "Coworking": ["Smart Cowork", "Espaço Maker", "Hub MS", "Cowork Prime", "Office Hub", "Work Center", "Co.Lab", "Cowork Gold", "StartHub", "Work Space", "Business Hub", "Cowork Plus", "Innovation Hub", "Desk MS", "Work & Create", "Cowork Life", "Hub Digital", "Space Work", "Cowork Connect", "Office Share"],
  "Contabilidade": ["ContaFácil", "Contabilidade Prime", "Conta Certa", "ContaGold", "Fiscal Plus", "Contabil MS", "Conta Fiel", "ContaMais", "Gestão Contábil", "Contabil Expert", "Conta Pro", "Fiscal MS", "ContaCenter", "Gestão Fiscal", "ContaExpress", "Fiscal Total", "Conta Master", "ContaVida", "Gestão MS", "Fiscal Prime"],
  "Limpeza Empresarial": ["CleanPro", "Clean House", "Limpeza Total", "Super Clean", "Clean Gold", "Clean Express", "Limpeza Premium", "Clean Master", "Higiene Total", "Clean & Shine", "Limpeza Pro", "Clean Care", "Brilho Total", "Clean Force", "Limpeza Fácil", "Clean Jet", "Limpeza MS", "Clean Star", "Limpeza Excel", "Clean Plus"],
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

function generatePhone(ddd: string): string {
  // WhatsApp BR: (DDD) 9 XXXX-XXXX — always starts with 9, 9 digits total
  const n1 = String(Math.floor(Math.random() * 9000) + 1000);
  const n2 = String(Math.floor(Math.random() * 9000) + 1000);
  return `(${ddd}) 9${n1}-${n2}`;
}

const CIDADE_DDD: Record<Cidade, string> = {
  "Campo Grande": "67",
  "Dourados": "67",
  "Ponta Porã": "67",
  "Aquidauana": "67",
  "Sidrolândia": "67",
  "Bonito": "67",
  "Corumbá": "67",
  "Maracaju": "67",
  "Rio Brilhante": "67",
};

import aiLeadsRaw from "./ai-leads.json";

function buildLeadsFromAI(): Lead[] {
  const potenciais: LeadPotential[] = ["baixo", "medio", "alto", "premium"];
  const potencialWeights = [0.15, 0.35, 0.35, 0.15];
  function pickPotencial(): LeadPotential {
    const r = Math.random();
    let cum = 0;
    for (let i = 0; i < potenciais.length; i++) { cum += potencialWeights[i]; if (r < cum) return potenciais[i]; }
    return "medio";
  }

  return (aiLeadsRaw as any[]).map((raw, idx) => {
    const cidade = (raw.cidade || "Campo Grande") as Cidade;
    const config = CIDADE_CONFIGS[cidade];
    const bairros = config?.bairros || [];
    const bairroObj = bairros.find(b => b.nome.toLowerCase() === (raw.bairro || "").toLowerCase()) || bairros[Math.floor(Math.random() * bairros.length)];
    const nicho = (NICHOS.includes(raw.nicho) ? raw.nicho : "Serviços B2B") as Nicho;

    return {
      id: String(idx + 1),
      empresa: raw.empresa || "",
      segmento: nicho,
      bairro: raw.bairro || bairroObj?.nome || "",
      cidade,
      telefone: raw.telefone || generatePhone(CIDADE_DDD[cidade]),
      instagram: raw.instagram || "",
      potencial: pickPotencial(),
      temperatura: "frio" as LeadTemperature,
      status: "novo" as LeadStatus,
      ultimoContato: "",
      proximaAcao: "",
      responsavel: "",
      observacoes: "",
      descricao: raw.descricao || DESCRICOES[nicho] || "",
      motivoRecorrencia: MOTIVOS[nicho] || "",
      historico: [],
      lat: bairroObj ? bairroObj.coords[0] + (Math.random() - 0.5) * 0.015 : undefined,
      lng: bairroObj ? bairroObj.coords[1] + (Math.random() - 0.5) * 0.015 : undefined,
    };
  });
}

const MOCK_LEADS: Lead[] = buildLeadsFromAI();

export function getInitialLeads(): Lead[] {
  const stored = localStorage.getItem("crm_leads_v7");
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  return MOCK_LEADS;
}

export function saveLeads(leads: Lead[]) {
  localStorage.setItem("crm_leads_v7", JSON.stringify(leads));
}

// ===== ACTIVITY LOG =====
import { supabase } from "@/integrations/supabase/client";

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  leadEmpresa: string;
  leadId: string;
  author: string;
  details: string;
}

export async function getActivityLog(): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error || !data) return [];
  return data.map(row => ({
    id: row.id,
    timestamp: row.created_at,
    action: row.action,
    leadEmpresa: row.lead_empresa,
    leadId: row.lead_id,
    author: row.author,
    details: row.details,
  }));
}

export async function addActivityLog(entry: Omit<ActivityLogEntry, "id" | "timestamp">) {
  await supabase.from("activity_logs").insert({
    action: entry.action,
    lead_empresa: entry.leadEmpresa,
    lead_id: entry.leadId,
    author: entry.author,
    details: entry.details,
  });
}

export const SALES_ARGUMENTS = [
  { title: "Previsibilidade de receita", text: "Em vez de depender de vendas pontuais, seu cliente sabe exatamente quanto entra todo mês." },
  { title: "Redução de inadimplência", text: "Cobrança automática no cartão reduz inadimplência de 20-30% para menos de 5%." },
  { title: "Retenção de clientes", text: "Cliente recorrente fica 3x mais tempo que cliente avulso." },
  { title: "Aumento de LTV", text: "Cliente recorrente gasta 2.5x mais ao longo do tempo." },
  { title: "Profissionalização da operação", text: "Sistema de recorrência organiza agenda, pagamento e relacionamento." },
  { title: "Escala sem aumentar equipe", text: "Automatizando cobrança e gestão, cresce sem contratar." },
  { title: "Valuation do negócio", text: "Negócio com receita recorrente vale 3-5x mais na venda." },
  { title: "Previsibilidade de caixa", text: "Permite planejar investimentos, contratar e crescer com segurança." },
];

export const SCRIPTS = {
  abertura: `Olá, tudo bem? Vi que vocês atuam no segmento de [SEGMENTO] aqui em [CIDADE] e queria te mostrar uma forma de transformar atendimentos recorrentes em receita mensal previsível.`,
  gatilho: `Muitos negócios como o de vocês já têm clientes que voltam todo mês, mas ainda não estruturaram isso da forma certa.`,
  fechamento: `Se fizer sentido pra vocês, te explico em 15 minutos como isso pode funcionar na prática. Sem compromisso.`,
  followup: `Oi! Passando pra dar continuidade na nossa conversa sobre o modelo de recorrência. Posso te mostrar rapidamente?`,
};
