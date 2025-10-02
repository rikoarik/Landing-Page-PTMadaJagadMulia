import { GlassCard } from "@/components/GlassCard";
import { Map, Building2, Home, FileCheck, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg_color: string;
  is_published: boolean;
  sort_order: number;
}

const iconMap: Record<string, LucideIcon> = {
  Map,
  Building2,
  Home,
  FileCheck,
};

export const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-pulse">
            <div className="h-8 w-48 mx-auto bg-foreground/10 rounded-lg mb-4" />
            <div className="h-4 w-64 mx-auto bg-foreground/5 rounded" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground tracking-tight">
            Our Services
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-accent mx-auto rounded-full mb-3 sm:mb-4"></div>
          <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Comprehensive engineering and construction solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || FileCheck;
            return (
              <GlassCard 
                key={service.id} 
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`p-3 sm:p-4 ${service.bg_color} rounded-lg sm:rounded-xl mb-3 sm:mb-4 w-fit group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${service.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                  {service.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
