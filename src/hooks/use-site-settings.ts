import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  whatsapp_number: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
};

const defaultSettings: SiteSettings = {
  company_name: "PT Mada Jagad Mulia",
  company_address: "Jl. Raya Tulungrejo, Bojonegoro, East Java, Indonesia",
  company_phone: "+62 123 4567 890",
  company_email: "info@madajagadmulia.com",
  whatsapp_number: "6281234567890",
  hero_title: "Building a Sustainable Future",
  hero_subtitle: "Delivering engineering and construction solutions that serve people, nature, and progress.",
  about_text: "PT Mada Jagad Mulia is a leading engineering and construction company committed to excellence, innovation, and sustainability.",
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");

      if (!error && data) {
        const settingsMap: Partial<SiteSettings> = {};
        data.forEach((item) => {
          settingsMap[item.key as keyof SiteSettings] = item.value;
        });
        setSettings({ ...defaultSettings, ...settingsMap });
      }
      setLoading(false);
    };

    fetchSettings();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('public:site_settings')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'site_settings'
      }, async (payload) => {
        // Refetch all settings when any change occurs
        const { data } = await supabase
          .from("site_settings")
          .select("key, value");

        if (data) {
          const settingsMap: Partial<SiteSettings> = {};
          data.forEach((item) => {
            settingsMap[item.key as keyof SiteSettings] = item.value;
          });
          setSettings({ ...defaultSettings, ...settingsMap });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { settings, loading };
};