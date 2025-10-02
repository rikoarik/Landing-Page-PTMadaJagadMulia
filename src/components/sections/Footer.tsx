import logo from "@/assets/logo.png";

export const Footer = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-glass-border">
      <div className="backdrop-blur-lg bg-glass-strong">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo and Tagline */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="PT Mada Jagad Mulia" className="h-12 w-12" />
              <div>
                <p className="text-sm font-semibold text-foreground">PT Mada Jagad Mulia</p>
                <p className="text-xs text-foreground/60">Harmony of Nature, Technology, and Life</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <button onClick={() => scrollToSection("home")} className="text-foreground/80 hover:text-primary transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection("about")} className="text-foreground/80 hover:text-primary transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection("services")} className="text-foreground/80 hover:text-primary transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection("portfolio")} className="text-foreground/80 hover:text-primary transition-colors">
                Projects
              </button>
              <button onClick={() => scrollToSection("team")} className="text-foreground/80 hover:text-primary transition-colors">
                Team
              </button>
              <button onClick={() => scrollToSection("contact")} className="text-foreground/80 hover:text-primary transition-colors">
                Contact
              </button>
            </nav>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-glass-border text-center">
            <p className="text-sm text-foreground/70">
              © 2025 PT Mada Jagad Mulia. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
