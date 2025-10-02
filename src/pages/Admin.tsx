import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesAdmin } from "@/components/admin/ServicesAdmin";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin";
import { TeamAdmin } from "@/components/admin/TeamAdmin";
import { TestimonialsAdmin } from "@/components/admin/TestimonialsAdmin";
import { OrganizationAdmin } from "@/components/admin/OrganizationAdmin";
import { SiteSettingsAdmin } from "@/components/admin/SiteSettingsAdmin";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { LogOut, LayoutDashboard, Gauge } from "lucide-react";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if user has admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    const hasAdminRole = roles?.some(r => r.role === "admin");
    setIsAdmin(hasAdminRole || false);
    setLoading(false);

    if (!hasAdminRole) {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/10">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background to-primary/10">
      <div className="container mx-auto max-w-7xl">
        <GlassCard className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome, {user?.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </GlassCard>

        <GlassCard>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1 mb-6">
              <TabsTrigger value="dashboard" className="gap-2">
                <Gauge className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                Services
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                Projects
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                Team
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="gap-2">
                Testimonials
              </TabsTrigger>
              <TabsTrigger value="organization" className="gap-2">
                Organization
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="services">
              <ServicesAdmin />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsAdmin />
            </TabsContent>

            <TabsContent value="team">
              <TeamAdmin />
            </TabsContent>

            <TabsContent value="testimonials">
              <TestimonialsAdmin />
            </TabsContent>

            <TabsContent value="organization">
              <OrganizationAdmin />
            </TabsContent>

            <TabsContent value="settings">
              <SiteSettingsAdmin />
            </TabsContent>
          </Tabs>
        </GlassCard>
      </div>
    </div>
  );
}
