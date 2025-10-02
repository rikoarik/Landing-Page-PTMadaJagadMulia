import { GlassCard } from "@/components/GlassCard";
import { Target, Lightbulb } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export const About = () => {
  const { settings, loading } = useSiteSettings();
  
  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <GlassCard className="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              About {loading ? (
                <div className="animate-pulse inline-block w-48 h-10 bg-foreground/10 rounded align-middle" />
              ) : (
                settings.company_name
              )}
            </h2>
            <div className="w-20 h-1 bg-gradient-accent mx-auto rounded-full"></div>
          </div>

          <p className="text-lg text-foreground/80 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-foreground/5 rounded w-full" />
                <div className="h-5 bg-foreground/5 rounded w-4/5 mx-auto" />
                <div className="h-5 bg-foreground/5 rounded w-3/4 mx-auto" />
              </div>
            ) : (
              settings.about_text
            )}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard className="flex flex-col items-start">
              <div className="p-3 bg-primary/10 rounded-xl mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Vision</h3>
              <p className="text-foreground/80 leading-relaxed">
                To become a pioneer in sustainable development in Indonesia by harmonizing technology, 
                people, and nature.
              </p>
            </GlassCard>

            <GlassCard className="flex flex-col items-start">
              <div className="p-3 bg-secondary/10 rounded-xl mb-4">
                <Lightbulb className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Mission</h3>
              <ul className="text-foreground/80 space-y-2 leading-relaxed">
                <li>• Deliver quality projects with environmental responsibility</li>
                <li>• Promote innovation and sustainable technology</li>
                <li>• Maintain professionalism and integrity</li>
                <li>• Empower local talent and communities</li>
              </ul>
            </GlassCard>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
