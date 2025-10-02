import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Projects" },
    { id: "team", label: "Team" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? "backdrop-blur-lg bg-glass-strong shadow-glass" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity py-1"
          >
            <img src={logo} alt="PT Mada Jagad Mulia" className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="font-bold text-base sm:text-lg text-foreground hidden sm:block">
              PT Mada Jagad Mulia
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative z-50 hover:bg-glass-light active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute left-0 block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                isOpen ? "rotate-45 top-3" : "rotate-0 top-2"
              }`} />
              <span className={`absolute left-0 block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                isOpen ? "-rotate-45 top-3" : "rotate-0 top-4"
              }`} />
            </div>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden fixed inset-x-0 top-[calc(100%-1px)] transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}>
          <div className="container mx-auto px-4">
            <div className="backdrop-blur-xl bg-glass-strong/90 rounded-t-2xl shadow-glass">
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-left px-4 py-3 text-base font-medium text-foreground/80 hover:text-primary hover:bg-glass-light active:bg-glass-strong rounded-lg transition-all"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <div className="h-[env(safe-area-inset-bottom)] bg-glass-strong/50" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
