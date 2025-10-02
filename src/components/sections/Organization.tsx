import { GlassCard } from "@/components/GlassCard";
import { Users, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrgMember {
  id: string;
  name: string;
  position: string;
  level: number;
  is_published: boolean;
  sort_order: number;
}

export const Organization = () => {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("organization_structure")
        .select("*")
        .eq("is_published", true)
        .order("level")
        .order("sort_order");

      if (!error && data) {
        setMembers(data);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <section id="organization" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  const topManagement = members.filter(m => m.level <= 2);
  const staff = members.filter(m => m.level > 2);

  return (
    <section id="organization" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Organizational Structure
          </h2>
          <div className="w-20 h-1 bg-gradient-accent mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {/* Top Management */}
          {topManagement.map((member, index) => (
            <div key={member.id} className="flex flex-col items-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <GlassCard className="text-center w-80 group">
                <div className="p-3 bg-gradient-primary rounded-xl mb-3 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {member.position}
                </h3>
                <p className="text-foreground/80">
                  {member.name}
                </p>
              </GlassCard>
              
              <ChevronDown className="h-6 w-6 text-primary/50 my-2" />
            </div>
          ))}
          
          {/* Staff Members - Side by Side */}
          {staff.length > 0 && (
            <div className="flex gap-4 mt-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              {staff.map((member, index) => (
                <GlassCard key={member.id} className="text-center w-64 group">
                  <div className="p-3 bg-gradient-primary rounded-xl mb-3 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {member.position}
                  </h3>
                  <p className="text-foreground/80">
                    {member.name}
                  </p>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
