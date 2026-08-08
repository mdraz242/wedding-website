import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { site as defaultSite, categoryImages as defaultCategoryImages, img as defaultSiteImages } from "@/lib/site";
import brandLogo from "@/assets/logo.png";
import {
  getSiteSettings,
  getCustomServices,
  getCustomLocations,
  getCustomReviews,
  getCustomPagesSEO,
  getCustomHomeSections,
  getCustomCategoryImages,
  getCustomNavigation,
  getCustomFilms,
} from "@/lib/admin.functions";
import { defaultPagesSEO, type PageKey, type PageSEOContent } from "@/data/pages";
import { defaultHomeSections, type HomeSectionsConfig } from "@/data/homeSections";

export interface FilmItem {
  id: string;
  title: string;
  cover: string;
  video_url?: string;
  category?: string;
}

export const defaultFilmsList: FilmItem[] = [
  { id: "film-1", title: "A Palace Wedding · Udaipur", cover: defaultSiteImages.destination, video_url: "", category: "Wedding" },
  { id: "film-2", title: "The Kaur & Singh Wedding", cover: defaultSiteImages.couple3, video_url: "", category: "Wedding" },
  { id: "film-3", title: "Aarav + Meera · Highlight", cover: defaultSiteImages.couple2, video_url: "", category: "Wedding" },
  { id: "film-4", title: "Campaign Film · Sona Jewels", cover: defaultSiteImages.fashion, video_url: "", category: "Commercial" },
  { id: "film-5", title: "Baby Aanya's First Year", cover: defaultSiteImages.baby, video_url: "", category: "Baby" },
  { id: "film-6", title: "Corporate Anthem · Vayu Group", cover: defaultSiteImages.corporate, video_url: "", category: "Corporate" },
];

export interface NavItem {
  id: string;
  label: string;
  to: string;
  type: "link" | "dropdown";
  dropdownCategory?: string;
  enabled: boolean;
}

export const defaultNavigationItems: NavItem[] = [
  { id: "nav-1", label: "Home", to: "/", type: "link", enabled: true },
  { id: "nav-2", label: "About", to: "/about", type: "link", enabled: true },
  { id: "nav-3", label: "Photography", to: "#", type: "dropdown", dropdownCategory: "Photography", enabled: true },
  { id: "nav-4", label: "Videography", to: "#", type: "dropdown", dropdownCategory: "Videography", enabled: true },
  { id: "nav-5", label: "Events", to: "#", type: "dropdown", dropdownCategory: "Events", enabled: true },
  { id: "nav-6", label: "Commercial", to: "#", type: "dropdown", dropdownCategory: "Commercial", enabled: true },
  { id: "nav-7", label: "Portfolio", to: "/portfolio", type: "link", enabled: true },
  { id: "nav-8", label: "Films", to: "/films", type: "link", enabled: true },
  { id: "nav-9", label: "Reviews", to: "/reviews", type: "link", enabled: true },
  { id: "nav-10", label: "Blog", to: "/blog", type: "link", enabled: true },
  { id: "nav-11", label: "Contact", to: "/contact", type: "link", enabled: true },
];

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
  customCategoryImages: Record<string, string[]> | null;
  categoryImages: typeof defaultCategoryImages;
  customNavigation: NavItem[] | null;
  navItems: NavItem[];
  customFilms: FilmItem[] | null;
  filmsList: FilmItem[];
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
  customCategoryImages: null,
  categoryImages: defaultCategoryImages,
  customNavigation: null,
  navItems: defaultNavigationItems,
  customFilms: null,
  filmsList: defaultFilmsList,
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
  const [customCategoryImages, setCustomCategoryImages] = useState<Record<string, string[]> | null>(null);
  const [customNavigation, setCustomNavigation] = useState<NavItem[] | null>(null);
  const [customFilms, setCustomFilms] = useState<FilmItem[] | null>(null);
  const [homeSections, setHomeSections] = useState<HomeSectionsConfig>(defaultHomeSections);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const [sRes, svcRes, locRes, revRes, pagesRes, homeRes, catImgRes, navRes, filmRes] = await Promise.all([
        getSiteSettings(),
        getCustomServices(),
        getCustomLocations(),
        getCustomReviews(),
        getCustomPagesSEO(),
        getCustomHomeSections(),
        getCustomCategoryImages(),
        getCustomNavigation(),
        getCustomFilms(),
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
      if (catImgRes?.images) setCustomCategoryImages(catImgRes.images);
      if (navRes?.navigation) setCustomNavigation(navRes.navigation);
      if (filmRes?.films) setCustomFilms(filmRes.films);
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

  const categoryImages = useMemo(() => {
    if (!customCategoryImages) return defaultCategoryImages;
    const merged = { ...defaultCategoryImages };
    for (const key of Object.keys(merged) as (keyof typeof defaultCategoryImages)[]) {
      if (Array.isArray(customCategoryImages[key]) && customCategoryImages[key].length > 0) {
        merged[key] = customCategoryImages[key];
      }
    }
    return merged;
  }, [customCategoryImages]);

  const navItems = useMemo(() => {
    if (customNavigation && Array.isArray(customNavigation) && customNavigation.length > 0) {
      return customNavigation;
    }
    return defaultNavigationItems;
  }, [customNavigation]);

  const filmsList = useMemo(() => {
    if (customFilms && Array.isArray(customFilms) && customFilms.length > 0) {
      return customFilms;
    }
    return defaultFilmsList;
  }, [customFilms]);

  return (
    <SiteContentContext.Provider
      value={{
        settings,
        customServices,
        customLocations,
        customReviews,
        customPagesSEO,
        customCategoryImages,
        categoryImages,
        customNavigation,
        navItems,
        customFilms,
        filmsList,
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
