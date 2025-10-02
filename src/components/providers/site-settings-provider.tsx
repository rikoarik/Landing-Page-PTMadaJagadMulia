import { createContext, useContext, ReactNode } from "react";
import { useSiteSettings, SiteSettings } from "@/hooks/use-site-settings";

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const siteSettings = useSiteSettings();

  return (
    <SiteSettingsContext.Provider value={siteSettings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettingsContext() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}