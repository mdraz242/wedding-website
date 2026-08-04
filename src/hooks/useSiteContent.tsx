import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { site as defaultSite } from "@/lib/site";
import brandLogo from "@/assets/logo.png";
import { getSiteSettings, getCustomServices, getCustomLocations, getCustomReviews } from "@/lib/admin.functions";

export interface SiteSettings {
  name: string;
  tagline: string;
  domain: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  since: number;
  logoUrl: string;
  social: {
    instagram: string;
    youtube: string;
    facebook: string;
    google: string;
  };
  stats: {
    projects: string;
    clients: string;
    cities: string;
    rating: number;
    reviews: number;
  };
  hero: {
    title_part1: string;
    title_part2: string;
    subtitle: string;
  };
}

export const defaultSettings: SiteSettings = {
  name: defaultSite.name,
  tagline: defaultSite.tagline,
  domain: defaultSite.domain,
  phone: defaultSite.phone,
  phoneRaw: defaultSite.phoneRaw,
  whatsapp: defaultSite.whatsapp,
  email: defaultSite.email,
  address: defaultSite.address,
  hours: defaultSite.hours,
  since: defaultSite.since,
  logoUrl: brandLogo,
  social: {
    instagram: defaultSite.social.instagram,
    youtube: defaultSite.social.youtube,
    facebook: defaultSite.social.facebook,
    google: defaultSite.social.google,
  },
  stats: {
    projects: String(defaultSite.stats.projects),
    clients: String(defaultSite.stats.clients),
    cities: String(defaultSite.stats.cities),
    rating: Number(defaultSite.stats.rating) || 4.9,
    reviews: Number(defaultSite.stats.reviews) || 820,
  },
  hero: {
    title_part1: "Every moment,",
    title_part2: "preserved for a lifetime.",
    subtitle: "A photography and cinematography atelier trusted for six decades.",
  }
};

interface SiteContentContextType {
  settings: SiteSettings;
  customServices: any[] | null;
  customLocations: any[] | null;
  customReviews: any[] | null;
  refresh: () => Promise<void>;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({
  settings: defaultSettings,
  customServices: null,
  customLocations: null,
  customReviews: null,
  refresh: async () => {},
  loading: false,
});

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [customServices, setCustomServices] = useState<any[] | null>(null);
  const [customLocations, setCustomLocations] = useState<any[] | null>(null);
  const [customReviews, setCustomReviews] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const [sRes, svcRes, locRes, revRes] = await Promise.all([
        getSiteSettings(),
        getCustomServices(),
        getCustomLocations(),
        getCustomReviews(),
      ]);

      if (sRes?.settings) {
        const val = sRes.settings;
        const merged: SiteSettings = {
          ...defaultSettings,
          ...val,
          social: {
            ...defaultSettings.social,
            ...(val.social || {}),
          },
          stats: {
            ...defaultSettings.stats,
            ...(val.stats || {}),
          },
          hero: {
            ...defaultSettings.hero,
            ...(val.hero || {}),
          },
        };
        setSettings(merged);
      }

      if (svcRes?.services) setCustomServices(svcRes.services);
      if (locRes?.locations) setCustomLocations(locRes.locations);
      if (revRes?.reviews) setCustomReviews(revRes.reviews);
    } catch (err) {
      console.error("Failed to parse or fetch site settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SiteContentContext.Provider
      value={{
        settings,
        customServices,
        customLocations,
        customReviews,
        refresh: fetchSettings,
        loading,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
