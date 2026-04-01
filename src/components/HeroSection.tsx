import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero">
      <img
        src={heroBg}
        alt=""
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-hero/80 via-hero/60 to-hero" />
      
      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-glow/30 bg-glow/10">
          <span className="text-sm font-medium text-glow">
            Especialistas em Receita Recorrente
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-hero-foreground leading-tight mb-6">
          Transforme seu negócio em uma{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-glow">
            máquina de receita recorrente
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-hero-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Ajudamos empresas a implementar modelos de assinatura e recorrência que geram previsibilidade, 
          retenção e crescimento sustentável.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#nichos"
            className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Ver oportunidades
          </a>
          <a
            href="#contato"
            className="px-8 py-4 rounded-lg border border-hero-muted/30 text-hero-foreground font-semibold text-lg hover:bg-hero-foreground/10 transition-colors"
          >
            Falar com especialista
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: "200+", label: "Clientes ativos" },
            { value: "97%", label: "Retenção" },
            { value: "3x", label: "Crescimento médio" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-bold text-glow">{stat.value}</div>
              <div className="text-sm text-hero-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
