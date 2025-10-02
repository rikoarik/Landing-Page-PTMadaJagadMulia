import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Label } from "@/components/ui/label";

export function SiteSettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error) {
      toast({ title: "Error loading settings", variant: "destructive" });
    } else {
      const settingsMap: Record<string, string> = {};
      data?.forEach((item) => {
        settingsMap[item.key] = item.value;
      });
      setSettings(settingsMap);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updates = [
      { key: "company_name", value: formData.get("company_name") as string },
      { key: "company_address", value: formData.get("company_address") as string },
      { key: "company_phone", value: formData.get("company_phone") as string },
      { key: "company_email", value: formData.get("company_email") as string },
      { key: "whatsapp_number", value: formData.get("whatsapp_number") as string },
      { key: "hero_title", value: formData.get("hero_title") as string },
      { key: "hero_subtitle", value: formData.get("hero_subtitle") as string },
      { key: "about_text", value: formData.get("about_text") as string },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { key: update.key, value: update.value },
          { onConflict: "key" }
        );

      if (error) {
        toast({ 
          title: `Error updating ${update.key}`, 
          variant: "destructive" 
        });
        return;
      }
    }

    toast({ title: "Settings updated successfully" });
    fetchSettings();
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Site Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Company Information</h3>
          
          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              name="company_name"
              defaultValue={settings.company_name || "PT Mada Jagad Mulia"}
            />
          </div>

          <div>
            <Label htmlFor="company_address">Address</Label>
            <Textarea
              id="company_address"
              name="company_address"
              defaultValue={settings.company_address || "Jl. Raya Tulungrejo, Bojonegoro, East Java, Indonesia"}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_phone">Phone</Label>
              <Input
                id="company_phone"
                name="company_phone"
                type="tel"
                defaultValue={settings.company_phone || "+62 123 4567 890"}
              />
            </div>

            <div>
              <Label htmlFor="company_email">Email</Label>
              <Input
                id="company_email"
                name="company_email"
                type="email"
                defaultValue={settings.company_email || "info@madajagadmulia.co.id"}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="whatsapp_number">WhatsApp Number (with country code)</Label>
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              type="tel"
              placeholder="+6281234567890"
              defaultValue={settings.whatsapp_number || "+6281234567890"}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Hero Section</h3>
          
          <div>
            <Label htmlFor="hero_title">Hero Title</Label>
            <Input
              id="hero_title"
              name="hero_title"
              defaultValue={settings.hero_title || "Building a Sustainable Future"}
            />
          </div>

          <div>
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              name="hero_subtitle"
              defaultValue={settings.hero_subtitle || "Delivering engineering and construction solutions that serve people, nature, and progress."}
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About Section</h3>
          
          <div>
            <Label htmlFor="about_text">About Text</Label>
            <Textarea
              id="about_text"
              name="about_text"
              defaultValue={settings.about_text || "PT Mada Jagad Mulia is a leading engineering company..."}
              rows={4}
            />
          </div>
        </div>

        <Button type="submit" className="gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </form>
    </div>
  );
}
