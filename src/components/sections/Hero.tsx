import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { ArrowRight, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useSiteSettings } from "@/hooks/use-site-settings";

export const Hero = () => {
  const { settings, loading } = useSiteSettings();
  
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${settings.whatsapp_number}?text=Hello%20${encodeURIComponent(settings.company_name)},%20I%20would%20like%20to%20get%20a%20consultation`, "_blank");
  };

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <GlassCard className="max-w-4xl mx-auto text-center p-6 sm:p-8 md:p-12 animate-fade-in-up" blur="lg">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-accent bg-clip-text text-transparent leading-tight tracking-tight">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-12 bg-foreground/10 rounded w-3/4 mx-auto" />
              </div>
            ) : (
              settings.hero_title
            )}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-foreground/5 rounded w-2/3 mx-auto" />
              </div>
            ) : (
              settings.hero_subtitle
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center w-full sm:w-auto">
            <Button 
              size="lg" 
              onClick={handleWhatsApp}
              className="w-full sm:w-auto bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105 group text-base sm:text-lg py-6 sm:py-4"
            >
              <MessageCircle className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Get Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={scrollToPortfolio}
              className="w-full sm:w-auto border-glass-border bg-glass-light backdrop-blur-md hover:bg-glass-strong group text-base sm:text-lg py-6 sm:py-4"
            >
              View Projects
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
