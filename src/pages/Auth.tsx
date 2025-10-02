import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/GlassCard";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Check if user has admin role
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);
        
        const hasAdminRole = roles?.some(r => r.role === "admin" || r.role === "editor");
        
        if (hasAdminRole) {
          navigate("/admin");
        } else {
          await supabase.auth.signOut();
          toast({ 
            title: "Access Denied", 
            description: "You don't have admin access. Please contact the administrator.",
            variant: "destructive" 
          });
        }
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` }
        });
        if (error) throw error;
        toast({ title: "Account created! Please sign in." });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-background to-primary/10">
      <GlassCard className="max-w-md w-full p-8">
        <img src={logo} alt="Logo" className="h-16 w-16 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-center mb-6">Admin CMS</h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            disabled={loading}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={loading}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : (isLogin ? "Sign In" : "Sign Up")}
          </Button>
        </form>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="w-full mt-4">
          {isLogin ? "Need an account? Sign up" : "Have an account? Sign in"}
        </Button>
      </GlassCard>
    </div>
  );
}
