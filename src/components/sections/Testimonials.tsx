import { GlassCard } from "@/components/GlassCard";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string | null;
  is_published: boolean;
  sort_order: number;
}

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");

      if (!error && data) {
        setTestimonials(data);
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section id="testimonials" className="py-20 px-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 px-6 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            What Our Clients Say
          </h2>
          <div className="w-20 h-1 bg-gradient-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <GlassCard 
              key={testimonial.id}
              className="flex flex-col animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-foreground/80 leading-relaxed mb-6 flex-grow italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-glass-border pt-4">
                <p className="font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-foreground/60">
                  {testimonial.role}
                </p>
                {testimonial.company && (
                  <p className="text-sm text-foreground/40">
                    {testimonial.company}
                  </p>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};