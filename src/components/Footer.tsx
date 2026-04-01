const Footer = () => {
  return (
    <footer className="py-8 bg-hero border-t border-hero-muted/10">
      <div className="container mx-auto px-6 text-center">
        <p className="text-hero-muted/60 text-sm">
          © {new Date().getFullYear()} — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
