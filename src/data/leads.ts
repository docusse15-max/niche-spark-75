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
  | "Limpeza Empresarial"
  | "Arena Esportiva";

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
  googleMapsUrl?: string;
  fotos?: string[];
  endereco?: string;
  avaliacao?: number | null;
  totalAvaliacoes?: number;
  website?: string;
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
  "Coworking", "Contabilidade", "Limpeza Empresarial", "Arena Esportiva",
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
  "Arena Esportiva": "Arena esportiva com quadras de beach tennis, futevôlei e eventos.",
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
  "Arena Esportiva": "Mensalidades de day-use, alunos de aulas e locação recorrente de quadras.",
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
  "Costa Rica": "67",
  "Cuiabá": "65",
  "Brasília": "61",
  "Goiânia": "62",
  "São Paulo": "11",
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
      telefone: raw.telefone || "",
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
      lat: raw.lat || (bairroObj ? bairroObj.coords[0] + (Math.random() - 0.5) * 0.015 : undefined),
      lng: raw.lng || (bairroObj ? bairroObj.coords[1] + (Math.random() - 0.5) * 0.015 : undefined),
      googleMapsUrl: raw.googleMapsUrl || undefined,
      fotos: raw.fotos || [],
      endereco: raw.endereco || "",
      avaliacao: raw.avaliacao || null,
      totalAvaliacoes: raw.totalAvaliacoes || 0,
      website: raw.website || "",
    };
  });
}

const MOCK_LEADS: Lead[] = buildLeadsFromAI();

function mergeStoredLeads(storedLeads: Lead[], baseLeads: Lead[]): Lead[] {
  const merged = new Map<string, Lead>();

  for (const lead of baseLeads) {
    merged.set(lead.id, lead);
  }

  for (const lead of storedLeads) {
    const baseLead = merged.get(lead.id);
    merged.set(lead.id, baseLead ? { ...baseLead, ...lead } : lead);
  }

  return Array.from(merged.values());
}

export function getInitialLeads(): Lead[] {
  const stored = localStorage.getItem("crm_leads_v9");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return mergeStoredLeads(parsed, MOCK_LEADS);
      }
    } catch {
      /* fall through */
    }
  }
  return MOCK_LEADS;
}

export function saveLeads(leads: Lead[]) {
  localStorage.setItem("crm_leads_v9", JSON.stringify(mergeStoredLeads(leads, MOCK_LEADS)));
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
