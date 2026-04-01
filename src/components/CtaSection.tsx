const CtaSection = () => {
  return (
    <section id="contato" className="py-24 bg-hero text-hero-foreground">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Pronto para transformar seu negócio?
        </h2>
        <p className="text-hero-muted text-lg mb-10 leading-relaxed">
          Agende uma conversa gratuita com nosso time e descubra como implementar 
          receita recorrente no seu nicho em até 30 dias.
        </p>
        
        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          Agendar conversa gratuita
        </a>
        
        <p className="text-hero-muted/60 text-sm mt-6">
          Sem compromisso · Resposta em até 2h
        </p>
      </div>
    </section>
  );
};

export default CtaSection;
