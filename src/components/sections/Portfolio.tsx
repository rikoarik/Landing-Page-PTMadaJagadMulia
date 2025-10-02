import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  location: string;
  tags: string[];
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="portfolio" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Recent Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-accent mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Showcasing our commitment to excellence and sustainable development
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <GlassCard 
              key={project.id}
              className="animate-fade-in group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.image_url ? (
                  <div className="relative w-full h-48 md:h-full rounded-lg overflow-hidden bg-black/5">
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-48 md:h-full rounded-lg bg-black/5">
                    <ImageIcon className="w-12 h-12 text-foreground/20" />
                  </div>
                )}

                <div className="md:col-span-2">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-foreground/70">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                  
                  <p className="text-foreground/80 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};