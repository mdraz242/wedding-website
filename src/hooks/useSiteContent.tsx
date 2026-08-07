import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { site as defaultSite } from "@/lib/site";
import brandLogo from "@/assets/logo.png";
import {
  getSiteSettings,
  getCustomServices,
  getCustomLocations,
  getCustomReviews,
  getCustomPagesSEO,
  getCustomHomeSections,
} from "@/lib/admin.functions";
import { defaultPagesSEO, type PageKey, type PageSEOContent } from "@/data/pages";
import { defaultHomeSections, type HomeSectionsConfig } from "@/data/homeSections";

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
  },
};

interface SiteContentContextType {
  settings: SiteSettings;
  customServices: any[] | null;
  customLocations: any[] | null;
  customReviews: any[] | null;
  customPagesSEO: Record<string, PageSEOContent> | null;
  homeSections: HomeSectionsConfig;
  getPageSEO: (key: PageKey) => PageSEOContent;
  refresh: () => Promise<void>;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({
  settings: defaultSettings,
  customServices: null,
  customLocations: null,
  customReviews: null,
  customPagesSEO: null,
  homeSections: defaultHomeSections,
  getPageSEO: (key: PageKey) => defaultPagesSEO[key],
  refresh: async () => {},
  loading: false,
});

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [customServices, setCustomServices] = useState<any[] | null>(null);
  const [customLocations, setCustomLocations] = useState<any[] | null>(null);
  const [customReviews, setCustomReviews] = useState<any[] | null>(null);
  const [customPagesSEO, setCustomPagesSEO] = useState<Record<string, PageSEOContent> | null>(null);
  const [homeSections, setHomeSections] = useState<HomeSectionsConfig>(defaultHomeSections);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const [sRes, svcRes, locRes, revRes, pagesRes, homeRes] = await Promise.all([
        getSiteSettings(),
        getCustomServices(),
        getCustomLocations(),
        getCustomReviews(),
        getCustomPagesSEO(),
        getCustomHomeSections(),
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
      if (pagesRes?.pages) setCustomPagesSEO(pagesRes.pages);
      if (homeRes?.sections) {
        setHomeSections({
          ...defaultHomeSections,
          ...homeRes.sections,
          hero: { ...defaultHomeSections.hero, ...(homeRes.sections.hero || {}) },
          featured_services: { ...defaultHomeSections.featured_services, ...(homeRes.sections.featured_services || {}) },
          why_us: { ...defaultHomeSections.why_us, ...(homeRes.sections.why_us || {}) },
          portfolio_preview: { ...defaultHomeSections.portfolio_preview, ...(homeRes.sections.portfolio_preview || {}) },
          films_section: { ...defaultHomeSections.films_section, ...(homeRes.sections.films_section || {}) },
          google_reviews: { ...defaultHomeSections.google_reviews, ...(homeRes.sections.google_reviews || {}) },
          process_section: { ...defaultHomeSections.process_section, ...(homeRes.sections.process_section || {}) },
          service_areas_section: { ...defaultHomeSections.service_areas_section, ...(homeRes.sections.service_areas_section || {}) },
          faq_section: { ...defaultHomeSections.faq_section, ...(homeRes.sections.faq_section || {}) },
          final_cta: { ...defaultHomeSections.final_cta, ...(homeRes.sections.final_cta || {}) },
        });
      }
    } catch (err) {
      console.error("Failed to parse or fetch site settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getPageSEO = useCallback(
    (key: PageKey): PageSEOContent => {
      const custom = customPagesSEO?.[key];
      const fallback = defaultPagesSEO[key] || defaultPagesSEO.home;
      if (!custom) return fallback;
      return {
        ...fallback,
        ...custom,
      };
    },
    [customPagesSEO],
  );

  return (
    <SiteContentContext.Provider
      value={{
        settings,
        customServices,
        customLocations,
        customReviews,
        customPagesSEO,
        homeSections,
        getPageSEO,
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
