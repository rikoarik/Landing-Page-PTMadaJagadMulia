import { GlassCard } from "@/components/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  initials: string;
  bio: string | null;
  avatar_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_published", true)
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
      <section id="team" className="py-20 px-6 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 px-6 bg-gradient-to-b from-transparent to-primary/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Team
          </h2>
          <div className="w-20 h-1 bg-gradient-accent mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Dedicated professionals committed to excellence and innovation
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {members.map((member, index) => (
            <GlassCard 
              key={member.id}
              className="text-center group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 group-hover:scale-110">
                {member.avatar_url ? (
                  <AvatarImage src={member.avatar_url} alt={member.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-sm text-foreground/70">
                {member.position}
              </p>
              {member.bio && (
                <p className="text-xs text-foreground/60 mt-2 line-clamp-2">
                  {member.bio}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
