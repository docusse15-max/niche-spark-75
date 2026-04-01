import { TrendingUp, Shield, BarChart3, RefreshCw } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Receita Previsível",
    description: "Saia da montanha-russa de vendas. Com recorrência, você sabe exatamente quanto vai faturar.",
  },
  {
    icon: Shield,
    title: "Retenção Inteligente",
    description: "Estratégias comprovadas para reduzir churn e aumentar o tempo de permanência dos clientes.",
  },
  {
    icon: BarChart3,
    title: "LTV Maximizado",
    description: "Aumente o valor do ciclo de vida de cada cliente com upsell e cross-sell automatizados.",
  },
  {
    icon: RefreshCw,
    title: "Operação Automatizada",
    description: "Sistemas de cobrança, régua de comunicação e gestão de assinaturas no piloto automático.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Por que implementar recorrência?
          </h2>
          <p className="text-muted-foreground text-lg">
            Negócios recorrentes valem até 8x mais que modelos tradicionais.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <b.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{b.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
