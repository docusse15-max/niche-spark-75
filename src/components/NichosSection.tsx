import { Dumbbell, Sparkles, Car, Heart, Briefcase, GraduationCap, Users, Zap } from "lucide-react";

const nichoGroups = [
  {
    title: "Saúde Recorrente",
    tag: "Alta oportunidade",
    tagColor: "bg-accent text-accent-foreground",
    icon: Heart,
    items: ["Clínicas odontológicas", "Psicólogos", "Fisioterapia", "Nutricionistas"],
    insight: "Agenda + previsibilidade + retenção",
  },
  {
    title: "Beleza Premium",
    tag: "Ticket alto",
    tagColor: "bg-primary text-primary-foreground",
    icon: Sparkles,
    items: ["Harmonização facial", "Depilação a laser", "Salões premium", "Estética avançada"],
    insight: "Retenção + LTV alto",
  },
  {
    title: "Serviços Automotivos",
    tag: "Pouco explorado",
    tagColor: "bg-accent text-accent-foreground",
    icon: Car,
    items: ["Lava-rápido premium", "Estética automotiva", "Troca de óleo programada", "Clube automotivo"],
    insight: "Cliente paga sem sentir — recorrência perfeita",
  },
  {
    title: "Pet",
    tag: "Subexplorado",
    tagColor: "bg-primary text-primary-foreground",
    icon: Heart,
    items: ["Banho e tosa mensal", "Plano de saúde pet", "Clube pet (ração + serviços)"],
    insight: "Dono de pet NÃO cancela fácil",
  },
  {
    title: "B2B Recorrente",
    tag: "Jogo grande",
    tagColor: "bg-accent text-accent-foreground",
    icon: Briefcase,
    items: ["Contabilidade", "Marketing digital", "Limpeza empresarial", "TI / Suporte técnico"],
    insight: "Você vende contrato, não produto",
  },
  {
    title: "Educação",
    tag: "Recorrência natural",
    tagColor: "bg-primary text-primary-foreground",
    icon: GraduationCap,
    items: ["Cursos profissionalizantes", "Idiomas", "Mentorias", "Treinamentos corporativos"],
    insight: "Só precisa estruturar melhor",
  },
  {
    title: "Nichos Clássicos",
    tag: "Alto volume",
    tagColor: "bg-muted text-muted-foreground",
    icon: Dumbbell,
    items: ["Academias e studios", "Clínicas de estética", "Escolas / cursos", "Clubes de assinatura"],
    insight: "Você ganha na execução e argumento",
  },
  {
    title: "Nova Economia",
    tag: "Crescimento rápido",
    tagColor: "bg-accent text-accent-foreground",
    icon: Zap,
    items: ["Criadores de conteúdo", "Consultorias online", "Mentorias", "Infoprodutores"],
    insight: "Cresce MUITO rápido",
  },
];

const NichosSection = () => {
  return (
    <section id="nichos" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Nichos com maior potencial de{" "}
            <span className="text-primary">receita recorrente</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Identificamos os mercados com mais oportunidade para modelos de assinatura e recorrência.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nichoGroups.map((group) => (
            <div
              key={group.title}
              className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <group.icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${group.tagColor}`}>
                  {group.tag}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-card-foreground mb-3">{group.title}</h3>
              
              <ul className="space-y-2 mb-4">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <p className="text-xs font-medium text-primary border-t border-border pt-3 mt-auto">
                💡 {group.insight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NichosSection;
