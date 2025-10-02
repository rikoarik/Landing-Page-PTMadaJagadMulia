import { GlassCard } from "@/components/GlassCard";
import { Leaf, Users, Cpu, Handshake } from "lucide-react";

const strengths = [
  {
    icon: Leaf,
    title: "Environmental Commitment",
    description: "Every project prioritizes ecological balance and sustainable practices for a greener future.",
  },
  {
    icon: Users,
    title: "Professional Team",
    description: "Experienced engineers and specialists dedicated to excellence and innovation.",
  },
  {
    icon: Cpu,
    title: "Modern Technology",
    description: "Leveraging cutting-edge tools and methods for efficient, precise project delivery.",
  },
  {
    icon: Handshake,
    title: "Integrity & Trust",
    description: "Building lasting relationships through transparency, reliability, and ethical practices.",
  },
];

export const Strengths = () => {
  return (
    <section id="strengths" className="py-20 px-6 bg-gradient-to-b from-transparent to-primary/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Key Strengths
          </h2>
          <div className="w-20 h-1 bg-gradient-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {strengths.map((strength, index) => {
            const Icon = strength.icon;
            return (
              <GlassCard 
                key={index}
                className="text-center animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-4 bg-gradient-primary rounded-2xl mb-4 w-fit mx-auto group-hover:rotate-12 transition-transform duration-300">
                  <Icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {strength.title}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {strength.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
