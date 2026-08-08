import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  LogOut,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Plus,
  Trash2,
  Upload,
  Lock,
  Settings as SettingsIcon,
  Globe,
  Briefcase,
  MapPin,
  Star,
  Sparkles,
  Search,
  Layout,
  Home as HomeIcon,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import {
  adminIsUnlocked,
  adminUnlock,
  adminLogout,
  adminChangePassword,
  listEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  listAlbums,
  upsertAlbum,
  deleteAlbum,
  listAlbumImages,
  addAlbumImage,
  deleteAlbumImage,
  createMediaUploadUrl,
  getMediaSignedUrl,
  listPosts,
  upsertPost,
  deletePost,
  updateAdminSiteSettings,
  getCustomServices,
  updateCustomServices,
  getCustomLocations,
  updateCustomLocations,
  getCustomReviews,
  updateCustomReviews,
  getCustomPagesSEO,
  updateCustomPagesSEO,
  getCustomHomeSections,
  updateCustomHomeSections,
  updateCustomCategoryImages,
  updateCustomNavigation,
  getCustomFilms,
  updateCustomFilms,
} from "@/lib/admin.functions";
import { useSiteContent, defaultNavigationItems, defaultFilmsList, type SiteSettings, type NavItem, type FilmItem } from "@/hooks/useSiteContent";
import { services as defaultServices, type Service } from "@/data/services";
import { locations as defaultLocations, type Location } from "@/data/locations";
import { defaultPagesSEO, type PageKey, type PageSEOContent } from "@/data/pages";
import { defaultHomeSections, type HomeSectionsConfig, type WhyUsItem, type FAQItem } from "@/data/homeSections";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Studio Admin — Kamal Studios" }, { name: "robots", content: "noindex" }],
  }),
  component: Admin,
});

type Tab =
  | "overview"
  | "home_sections"
  | "pages"
  | "enquiries"
  | "portfolio"
  | "films_page"
  | "blog"
  | "services"
  | "locations"
  | "reviews"
  | "navigation"
  | "content"
  | "settings";

function Admin() {
  const check = useServerFn(adminIsUnlocked);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    check()
      .then((r) => {
        setUnlocked(r?.unlocked ?? false);
        setReady(true);
      })
      .catch((err) => {
        console.error("Failed to check admin status:", err);
        setUnlocked(false);
        setReady(true);
      });
  }, [check]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      {unlocked ? <Dashboard onLock={() => setUnlocked(false)} /> : <PasswordGate onUnlocked={() => setUnlocked(true)} />}
      <SiteFooter />
    </div>
  );
}

/* ─────────── Password gate ─────────── */

function PasswordGate({ onUnlocked }: { onUnlocked: () => void }) {
  const unlock = useServerFn(adminUnlock);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const r = await unlock({ data: { password: pw } });
    setBusy(false);
    if (r.ok) onUnlocked();
    else setErr("Incorrect password.");
  };

  return (
    <section className="pt-40 pb-32 container-lux flex justify-center">
      <form onSubmit={submit} className="w-full max-w-sm border border-border p-10 bg-card rounded-sm">
        <Lock className="size-6 text-[color:var(--gold)]" />
        <h1 className="mt-4 font-display text-3xl">Studio Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter the studio password.</p>
        <input
          type="password"
          autoFocus
          required
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="mt-8 w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-[color:var(--gold)] text-sm"
        />
        {err && <div className="mt-3 text-xs text-destructive">{err}</div>}
        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
        >
          {busy ? "Please wait…" : "Enter dashboard"}
        </button>
      </form>
    </section>
  );
}

/* ─────────── Dashboard shell ─────────── */

function Dashboard({ onLock }: { onLock: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const logout = useServerFn(adminLogout);

  return (
    <section className="pt-36 pb-24 container-lux">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="kbd-eyebrow text-[color:var(--gold)]">Dashboard</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Studio Control Center</h1>
        </div>
        <button
          onClick={async () => {
            await logout();
            onLock();
          }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[color:var(--gold)]"
        >
          <LogOut className="size-4" /> Lock
        </button>
      </div>

      <div className="mt-10 flex flex-wrap gap-2 border-b border-border overflow-x-auto">
        {(
          [
            ["overview", "Overview"],
            ["home_sections", "Home Sections"],
            ["pages", "Pages & SEO"],
            ["enquiries", "Enquiries"],
            ["portfolio", "Portfolio"],
            ["films_page", "Films Page"],
            ["blog", "Blog Posting"],
            ["services", "Services"],
            ["locations", "Locations"],
            ["reviews", "Reviews"],
            ["navigation", "Header Menu"],
            ["content", "Site Identity"],
            ["settings", "Settings"],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-3 text-xs uppercase tracking-[0.22em] border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === k
                ? "border-[color:var(--gold)] text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === "overview" && <Overview onGo={setTab} />}
        {tab === "home_sections" && <HomeSectionsPanel />}
        {tab === "pages" && <PagesSEOPanel />}
        {tab === "enquiries" && <EnquiriesPanel />}
        {tab === "portfolio" && <PortfolioPanel />}
        {tab === "films_page" && <FilmsPanel />}
        {tab === "blog" && <BlogPanel />}
        {tab === "services" && <ServicesPanel />}
        {tab === "locations" && <LocationsPanel />}
        {tab === "reviews" && <ReviewsPanel />}
        {tab === "navigation" && <NavigationPanel />}
        {tab === "content" && <ContentPanel />}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </section>
  );
}

function Overview({ onGo }: { onGo: (t: Tab) => void }) {
  const [counts, setCounts] = useState({ enquiries: 0, albums: 0, posts: 0 });
  const enq = useServerFn(listEnquiries);
  const alb = useServerFn(listAlbums);
  const pos = useServerFn(listPosts);
  const { customServices, customLocations, customReviews, customPagesSEO } = useSiteContent();

  useEffect(() => {
    Promise.all([enq(), alb(), pos()]).then(([a, b, c]) =>
      setCounts({ enquiries: a.length, albums: b.length, posts: c.length }),
    );
  }, [enq, alb, pos]);

  const cards = [
    [HomeIcon, "Home Sections", "10 Sections", "home_sections" as Tab],
    [Layout, "Pages & SEO", customPagesSEO ? Object.keys(customPagesSEO).length : 11, "pages" as Tab],
    [MessageSquare, "Enquiries", counts.enquiries, "enquiries" as Tab],
    [ImageIcon, "Portfolio Albums", counts.albums, "portfolio" as Tab],
    [FileText, "Blog Posts", counts.posts, "blog" as Tab],
    [Briefcase, "Services", (customServices || defaultServices).length, "services" as Tab],
    [MapPin, "Service Areas", (customLocations || defaultLocations).length, "locations" as Tab],
    [Star, "Client Reviews", customReviews ? customReviews.length : 6, "reviews" as Tab],
    [Globe, "Site Content", "Edit", "content" as Tab],
    [SettingsIcon, "Studio Settings", "Lock", "settings" as Tab],
  ] as const;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([Icon, title, n, t]) => (
        <button
          key={title}
          onClick={() => onGo(t)}
          className="text-left border border-border p-6 bg-card hover:border-[color:var(--gold)] transition-colors rounded-sm group"
        >
          <Icon className="size-5 text-[color:var(--gold)] group-hover:scale-110 transition-transform" />
          <div className="mt-4 font-display text-3xl md:text-4xl">{n}</div>
          <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{title}</div>
        </button>
      ))}
    </div>
  );
}

/* ─────────── Home Sections Panel (Every Home Section Editable) ─────────── */

function HomeSectionsPanel() {
  const { homeSections, refresh } = useSiteContent();
  const updateSections = useServerFn(updateCustomHomeSections);
  const upload = useMediaUpload();

  const [form, setForm] = useState<HomeSectionsConfig>(homeSections);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [newHeroVideoUrl, setNewHeroVideoUrl] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setForm(homeSections);
  }, [homeSections]);

  const handleUploadHeroVideo = async (file: File) => {
    setUploadingHeroVideo(true);
    try {
      const url = await upload(file);
      setForm((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          videos: [...(prev.hero.videos || []), url],
        },
      }));
    } catch (e) {
      alert("Video upload failed.");
    }
    setUploadingHeroVideo(false);
  };

  const handleAddHeroVideoUrl = () => {
    if (!newHeroVideoUrl.trim()) return;
    setForm((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        videos: [...(prev.hero.videos || []), newHeroVideoUrl.trim()],
      },
    }));
    setNewHeroVideoUrl("");
  };

  const handleRemoveHeroVideo = (index: number) => {
    setForm((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        videos: (prev.hero.videos || []).filter((_, i) => i !== index),
      },
    }));
  };

  const handleWhyUsUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await upload(file);
      setForm((prev) => ({
        ...prev,
        why_us: { ...prev.why_us, image_url: url },
      }));
    } catch (e) {
      alert("Image upload failed.");
    }
    setUploading(false);
  };

  const handleCTAUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await upload(file);
      setForm((prev) => ({
        ...prev,
        final_cta: { ...prev.final_cta, background_image: url },
      }));
    } catch (e) {
      alert("Image upload failed.");
    }
    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await updateSections({ data: { sections: form } });
      if (res.ok) {
        await refresh();
        setMessage({ ok: true, text: "Home Page sections updated successfully!" });
      } else {
        setMessage({ ok: false, text: res.error || "Failed to update sections." });
      }
    } catch (err) {
      setMessage({ ok: false, text: "Error saving Home sections." });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={save} className="space-y-10 max-w-4xl">
      {/* 1. Hero */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
          <HomeIcon className="size-5" /> 1. Home Hero Banner Section
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Hero Title Part 1"
            value={form.hero.title_part1}
            onChange={(v) => setForm({ ...form, hero: { ...form.hero, title_part1: v } })}
          />
          <Input
            label="Hero Title Part 2 (Italic / Gold Accent)"
            value={form.hero.title_part2}
            onChange={(v) => setForm({ ...form, hero: { ...form.hero, title_part2: v } })}
          />
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Hero Subtitle</label>
            <textarea
              value={form.hero.subtitle}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })}
              rows={3}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <Input
            label="Primary Button Text"
            value={form.hero.btn_primary_text}
            onChange={(v) => setForm({ ...form, hero: { ...form.hero, btn_primary_text: v } })}
          />
          <Input
            label="Secondary Button Text"
            value={form.hero.btn_secondary_text}
            onChange={(v) => setForm({ ...form, hero: { ...form.hero, btn_secondary_text: v } })}
          />

          <div className="md:col-span-2 pt-4 border-t border-border">
            <label className="kbd-eyebrow text-muted-foreground block mb-2">
              Background Videos Carousel (Upload MP4 / WebM or Paste Video URLs)
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Paste video URL here..."
                value={newHeroVideoUrl}
                onChange={(e) => setNewHeroVideoUrl(e.target.value)}
                className="flex-1 min-w-[200px] bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-[color:var(--gold)]"
              />
              <button
                type="button"
                onClick={handleAddHeroVideoUrl}
                className="px-4 py-2 border border-border text-xs uppercase tracking-[0.18em] hover:border-[color:var(--gold)] transition-colors"
              >
                Add URL
              </button>
              <label className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.18em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors cursor-pointer">
                <Upload className="size-4" /> {uploadingHeroVideo ? "Uploading…" : "Upload MP4"}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadHeroVideo(e.target.files[0]);
                  }}
                />
              </label>
            </div>

            {form.hero.videos && form.hero.videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {form.hero.videos.map((v, idx) => (
                  <div key={v + idx} className="relative group bg-black rounded-sm border border-border overflow-hidden">
                    <video src={v} muted className="h-28 w-full object-cover" />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3">
                      <span className="text-[10px] text-white/90 truncate max-w-[140px]">{v}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHeroVideo(idx)}
                        className="bg-destructive text-white p-1.5 rounded-full hover:scale-110 transition-transform"
                        title="Remove video"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Using default video carousel. Upload MP4 videos or add video URLs above to customize.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Featured Services */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
          <Briefcase className="size-5" /> 2. Featured Services Section Header
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Eyebrow Tag"
            value={form.featured_services.eyebrow}
            onChange={(v) => setForm({ ...form, featured_services: { ...form.featured_services, eyebrow: v } })}
          />
          <Input
            label="Section Title (H2)"
            value={form.featured_services.heading}
            onChange={(v) => setForm({ ...form, featured_services: { ...form.featured_services, heading: v } })}
          />
        </div>
      </div>

      {/* 3. Why Us Section */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
          <CheckCircle className="size-5" /> 3. Why Kamal Studios Section & Items
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Eyebrow Tag"
            value={form.why_us.eyebrow}
            onChange={(v) => setForm({ ...form, why_us: { ...form.why_us, eyebrow: v } })}
          />
          <Input
            label="Section Title"
            value={form.why_us.heading}
            onChange={(v) => setForm({ ...form, why_us: { ...form.why_us, heading: v } })}
          />
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Section Feature Image</label>
            <div className="mt-3 flex items-center gap-4">
              {form.why_us.image_url && <img src={form.why_us.image_url} alt="" className="w-32 h-32 object-cover bg-black" />}
              <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
                <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload Feature Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleWhyUsUpload(e.target.files[0])}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border space-y-4">
          <div className="font-display text-lg">Why Us Feature Points ({form.why_us.items.length})</div>
          {form.why_us.items.map((item, idx) => (
            <div key={idx} className="grid gap-4 sm:grid-cols-2 p-4 border border-border bg-background rounded-sm">
              <Input
                label={`Point #${idx + 1} Title`}
                value={item.title}
                onChange={(v) => {
                  const updated = [...form.why_us.items];
                  updated[idx] = { ...item, title: v };
                  setForm({ ...form, why_us: { ...form.why_us, items: updated } });
                }}
              />
              <Input
                label={`Point #${idx + 1} Description`}
                value={item.desc}
                onChange={(v) => {
                  const updated = [...form.why_us.items];
                  updated[idx] = { ...item, desc: v };
                  setForm({ ...form, why_us: { ...form.why_us, items: updated } });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Portfolio Preview & Films */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
          <ImageIcon className="size-5" /> 4 & 5. Portfolio & Films Headers
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Portfolio Section Eyebrow"
            value={form.portfolio_preview.eyebrow}
            onChange={(v) => setForm({ ...form, portfolio_preview: { ...form.portfolio_preview, eyebrow: v } })}
          />
          <Input
            label="Portfolio Section Title"
            value={form.portfolio_preview.heading}
            onChange={(v) => setForm({ ...form, portfolio_preview: { ...form.portfolio_preview, heading: v } })}
          />
          <Input
            label="Films Section Eyebrow"
            value={form.films_section.eyebrow}
            onChange={(v) => setForm({ ...form, films_section: { ...form.films_section, eyebrow: v } })}
          />
          <Input
            label="Films Section Title"
            value={form.films_section.heading}
            onChange={(v) => setForm({ ...form, films_section: { ...form.films_section, heading: v } })}
          />
        </div>
      </div>

      {/* 6. Process Section */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
          <Sparkles className="size-5" /> 6. Process Milestones Section
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Eyebrow Tag"
            value={form.process_section.eyebrow}
            onChange={(v) => setForm({ ...form, process_section: { ...form.process_section, eyebrow: v } })}
          />
          <Input
            label="Section Title"
            value={form.process_section.heading}
            onChange={(v) => setForm({ ...form, process_section: { ...form.process_section, heading: v } })}
          />
          <div className="md:col-span-2">
            <Input
              label="Process Steps (Comma Separated)"
              value={form.process_section.steps.join(", ")}
              onChange={(v) =>
                setForm({
                  ...form,
                  process_section: {
                    ...form.process_section,
                    steps: v.split(",").map((s) => s.trim()),
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* 7. Service Areas Section */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
          <MapPin className="size-5" /> 7. Service Areas Section Header
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Eyebrow Tag"
            value={form.service_areas_section.eyebrow}
            onChange={(v) => setForm({ ...form, service_areas_section: { ...form.service_areas_section, eyebrow: v } })}
          />
          <Input
            label="Section Title"
            value={form.service_areas_section.heading}
            onChange={(v) => setForm({ ...form, service_areas_section: { ...form.service_areas_section, heading: v } })}
          />
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Intro Paragraph</label>
            <textarea
              value={form.service_areas_section.paragraph}
              onChange={(e) =>
                setForm({
                  ...form,
                  service_areas_section: { ...form.service_areas_section, paragraph: e.target.value },
                })
              }
              rows={3}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
            />
          </div>
        </div>
      </div>

      {/* 8. FAQ Section */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-display text-2xl text-[color:var(--gold)] flex items-center gap-2">
            <HelpCircle className="size-5" /> 8. Home FAQ Accordion Section
          </h3>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                faq_section: {
                  ...form.faq_section,
                  faqs: [...form.faq_section.faqs, { q: "New Question?", a: "Answer text here." }],
                },
              })
            }
            className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-xs uppercase tracking-widest hover:border-[color:var(--gold)]"
          >
            <Plus className="size-3.5" /> Add FAQ
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Eyebrow Tag"
            value={form.faq_section.eyebrow}
            onChange={(v) => setForm({ ...form, faq_section: { ...form.faq_section, eyebrow: v } })}
          />
          <Input
            label="Section Title"
            value={form.faq_section.heading}
            onChange={(v) => setForm({ ...form, faq_section: { ...form.faq_section, heading: v } })}
          />
        </div>

        <div className="space-y-4 pt-4">
          {form.faq_section.faqs.map((f, idx) => (
            <div key={idx} className="p-4 border border-border bg-background space-y-3 rounded-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[color:var(--gold)] uppercase">FAQ #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = form.faq_section.faqs.filter((_, i) => i !== idx);
                    setForm({ ...form, faq_section: { ...form.faq_section, faqs: updated } });
                  }}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove FAQ
                </button>
              </div>
              <Input
                label="Question"
                value={f.q}
                onChange={(v) => {
                  const updated = [...form.faq_section.faqs];
                  updated[idx] = { ...f, q: v };
                  setForm({ ...form, faq_section: { ...form.faq_section, faqs: updated } });
                }}
              />
              <div>
                <label className="kbd-eyebrow text-muted-foreground">Answer</label>
                <textarea
                  value={f.a}
                  onChange={(e) => {
                    const updated = [...form.faq_section.faqs];
                    updated[idx] = { ...f, a: e.target.value };
                    setForm({ ...form, faq_section: { ...form.faq_section, faqs: updated } });
                  }}
                  rows={2}
                  className="mt-2 w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-[color:var(--gold)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Final CTA Banner */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
          <Globe className="size-5" /> 9. Final CTA Booking Banner
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Eyebrow Tag"
            value={form.final_cta.eyebrow}
            onChange={(v) => setForm({ ...form, final_cta: { ...form.final_cta, eyebrow: v } })}
          />
          <Input
            label="Headline"
            value={form.final_cta.heading}
            onChange={(v) => setForm({ ...form, final_cta: { ...form.final_cta, heading: v } })}
          />
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Paragraph Text</label>
            <textarea
              value={form.final_cta.paragraph}
              onChange={(e) => setForm({ ...form, final_cta: { ...form.final_cta, paragraph: e.target.value } })}
              rows={2}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <Input
            label="Primary Button Label"
            value={form.final_cta.btn_primary_text}
            onChange={(v) => setForm({ ...form, final_cta: { ...form.final_cta, btn_primary_text: v } })}
          />
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Background Image</label>
            <div className="mt-3 flex items-center gap-4">
              {form.final_cta.background_image && (
                <img src={form.final_cta.background_image} alt="" className="w-32 h-20 object-cover bg-black" />
              )}
              <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
                <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload Background Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleCTAUpload(e.target.files[0])}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 border ${message.ok ? "border-[color:var(--gold)] text-[color:var(--gold)] bg-card" : "border-destructive text-destructive bg-card"} text-sm`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
        >
          {saving ? "Saving Changes…" : "Save All Home Sections"}
        </button>
      </div>
    </form>
  );
}

/* ─────────── Pages & SEO Editor Panel ─────────── */

const pageLabels: Record<PageKey, string> = {
  home: "Home Page ( / )",
  about: "About Us ( /about )",
  services: "Services Directory ( /services )",
  locations: "Service Areas Directory ( /locations )",
  portfolio: "Portfolio ( /portfolio )",
  films: "Cinematic Films ( /films )",
  reviews: "Client Reviews ( /reviews )",
  blog: "Journal / Blog Directory ( /blog )",
  contact: "Contact Us ( /contact )",
  privacy: "Privacy Policy ( /privacy )",
  terms: "Terms & Conditions ( /terms )",
};

function PagesSEOPanel() {
  const { customPagesSEO, refresh } = useSiteContent();
  const updateSEO = useServerFn(updateCustomPagesSEO);
  const upload = useMediaUpload();

  const [selectedKey, setSelectedKey] = useState<PageKey>("home");
  const [pagesState, setPagesState] = useState<Record<string, PageSEOContent>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const merged: Record<string, PageSEOContent> = {};
    (Object.keys(defaultPagesSEO) as PageKey[]).forEach((k) => {
      merged[k] = {
        ...defaultPagesSEO[k],
        ...(customPagesSEO?.[k] || {}),
      };
    });
    setPagesState(merged);
  }, [customPagesSEO]);

  const currentPage = pagesState[selectedKey] || defaultPagesSEO[selectedKey];

  const updateCurrentPage = (fields: Partial<PageSEOContent>) => {
    setPagesState((prev) => ({
      ...prev,
      [selectedKey]: {
        ...prev[selectedKey],
        ...fields,
      },
    }));
  };

  const handleHeroImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await upload(file);
      updateCurrentPage({ hero_image: url, og_image: url });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Image upload failed");
    }
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await updateSEO({ data: { pages: pagesState } });
      if (res.ok) {
        await refresh();
        setMessage({ ok: true, text: `Successfully updated content & SEO for ${pageLabels[selectedKey]}!` });
      } else {
        setMessage({ ok: false, text: res.error || "Failed to save page settings." });
      }
    } catch (err) {
      setMessage({ ok: false, text: "An error occurred while saving." });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Page selector */}
      <div className="border border-border p-6 bg-card rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="kbd-eyebrow text-[color:var(--gold)]">Select Page</div>
          <h2 className="font-display text-2xl mt-1">Page Copy & SEO Editor</h2>
        </div>
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value as PageKey)}
          className="bg-transparent border border-border px-4 py-2 text-sm focus:outline-none focus:border-[color:var(--gold)] font-medium"
        >
          {(Object.keys(pageLabels) as PageKey[]).map((k) => (
            <option key={k} value={k}>
              {pageLabels[k]}
            </option>
          ))}
        </select>
      </div>

      {/* Page Elements & Copy */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-xl border-b border-border pb-3 text-[color:var(--gold)] flex items-center gap-2">
          <Layout className="size-5" /> On-Page Copy & Elements ({pageLabels[selectedKey]})
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Page Main Heading (H1)"
            value={currentPage.heading ?? ""}
            onChange={(v) => updateCurrentPage({ heading: v })}
          />
          <Input
            label="Subheading / Tagline"
            value={currentPage.subheading ?? ""}
            onChange={(v) => updateCurrentPage({ subheading: v })}
          />
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Main Section Body Text</label>
            <textarea
              value={currentPage.body_text ?? ""}
              onChange={(e) => updateCurrentPage({ body_text: e.target.value })}
              rows={4}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Hero / Header Image</label>
            <div className="mt-3 flex items-center gap-4">
              {currentPage.hero_image && (
                <img src={currentPage.hero_image} alt="" className="w-32 h-32 object-cover bg-black" />
              )}
              <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
                <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload Header Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleHeroImageUpload(e.target.files[0])}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Controls */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-xl border-b border-border pb-3 text-[color:var(--gold)] flex items-center gap-2">
          <Search className="size-5" /> Search Engine Optimization (SEO) Metadata
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Meta Title (<title> Tag)"
              value={currentPage.meta_title ?? ""}
              placeholder="Title for Google search results"
              onChange={(v) => updateCurrentPage({ meta_title: v })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Meta Description</label>
            <textarea
              value={currentPage.meta_description ?? ""}
              onChange={(e) => updateCurrentPage({ meta_description: e.target.value })}
              rows={3}
              placeholder="Search snippet summary shown on Google results"
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Meta Keywords (Comma Separated)"
              value={currentPage.meta_keywords ?? ""}
              placeholder="e.g. luxury wedding photography, chandigarh wedding photographer, indian wedding films"
              onChange={(v) => updateCurrentPage({ meta_keywords: v })}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="SEO Tags (Comma Separated)"
              value={currentPage.tags ?? ""}
              placeholder="e.g. wedding, luxury, photography, chandigarh"
              onChange={(v) => updateCurrentPage({ tags: v })}
            />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 border ${message.ok ? "border-[color:var(--gold)] text-[color:var(--gold)] bg-card" : "border-destructive text-destructive bg-card"} text-sm`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
        >
          {saving ? "Saving Changes…" : `Save ${pageLabels[selectedKey]} Copy & SEO`}
        </button>
      </div>
    </form>
  );
}

/* ─────────── Enquiries ─────────── */

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  event_date: string | null;
  message: string;
  status: string;
  created_at: string;
};

function EnquiriesPanel() {
  const list = useServerFn(listEnquiries);
  const setStatusFn = useServerFn(updateEnquiryStatus);
  const removeFn = useServerFn(deleteEnquiry);
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await list();
    setRows(data as Enquiry[]);
    setLoading(false);
  }, [list]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await setStatusFn({ data: { id, status } });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await removeFn({ data: { id } });
    load();
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading enquiries…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">{rows.length} total enquiries</div>
      </div>

      {!rows.length && <Empty label="No enquiries received yet." />}

      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.id} className="border border-border p-6 bg-card space-y-3 rounded-sm">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="font-display text-xl">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-4">
                  <span>✉ {r.email}</span>
                  {r.phone && <span>📞 {r.phone}</span>}
                  {r.service && <span>✦ {r.service}</span>}
                  {r.event_date && <span>📅 Event: {r.event_date}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="bg-transparent border border-border px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[color:var(--gold)]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  onClick={() => remove(r.id)}
                  className="p-1.5 border border-destructive/50 text-destructive hover:bg-destructive hover:text-white transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
              "{r.message}"
            </p>
            <div className="text-[10px] text-muted-foreground/70 text-right">
              Received: {new Date(r.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Media Upload Hook ─────────── */

function useMediaUpload() {
  const create = useServerFn(createMediaUploadUrl);
  const getUrl = useServerFn(getMediaSignedUrl);
  return async (file: File): Promise<string> => {
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const c = await create({ data: { ext } });
    if (!c.ok) throw new Error(c.error);
    if ((c as any).isMock) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    const putRes = await fetch(c.signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!putRes.ok) throw new Error(`Upload failed: ${putRes.status}`);
    const s = await getUrl({ data: { path: c.path } });
    if (!s.ok) throw new Error(s.error);
    return s.url;
  };
}

/* ─────────── Portfolio ─────────── */

type Album = {
  id: string;
  slug: string;
  title: string;
  category: string;
  cover_url: string | null;
  description: string | null;
  sort_order: number;
  published: boolean;
};

type AlbumImage = {
  id: string;
  url: string;
  caption: string | null;
  sort_order: number;
};

function PortfolioPanel() {
  const { categoryImages, refresh } = useSiteContent();
  const saveCatImages = useServerFn(updateCustomCategoryImages);
  const upload = useMediaUpload();

  const [mode, setMode] = useState<"categories" | "albums">("categories");
  const [selectedCat, setSelectedCat] = useState<CategoryKey>("Wedding");
  const [localCatImages, setLocalCatImages] = useState<Record<string, string[]>>({});
  const [savingCat, setSavingCat] = useState(false);
  const [uploadingCat, setUploadingCat] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  const list = useServerFn(listAlbums);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [editing, setEditing] = useState<Album | null>(null);

  useEffect(() => {
    if (categoryImages) {
      setLocalCatImages(JSON.parse(JSON.stringify(categoryImages)));
    }
  }, [categoryImages]);

  const loadAlbums = useCallback(async () => {
    setAlbums((await list()) as Album[]);
  }, [list]);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  if (editing)
    return (
      <AlbumEditor
        album={editing}
        onClose={() => {
          setEditing(null);
          loadAlbums();
        }}
      />
    );

  const currentCatList = localCatImages[selectedCat] || [];

  const handleUploadCategoryImg = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploadingCat(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        const u = await upload(f);
        urls.push(u);
      }
      setLocalCatImages((prev) => ({
        ...prev,
        [selectedCat]: [...(prev[selectedCat] || []), ...urls],
      }));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    }
    setUploadingCat(false);
  };

  const handleAddUrl = () => {
    if (!newUrl.trim()) return;
    setLocalCatImages((prev) => ({
      ...prev,
      [selectedCat]: [...(prev[selectedCat] || []), newUrl.trim()],
    }));
    setNewUrl("");
  };

  const handleRemoveCategoryImg = (idx: number) => {
    setLocalCatImages((prev) => ({
      ...prev,
      [selectedCat]: (prev[selectedCat] || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSaveCatImages = async () => {
    setSavingCat(true);
    try {
      const r = await saveCatImages({ data: { images: localCatImages } });
      if (!r.ok) {
        alert("Failed to save category images: " + ("error" in r ? r.error : "Unknown error"));
        return;
      }
      await refresh();
      alert("Category images saved successfully!");
    } catch (err: any) {
      alert("Error saving category images: " + (err?.message || "Unknown error"));
    } finally {
      setSavingCat(false);
    }
  };

  const categoriesList: CategoryKey[] = [
    "Wedding",
    "Pre-Wedding",
    "Baby",
    "Maternity",
    "Fashion",
    "Commercial",
    "Corporate",
    "Events",
    "Products",
    "Real Estate",
  ];

  return (
    <div>
      <div className="flex border-b border-border mb-6 gap-6">
        <button
          onClick={() => setMode("categories")}
          className={`pb-3 text-xs uppercase tracking-[0.22em] font-medium border-b-2 transition-colors ${
            mode === "categories"
              ? "border-[color:var(--gold)] text-[color:var(--gold)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Category Gallery Images
        </button>
        <button
          onClick={() => setMode("albums")}
          className={`pb-3 text-xs uppercase tracking-[0.22em] font-medium border-b-2 transition-colors ${
            mode === "albums"
              ? "border-[color:var(--gold)] text-[color:var(--gold)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Featured Albums ({albums.length})
        </button>
      </div>

      {mode === "categories" ? (
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 text-xs uppercase tracking-[0.18em] border rounded-sm transition-colors ${
                  selectedCat === cat
                    ? "bg-foreground text-background border-foreground font-semibold"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                }`}
              >
                {cat} ({localCatImages[cat]?.length || 0})
              </button>
            ))}
          </div>

          <div className="bg-card border border-border p-6 rounded-sm mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-xl">{selectedCat} Gallery</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage all photos displayed for the {selectedCat} category grid on the portfolio page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors cursor-pointer">
                  <Upload className="size-4" /> {uploadingCat ? "Uploading…" : "Upload Photos"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleUploadCategoryImg(e.target.files)}
                  />
                </label>

                <button
                  onClick={handleSaveCatImages}
                  disabled={savingCat}
                  className="bg-[color:var(--gold)] text-black px-5 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:bg-white transition-colors disabled:opacity-50"
                >
                  {savingCat ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <input
                type="text"
                placeholder="Or paste image URL here..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-[color:var(--gold)]"
              />
              <button
                onClick={handleAddUrl}
                className="px-4 py-2 border border-border text-xs uppercase tracking-[0.18em] hover:border-[color:var(--gold)] transition-colors"
              >
                Add URL
              </button>
            </div>

            {!currentCatList.length ? (
              <Empty label={`No images in ${selectedCat} gallery yet. Upload some above.`} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentCatList.map((src, i) => (
                  <div key={src + i} className="group relative aspect-[4/5] bg-black overflow-hidden rounded-sm border border-border">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        onClick={() => handleRemoveCategoryImg(i)}
                        className="bg-destructive text-white p-2 rounded-full hover:scale-110 transition-transform"
                        title="Delete image"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">{albums.length} albums</div>
            <button
              onClick={() =>
                setEditing({
                  id: "",
                  slug: "",
                  title: "",
                  category: "Wedding",
                  cover_url: "",
                  description: "",
                  sort_order: 0,
                  published: true,
                })
              }
              className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors"
            >
              <Plus className="size-4" /> New album
            </button>
          </div>

          {!albums.length && <Empty label="No portfolio albums yet. Create your first." />}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((a) => (
              <button
                key={a.id}
                onClick={() => setEditing(a)}
                className="text-left border border-border bg-card hover:border-[color:var(--gold)] p-4 flex flex-col justify-between transition-colors group rounded-sm"
              >
                <div className="aspect-[4/3] bg-black overflow-hidden relative w-full mb-3">
                  {a.cover_url && (
                    <img src={a.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  )}
                </div>
                <div>
                  <div className="font-display text-xl group-hover:text-[color:var(--gold)] transition-colors">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {a.category} · /{a.slug}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AlbumEditor({ album, onClose }: { album: Album; onClose: () => void }) {
  const saveFn = useServerFn(upsertAlbum);
  const removeFn = useServerFn(deleteAlbum);
  const listImg = useServerFn(listAlbumImages);
  const addImg = useServerFn(addAlbumImage);
  const removeImg = useServerFn(deleteAlbumImage);
  const upload = useMediaUpload();

  const [a, setA] = useState<Album>(album);
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isNew = !a.id;

  const loadImages = useCallback(async () => {
    if (!a.id) return;
    setImages((await listImg({ data: { albumId: a.id } })) as AlbumImage[]);
  }, [a.id, listImg]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const save = async () => {
    setSaving(true);
    const slug = a.slug || slugify(a.title);
    const r = await saveFn({
      data: {
        id: a.id || undefined,
        slug,
        title: a.title,
        category: a.category,
        cover_url: a.cover_url,
        description: a.description,
        sort_order: a.sort_order,
        published: a.published,
      },
    });
    setSaving(false);
    if (!r.ok) return alert(r.error);
    if (isNew) onClose();
  };

  const remove = async () => {
    if (!confirm("Delete this album?")) return;
    await removeFn({ data: { id: a.id } });
    onClose();
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const url = await upload(file);
      setA({ ...a, cover_url: url });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  };

  const addImages = async (files: FileList | null) => {
    if (!files || !a.id) return;
    setUploading(true);
    try {
      let i = images.length;
      for (const f of Array.from(files)) {
        const url = await upload(f);
        await addImg({ data: { albumId: a.id, url, sortOrder: i++ } });
      }
      loadImages();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  };

  const removeImage = async (id: string) => {
    await removeImg({ data: { id } });
    loadImages();
  };

  return (
    <div>
      <button
        onClick={onClose}
        className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[color:var(--gold)] mb-6 font-medium"
      >
        ← Back to albums
      </button>
      <div className="grid gap-6 md:grid-cols-2">
        <Input label="Title" value={a.title} onChange={(v) => setA({ ...a, title: v })} />
        <Input
          label="Slug (URL)"
          value={a.slug}
          placeholder={slugify(a.title)}
          onChange={(v) => setA({ ...a, slug: v })}
        />
        <div className="flex flex-col gap-2">
          <label className="kbd-eyebrow text-muted-foreground">Category</label>
          <select
            value={a.category}
            onChange={(e) => setA({ ...a, category: e.target.value })}
            className="bg-transparent border-b border-border py-3 text-sm"
          >
            {["Wedding", "Pre-Wedding", "Baby", "Maternity", "Fashion", "Commercial", "Corporate", "Events", "Products", "Real Estate"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <Input
          label="Sort order"
          type="number"
          value={String(a.sort_order)}
          onChange={(v) => setA({ ...a, sort_order: Number(v) || 0 })}
        />
        <div className="md:col-span-2">
          <label className="kbd-eyebrow text-muted-foreground">Description</label>
          <textarea
            value={a.description ?? ""}
            onChange={(e) => setA({ ...a, description: e.target.value })}
            rows={3}
            className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="kbd-eyebrow text-muted-foreground">Cover image</label>
          <div className="mt-3 flex items-center gap-4">
            {a.cover_url && <img src={a.cover_url} alt="" className="w-32 h-32 object-cover bg-black" />}
            <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload cover"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[color:var(--gold)] hover:text-black transition-colors font-medium disabled:opacity-50"
        >
          {saving ? "Saving…" : isNew ? "Create album" : "Save Album"}
        </button>
        {!isNew && (
          <button
            onClick={remove}
            className="border border-destructive text-destructive px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-destructive hover:text-white transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {!isNew && (
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display text-2xl">Gallery ({images.length})</div>
            <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Add images"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addImages(e.target.files)}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((im) => (
              <div key={im.id} className="relative group aspect-square bg-black">
                <img src={im.url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(im.id)}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────── Blog Panel (Full Posting + SEO) ─────────── */

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  content: string;
  category: string | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  tags?: string;
};

function BlogPanel() {
  const list = useServerFn(listPosts);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);

  const load = useCallback(async () => {
    setPosts((await list()) as Post[]);
  }, [list]);

  useEffect(() => {
    load();
  }, [load]);

  if (editing)
    return (
      <PostEditor
        post={editing}
        onClose={() => {
          setEditing(null);
          load();
        }}
      />
    );

  const newPost = () =>
    setEditing({
      id: "",
      slug: "",
      title: "",
      excerpt: "",
      cover_url: "",
      content: "",
      category: "Craft",
      author: "Kamal Studios",
      published: false,
      published_at: null,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      tags: "",
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">{posts.length} published blog posts</div>
        <button
          onClick={newPost}
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors"
        >
          <Plus className="size-4" /> Create New Blog Post
        </button>
      </div>

      {!posts.length && <Empty label="No posts yet. Write your first blog article." />}

      <div className="space-y-3">
        {posts.map((p) => (
          <button
            key={p.id}
            onClick={() => setEditing(p)}
            className="w-full text-left border border-border bg-card hover:border-[color:var(--gold)] p-4 flex gap-4 transition-colors rounded-sm group"
          >
            <div className="w-24 h-24 bg-black flex-shrink-0 overflow-hidden rounded-sm">
              {p.cover_url && <img src={p.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate group-hover:text-[color:var(--gold)] transition-colors">{p.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{p.category} · /{p.slug}</div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase tracking-[0.22em] px-2 py-0.5 border ${
                    p.published
                      ? "border-[color:var(--gold)] text-[color:var(--gold)]"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {p.published ? "Published" : "Draft"}
                </span>
                {p.tags && <span className="text-xs text-muted-foreground">🏷 {p.tags}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PostEditor({ post, onClose }: { post: Post; onClose: () => void }) {
  const saveFn = useServerFn(upsertPost);
  const removeFn = useServerFn(deletePost);
  const upload = useMediaUpload();
  const [p, setP] = useState<Post>(post);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isNew = !p.id;

  const save = async () => {
    setSaving(true);
    const slug = p.slug || slugify(p.title);
    const r = await saveFn({
      data: {
        id: p.id || undefined,
        slug,
        title: p.title,
        excerpt: p.excerpt,
        cover_url: p.cover_url,
        content: p.content,
        category: p.category,
        author: p.author,
        published: p.published,
        published_at: p.published_at,
        meta_title: p.meta_title || p.title,
        meta_description: p.meta_description || p.excerpt,
        meta_keywords: p.meta_keywords,
        tags: p.tags,
      } as any,
    });
    setSaving(false);
    if (!r.ok) return alert(r.error);
    onClose();
  };

  const remove = async () => {
    if (!confirm("Delete this post?")) return;
    await removeFn({ data: { id: p.id } });
    onClose();
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const url = await upload(file);
      setP({ ...p, cover_url: url });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-8">
      <button
        onClick={onClose}
        className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[color:var(--gold)] font-medium"
      >
        ← Back to posts
      </button>

      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3">Article Details</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Article Title" value={p.title} onChange={(v) => setP({ ...p, title: v, slug: p.slug || slugify(v) })} />
          <Input label="Slug (URL)" value={p.slug} placeholder={slugify(p.title)} onChange={(v) => setP({ ...p, slug: v })} />
          <Input label="Category (e.g. Craft, Tips, Venues)" value={p.category ?? ""} onChange={(v) => setP({ ...p, category: v })} />
          <Input label="Author" value={p.author ?? ""} onChange={(v) => setP({ ...p, author: v })} />
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Excerpt (Short Preview Summary)</label>
            <textarea
              value={p.excerpt ?? ""}
              onChange={(e) => setP({ ...p, excerpt: e.target.value })}
              rows={2}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Cover Image Banner</label>
            <div className="mt-3 flex items-center gap-4">
              {p.cover_url && <img src={p.cover_url} alt="" className="w-32 h-32 object-cover bg-black" />}
              <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
                <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload Cover Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
                />
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Full Content (Markdown Supported)</label>
            <textarea
              value={p.content}
              onChange={(e) => setP({ ...p, content: e.target.value })}
              rows={14}
              className="mt-2 w-full bg-transparent border border-border p-4 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
          <Search className="size-5" /> Blog Post SEO & Tags Settings
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Post SEO Meta Title (<title>)"
              value={p.meta_title ?? ""}
              placeholder={p.title || "Custom SEO Title for Google"}
              onChange={(v) => setP({ ...p, meta_title: v })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="kbd-eyebrow text-muted-foreground">Post SEO Meta Description</label>
            <textarea
              value={p.meta_description ?? ""}
              onChange={(e) => setP({ ...p, meta_description: e.target.value })}
              rows={3}
              placeholder={p.excerpt || "Google search result snippet for this post"}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <Input
            label="Meta Keywords (Comma Separated)"
            value={p.meta_keywords ?? ""}
            placeholder="e.g. wedding tips, rajasthan venues, bridal fashion"
            onChange={(v) => setP({ ...p, meta_keywords: v })}
          />
          <Input
            label="Tags (Comma Separated)"
            value={p.tags ?? ""}
            placeholder="e.g. Wedding, Photography, Advice"
            onChange={(v) => setP({ ...p, tags: v })}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={p.published}
            onChange={(e) => setP({ ...p, published: e.target.checked })}
            className="size-4 text-[color:var(--gold)]"
          />
          Publish Article Live
        </label>
      </div>

      <div className="flex flex-wrap gap-4 pt-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isNew ? "Publish New Post" : "Save Blog Post & SEO"}
        </button>
        {!isNew && (
          <button
            onClick={remove}
            className="border border-destructive text-destructive px-6 py-4 text-xs uppercase tracking-[0.24em] hover:bg-destructive hover:text-white transition-colors"
          >
            Delete Post
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────── Services Panel ─────────── */

function ServicesPanel() {
  const { customServices, refresh } = useSiteContent();
  const updateSvc = useServerFn(updateCustomServices);
  const upload = useMediaUpload();

  const [items, setItems] = useState<Service[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setItems((customServices && customServices.length > 0 ? customServices : defaultServices) as Service[]);
  }, [customServices]);

  const saveAll = async (newItems: Service[]) => {
    setSaving(true);
    try {
      const res = await updateSvc({ data: { services: newItems } });
      if (res.ok) {
        await refresh();
      } else {
        alert("Failed to save services.");
      }
    } catch (e) {
      alert("Error saving services.");
    }
    setSaving(false);
  };

  const addItem = () => {
    const newSvc: Service = {
      slug: `new-service-${Date.now()}`,
      title: "New Service",
      category: "Photography",
      short: "Short tagline for new service.",
      hero: defaultServices[0].hero,
      gallery: [defaultServices[0].hero],
      intro: "Detailed description of the new service.",
      features: ["Professional Lighting", "4K Video & Cinema Lenses", "Full Crew Dispatch"],
      faqs: [{ q: "How do we book this service?", a: "Contact us via the form or WhatsApp." }],
    };
    const updated = [newSvc, ...items];
    setItems(updated);
    setEditingIndex(0);
  };

  const removeItem = async (index: number) => {
    if (!confirm("Delete this service?")) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    if (editingIndex === index) setEditingIndex(null);
    await saveAll(updated);
  };

  const uploadHero = async (file: File, index: number) => {
    setUploading(true);
    try {
      const url = await upload(file);
      const updated = [...items];
      updated[index] = { ...updated[index], hero: url };
      setItems(updated);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Hero upload failed");
    }
    setUploading(false);
  };

  if (editingIndex !== null && items[editingIndex]) {
    const s = items[editingIndex];
    return (
      <div className="space-y-8">
        <button
          onClick={() => setEditingIndex(null)}
          className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[color:var(--gold)] font-medium"
        >
          ← Back to Services List
        </button>

        <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
          <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3">Service Details</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Title" value={s.title} onChange={(v) => {
              const updated = [...items];
              updated[editingIndex] = { ...s, title: v, slug: slugify(v) };
              setItems(updated);
            }} />
            <Input label="Slug (URL)" value={s.slug} onChange={(v) => {
              const updated = [...items];
              updated[editingIndex] = { ...s, slug: v };
              setItems(updated);
            }} />

            <div className="flex flex-col gap-2">
              <label className="kbd-eyebrow text-muted-foreground">Category</label>
              <select
                value={s.category}
                onChange={(e) => {
                  const updated = [...items];
                  updated[editingIndex] = { ...s, category: e.target.value as any };
                  setItems(updated);
                }}
                className="bg-transparent border-b border-border py-3 text-sm"
              >
                {["Photography", "Videography", "Events", "Commercial"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <Input label="Short Description (Card Subtitle)" value={s.short} onChange={(v) => {
                const updated = [...items];
                updated[editingIndex] = { ...s, short: v };
                setItems(updated);
              }} />
            </div>

            <div className="md:col-span-2">
              <label className="kbd-eyebrow text-muted-foreground">Full Intro Text</label>
              <textarea
                value={s.intro}
                onChange={(e) => {
                  const updated = [...items];
                  updated[editingIndex] = { ...s, intro: e.target.value };
                  setItems(updated);
                }}
                rows={4}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="kbd-eyebrow text-muted-foreground">Hero Image Banner</label>
              <div className="mt-3 flex items-center gap-4">
                {s.hero && <img src={s.hero} alt="" className="w-32 h-32 object-cover bg-black" />}
                <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
                  <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload Hero Banner"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadHero(e.target.files[0], editingIndex)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
          <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
            <Search className="size-5" /> Service SEO Settings
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="SEO Meta Title"
                value={(s as any).meta_title ?? `${s.title} — Kamal Studios`}
                onChange={(v) => {
                  const updated = [...items];
                  updated[editingIndex] = { ...s, meta_title: v } as any;
                  setItems(updated);
                }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="kbd-eyebrow text-muted-foreground">SEO Meta Description</label>
              <textarea
                value={(s as any).meta_description ?? s.short}
                onChange={(e) => {
                  const updated = [...items];
                  updated[editingIndex] = { ...s, meta_description: e.target.value } as any;
                  setItems(updated);
                }}
                rows={2}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="SEO Keywords (Comma Separated)"
                value={(s as any).meta_keywords ?? ""}
                placeholder="e.g. wedding photography, luxury bridal shoot, 4k cinema films"
                onChange={(v) => {
                  const updated = [...items];
                  updated[editingIndex] = { ...s, meta_keywords: v } as any;
                  setItems(updated);
                }}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            onClick={() => {
              saveAll(items);
              setEditingIndex(null);
            }}
            disabled={saving}
            className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors"
          >
            {saving ? "Saving…" : "Save Service & SEO"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">{items.length} total services</div>
        <button
          onClick={addItem}
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors"
        >
          <Plus className="size-4" /> Add New Service
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, idx) => (
          <div key={idx} className="border border-border bg-card p-5 rounded-sm flex flex-col justify-between group">
            <div>
              <div className="aspect-[16/10] bg-black overflow-hidden mb-4 relative">
                <img src={s.hero} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-black/80 text-[10px] uppercase tracking-widest text-[color:var(--gold)] px-2 py-1">
                  {s.category}
                </span>
              </div>
              <h3 className="font-display text-xl">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.short}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setEditingIndex(idx)}
                className="text-xs uppercase tracking-widest text-[color:var(--gold)] font-medium hover:underline"
              >
                Edit Details & SEO →
              </button>
              <button
                onClick={() => removeItem(idx)}
                className="text-destructive hover:text-red-400 p-1"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Locations Panel ─────────── */

function LocationsPanel() {
  const { customLocations, refresh } = useSiteContent();
  const updateLoc = useServerFn(updateCustomLocations);
  const upload = useMediaUpload();

  const [items, setItems] = useState<Location[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setItems((customLocations && customLocations.length > 0 ? customLocations : defaultLocations) as Location[]);
  }, [customLocations]);

  const saveAll = async (newItems: Location[]) => {
    setSaving(true);
    try {
      const res = await updateLoc({ data: { locations: newItems } });
      if (res.ok) {
        await refresh();
      } else {
        alert("Failed to save locations.");
      }
    } catch (e) {
      alert("Error saving locations.");
    }
    setSaving(false);
  };

  const addItem = () => {
    const newLoc: Location = {
      slug: `new-location-${Date.now()}`,
      name: "New Destination",
      region: "Destination Region",
      title: "Luxury Wedding Photography in New Destination",
      tagline: "Capturing love stories across breathtaking landscapes.",
      intro: "Detailed overview of photography services in this region.",
      heroImage: defaultLocations[0].heroImage,
      highlights: ["Experienced local crew", "4K Drone Filming", "High-Fashion Aesthetics"],
      popularVenues: [{ name: "The Grand Resort", type: "Luxury Estate", desc: "Panoramic view of hills and gardens." }],
      servicesOffered: ["Full Wedding Coverage", "Pre-Wedding Portraits", "Cinematic Highlights"],
      faqs: [{ q: "Do you charge travel fees?", a: "All travel and crew logistics are included in our custom destination quote." }],
      gallery: [defaultLocations[0].heroImage],
    };
    const updated = [newLoc, ...items];
    setItems(updated);
    setEditingIndex(0);
  };

  const removeItem = async (index: number) => {
    if (!confirm("Delete this location area?")) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    if (editingIndex === index) setEditingIndex(null);
    await saveAll(updated);
  };

  const uploadHero = async (file: File, index: number) => {
    setUploading(true);
    try {
      const url = await upload(file);
      const updated = [...items];
      updated[index] = { ...updated[index], heroImage: url };
      setItems(updated);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Hero upload failed");
    }
    setUploading(false);
  };

  if (editingIndex !== null && items[editingIndex]) {
    const l = items[editingIndex];
    return (
      <div className="space-y-8">
        <button
          onClick={() => setEditingIndex(null)}
          className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[color:var(--gold)] font-medium"
        >
          ← Back to Locations List
        </button>

        <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
          <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3">Location Details</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Location Name (e.g. Jaipur)" value={l.name} onChange={(v) => {
              const updated = [...items];
              updated[editingIndex] = { ...l, name: v, slug: slugify(v) };
              setItems(updated);
            }} />
            <Input label="Region Tag (e.g. Rajasthan · Pink City)" value={l.region} onChange={(v) => {
              const updated = [...items];
              updated[editingIndex] = { ...l, region: v };
              setItems(updated);
            }} />
            <div className="md:col-span-2">
              <Input label="Page Title (h1)" value={l.title} onChange={(v) => {
                const updated = [...items];
                updated[editingIndex] = { ...l, title: v };
                setItems(updated);
              }} />
            </div>
            <div className="md:col-span-2">
              <Input label="Tagline" value={l.tagline} onChange={(v) => {
                const updated = [...items];
                updated[editingIndex] = { ...l, tagline: v };
                setItems(updated);
              }} />
            </div>

            <div className="md:col-span-2">
              <label className="kbd-eyebrow text-muted-foreground">Intro Narrative</label>
              <textarea
                value={l.intro}
                onChange={(e) => {
                  const updated = [...items];
                  updated[editingIndex] = { ...l, intro: e.target.value };
                  setItems(updated);
                }}
                rows={4}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="kbd-eyebrow text-muted-foreground">Hero Image Banner</label>
              <div className="mt-3 flex items-center gap-4">
                {l.heroImage && <img src={l.heroImage} alt="" className="w-32 h-32 object-cover bg-black" />}
                <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
                  <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload Hero Banner"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadHero(e.target.files[0], editingIndex)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
          <h3 className="font-display text-2xl text-[color:var(--gold)] border-b border-border pb-3 flex items-center gap-2">
            <Search className="size-5" /> Location SEO Settings
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="SEO Meta Title"
                value={(l as any).meta_title ?? `${l.title} — Kamal Studios`}
                onChange={(v) => {
                  const updated = [...items];
                  updated[editingIndex] = { ...l, meta_title: v } as any;
                  setItems(updated);
                }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="kbd-eyebrow text-muted-foreground">SEO Meta Description</label>
              <textarea
                value={(l as any).meta_description ?? l.tagline}
                onChange={(e) => {
                  const updated = [...items];
                  updated[editingIndex] = { ...l, meta_description: e.target.value } as any;
                  setItems(updated);
                }}
                rows={2}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="SEO Keywords (Comma Separated)"
                value={(l as any).meta_keywords ?? ""}
                placeholder={`e.g. ${l.name} wedding photographer, luxury resort photography in ${l.name}`}
                onChange={(v) => {
                  const updated = [...items];
                  updated[editingIndex] = { ...l, meta_keywords: v } as any;
                  setItems(updated);
                }}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            onClick={() => {
              saveAll(items);
              setEditingIndex(null);
            }}
            disabled={saving}
            className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors"
          >
            {saving ? "Saving…" : "Save Location & SEO"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">{items.length} total service areas</div>
        <button
          onClick={addItem}
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors"
        >
          <Plus className="size-4" /> Add Service Area
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l, idx) => (
          <div key={idx} className="border border-border bg-card p-5 rounded-sm flex flex-col justify-between group">
            <div>
              <div className="aspect-[16/10] bg-black overflow-hidden mb-4 relative">
                <img src={l.heroImage} alt={l.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-black/80 text-[10px] uppercase tracking-widest text-[color:var(--gold)] px-2 py-1 flex items-center gap-1">
                  <MapPin className="size-3" /> {l.region}
                </span>
              </div>
              <h3 className="font-display text-xl">{l.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{l.tagline}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setEditingIndex(idx)}
                className="text-xs uppercase tracking-widest text-[color:var(--gold)] font-medium hover:underline"
              >
                Edit Location & SEO →
              </button>
              <button
                onClick={() => removeItem(idx)}
                className="text-destructive hover:text-red-400 p-1"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Reviews Panel ─────────── */

type ReviewItem = {
  n: string;
  d: string;
  q: string;
  rating?: number;
};

const defaultReviewsList: ReviewItem[] = [
  { n: "Rohan Mehta", d: "3 weeks ago", q: "From consultation to delivery, everything was flawless. The final film brought us to tears.", rating: 5 },
  { n: "Nisha Rao", d: "2 months ago", q: "Our maternity shoot was intimate and beautifully lit. The team made me feel comfortable throughout.", rating: 5 },
  { n: "Ananya Kapoor", d: "1 month ago", q: "They photographed both my wedding and my daughter's first birthday. A studio you trust for a lifetime.", rating: 5 },
  { n: "Vikram Enterprises", d: "5 weeks ago", q: "Our go-to for every campaign. Consistent, calm, and consistently premium.", rating: 5 },
  { n: "Simran & Arjun", d: "1 week ago", q: "The album is a masterpiece. Every page feels like a page from a coffee-table book.", rating: 5 },
  { n: "Devika Nair", d: "6 months ago", q: "The team travelled to Bali for our destination wedding and delivered beyond expectations.", rating: 5 },
];

function ReviewsPanel() {
  const { customReviews, refresh } = useSiteContent();
  const updateRev = useServerFn(updateCustomReviews);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setReviews((customReviews && customReviews.length > 0 ? customReviews : defaultReviewsList) as ReviewItem[]);
  }, [customReviews]);

  const saveAll = async (newReviews: ReviewItem[]) => {
    setSaving(true);
    try {
      const res = await updateRev({ data: { reviews: newReviews } });
      if (res.ok) {
        await refresh();
      } else {
        alert("Failed to save reviews.");
      }
    } catch (e) {
      alert("Error saving reviews.");
    }
    setSaving(false);
  };

  const addReview = () => {
    const newItem: ReviewItem = {
      n: "New Client",
      d: "Just now",
      q: "Exceptional quality and incredible service.",
      rating: 5,
    };
    const updated = [newItem, ...reviews];
    setReviews(updated);
  };

  const updateItem = (index: number, updatedItem: ReviewItem) => {
    const updated = [...reviews];
    updated[index] = updatedItem;
    setReviews(updated);
  };

  const removeItem = async (index: number) => {
    if (!confirm("Delete this review?")) return;
    const updated = reviews.filter((_, i) => i !== index);
    setReviews(updated);
    await saveAll(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">{reviews.length} client reviews</div>
        <div className="flex gap-3">
          <button
            onClick={addReview}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:border-[color:var(--gold)]"
          >
            <Plus className="size-4" /> Add Review
          </button>
          <button
            onClick={() => saveAll(reviews)}
            disabled={saving}
            className="bg-foreground text-background px-6 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors"
          >
            {saving ? "Saving…" : "Save All Reviews"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r, idx) => (
          <div key={idx} className="border border-border p-6 bg-card rounded-sm space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Client / Couple Name" value={r.n} onChange={(v) => updateItem(idx, { ...r, n: v })} />
              <Input label="Date String (e.g. 2 weeks ago)" value={r.d} onChange={(v) => updateItem(idx, { ...r, d: v })} />
              <div className="flex flex-col gap-2">
                <label className="kbd-eyebrow text-muted-foreground">Star Rating</label>
                <select
                  value={r.rating ?? 5}
                  onChange={(e) => updateItem(idx, { ...r, rating: Number(e.target.value) })}
                  className="bg-transparent border-b border-border py-3 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((st) => (
                    <option key={st} value={st}>{st} Stars</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="kbd-eyebrow text-muted-foreground">Testimonial Quote</label>
              <textarea
                value={r.q}
                onChange={(e) => updateItem(idx, { ...r, q: e.target.value })}
                rows={2}
                className="mt-2 w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-[color:var(--gold)]"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => removeItem(idx)}
                className="text-xs text-destructive hover:underline flex items-center gap-1"
              >
                <Trash2 className="size-3.5" /> Remove Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Settings ─────────── */

function SettingsPanel() {
  const change = useServerFn(adminChangePassword);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next !== confirmPw) return setMsg({ ok: false, text: "New passwords do not match." });
    setBusy(true);
    const r = await change({ data: { current, next } });
    setBusy(false);
    if (r.ok) {
      setMsg({ ok: true, text: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirmPw("");
    } else {
      setMsg({ ok: false, text: r.error ?? "Failed to update." });
    }
  };

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-2 kbd-eyebrow text-[color:var(--gold)]">
        <SettingsIcon className="size-4" /> Change password
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        The studio password unlocks this dashboard. Keep it private.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="Current password"
          className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
        />
        <input
          type="password"
          required
          minLength={6}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="New password (min 6 chars)"
          className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
        />
        <input
          type="password"
          required
          minLength={6}
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          placeholder="Confirm new password"
          className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
        />
        {msg && (
          <div className={`text-xs ${msg.ok ? "text-[color:var(--gold)]" : "text-destructive"}`}>{msg.text}</div>
        )}
        <button
          type="submit"
          disabled={busy}
          className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
        >
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

/* ─────────── Content Panel (Site Identity) ─────────── */

function ContentPanel() {
  const { settings, refresh } = useSiteContent();
  const updateSettings = useServerFn(updateAdminSiteSettings);
  const upload = useMediaUpload();

  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await upload(file);
      setFormData(prev => ({ ...prev, logoUrl: url }));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Logo upload failed");
    }
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await updateSettings({ data: { settings: formData } });
      if (res.ok) {
        await refresh();
        setMessage({ ok: true, text: "Content settings updated successfully!" });
      } else {
        setMessage({ ok: false, text: res.error || "Failed to update content." });
      }
    } catch (err) {
      setMessage({ ok: false, text: "An error occurred while saving." });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-12 max-w-4xl">
      {/* Identity */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Identity & Logo</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Brand Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
          <Input label="Tagline" value={formData.tagline} onChange={v => setFormData({ ...formData, tagline: v })} />
          <Input label="Since (Year)" type="number" value={String(formData.since)} onChange={v => setFormData({ ...formData, since: Number(v) || 1966 })} />
          <Input label="Operating Hours" value={formData.hours} onChange={v => setFormData({ ...formData, hours: v })} />
        </div>
        <div className="space-y-2">
          <label className="kbd-eyebrow text-muted-foreground">Logo Image</label>
          <div className="flex items-center gap-6 mt-2">
            {formData.logoUrl && (
              <img src={formData.logoUrl} alt="Logo Preview" className="h-16 w-auto object-contain bg-black p-2 border border-border" />
            )}
            <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload Logo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Hero Page Copy */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Home Hero Copy</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Title (Part 1)" value={formData.hero.title_part1} onChange={v => setFormData({ ...formData, hero: { ...formData.hero, title_part1: v } })} />
          <Input label="Title (Part 2 - Golden/Italic)" value={formData.hero.title_part2} onChange={v => setFormData({ ...formData, hero: { ...formData.hero, title_part2: v } })} />
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="kbd-eyebrow text-muted-foreground">Hero Subtitle</label>
            <textarea
              value={formData.hero.subtitle}
              onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
              rows={3}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
            />
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Contact Details</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Phone Display" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
          <Input label="Phone (Raw digits, e.g. +919876543210)" value={formData.phoneRaw} onChange={v => setFormData({ ...formData, phoneRaw: v })} />
          <Input label="WhatsApp link or Raw Phone" value={formData.whatsapp} onChange={v => setFormData({ ...formData, whatsapp: v })} />
          <Input label="Email Address" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
          <div className="md:col-span-2">
            <Input label="Physical Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Social Media Links</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Instagram URL" value={formData.social.instagram} onChange={v => setFormData({ ...formData, social: { ...formData.social, instagram: v } })} />
          <Input label="YouTube Channel URL" value={formData.social.youtube} onChange={v => setFormData({ ...formData, social: { ...formData.social, youtube: v } })} />
          <Input label="Facebook Page URL" value={formData.social.facebook} onChange={v => setFormData({ ...formData, social: { ...formData.social, facebook: v } })} />
          <Input label="Google Maps Review URL" value={formData.social.google} onChange={v => setFormData({ ...formData, social: { ...formData.social, google: v } })} />
        </div>
      </div>

      {/* Statistics */}
      <div className="border border-border p-8 bg-card space-y-6 rounded-sm">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Studio Statistics</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Input label="Projects (e.g. 4,800+)" value={formData.stats.projects} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, projects: v } })} />
          <Input label="Clients (e.g. 3,200+)" value={formData.stats.clients} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, clients: v } })} />
          <Input label="Cities (e.g. 60+)" value={formData.stats.cities} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, cities: v } })} />
          <Input label="Google Rating (e.g. 4.9)" type="number" step="0.1" value={String(formData.stats.rating)} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, rating: Number(v) || 4.9 } })} />
          <Input label="Google Reviews Count" type="number" value={String(formData.stats.reviews)} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, reviews: Number(v) || 820 } })} />
        </div>
      </div>

      {message && (
        <div className={`p-4 border ${message.ok ? "border-[color:var(--gold)] text-[color:var(--gold)] bg-card" : "border-destructive text-destructive bg-card"} text-sm`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.24em] hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50 font-medium"
        >
          {saving ? "Saving Changes…" : "Save Website Content"}
        </button>
      </div>
    </form>
  );
}

/* ─────────── Shared Helpers ─────────── */

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="kbd-eyebrow text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
      />
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="border border-border p-16 text-center text-sm text-muted-foreground bg-secondary/40 rounded-sm">
      {label}
    </div>
  );
}

function NavigationPanel() {
  const { navItems, refresh } = useSiteContent();
  const updateNav = useServerFn(updateCustomNavigation);

  const [items, setItems] = useState<NavItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(JSON.parse(JSON.stringify(navItems)));
  }, [navItems]);

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleChangeLabel = (id: string, label: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label } : item))
    );
  };

  const handleChangeTo = (id: string, to: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, to } : item))
    );
  };

  const handleChangeCategory = (id: string, dropdownCategory: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dropdownCategory } : item))
    );
  };

  const handleMove = (index: number, dir: -1 | 1) => {
    const nextIdx = index + dir;
    if (nextIdx < 0 || nextIdx >= items.length) return;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[nextIdx];
    copy[nextIdx] = temp;
    setItems(copy);
  };

  const handleAddItem = () => {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: "New Page",
      to: "/new-page",
      type: "link",
      enabled: true,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (!confirm("Remove this menu item?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetDefaults = async () => {
    if (!confirm("Reset navigation menu to default items?")) return;
    setSaving(true);
    try {
      const r = await updateNav({ data: { navigation: defaultNavigationItems } });
      if (!r.ok) {
        alert("Failed to reset navigation menu: " + ("error" in r ? r.error : "Unknown error"));
        return;
      }
      await refresh();
      alert("Navigation menu reset to defaults!");
    } catch (err: any) {
      alert("Error resetting navigation menu: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await updateNav({ data: { navigation: items } });
      if (!r.ok) {
        alert("Failed to save navigation menu: " + ("error" in r ? r.error : "Unknown error"));
        return;
      }
      await refresh();
      alert("Navigation menu saved successfully!");
    } catch (err: any) {
      alert("Error saving navigation menu: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border p-6 rounded-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl">Header Navigation & Dropdown Menu</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Customize all pages, labels, order, and dropdown categories shown in the site header menu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            disabled={saving}
            className="border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-destructive hover:text-destructive transition-colors"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleAddItem}
            className="border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] transition-colors"
          >
            + Add Menu Link
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[color:var(--gold)] text-black px-6 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Navigation"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex flex-wrap items-center gap-4 p-4 border rounded-sm transition-colors ${
              item.enabled ? "bg-background border-border" : "bg-muted/30 border-border/50 opacity-60"
            }`}
          >
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleMove(index, -1)}
                disabled={index === 0}
                className="p-1 border border-border rounded-sm hover:border-[color:var(--gold)] disabled:opacity-30 text-xs"
                title="Move Up"
              >
                ▲
              </button>
              <button
                onClick={() => handleMove(index, 1)}
                disabled={index === items.length - 1}
                className="p-1 border border-border rounded-sm hover:border-[color:var(--gold)] disabled:opacity-30 text-xs"
                title="Move Down"
              >
                ▼
              </button>
            </div>

            <div className="w-40">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                Label
              </label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleChangeLabel(item.id, e.target.value)}
                className="w-full bg-transparent border-b border-border py-1 text-sm focus:outline-none focus:border-[color:var(--gold)]"
              />
            </div>

            <div className="w-36">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                Type
              </label>
              <select
                value={item.type}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((i) =>
                      i.id === item.id
                        ? { ...i, type: e.target.value as "link" | "dropdown" }
                        : i
                    )
                  )
                }
                className="w-full bg-transparent border-b border-border py-1 text-sm focus:outline-none focus:border-[color:var(--gold)]"
              >
                <option value="link">Direct Link</option>
                <option value="dropdown">Dropdown Menu</option>
              </select>
            </div>

            {item.type === "link" ? (
              <div className="flex-1 min-w-[160px]">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Target Path / URL
                </label>
                <input
                  type="text"
                  value={item.to}
                  onChange={(e) => handleChangeTo(item.id, e.target.value)}
                  className="w-full bg-transparent border-b border-border py-1 text-sm focus:outline-none focus:border-[color:var(--gold)]"
                />
              </div>
            ) : (
              <div className="flex-1 min-w-[160px]">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Dropdown Category
                </label>
                <select
                  value={item.dropdownCategory || item.label}
                  onChange={(e) => handleChangeCategory(item.id, e.target.value)}
                  className="w-full bg-transparent border-b border-border py-1 text-sm focus:outline-none focus:border-[color:var(--gold)]"
                >
                  {["Photography", "Videography", "Events", "Commercial", "Wedding", "Pre-Wedding", "Baby", "Maternity", "Fashion", "Corporate"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-3 ml-auto">
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggle(item.id)}
                  className="rounded border-border accent-[color:var(--gold)]"
                />
                <span>{item.enabled ? "Visible" : "Hidden"}</span>
              </label>

              <button
                onClick={() => handleRemoveItem(item.id)}
                className="p-1.5 text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
                title="Remove item"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilmsPanel() {
  const { filmsList, refresh } = useSiteContent();
  const updateFilms = useServerFn(updateCustomFilms);
  const upload = useMediaUpload();

  const [items, setItems] = useState<FilmItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(JSON.parse(JSON.stringify(filmsList)));
  }, [filmsList]);

  const handleChange = (id: string, field: keyof FilmItem, val: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleUploadCover = async (file: File, index: number) => {
    setUploadingIndex(index);
    try {
      const url = await upload(file);
      setItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, cover: url } : item))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    }
    setUploadingIndex(null);
  };

  const handleMove = (index: number, dir: -1 | 1) => {
    const nextIdx = index + dir;
    if (nextIdx < 0 || nextIdx >= items.length) return;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[nextIdx];
    copy[nextIdx] = temp;
    setItems(copy);
  };

  const handleAddFilm = () => {
    const newFilm: FilmItem = {
      id: `film-${Date.now()}`,
      title: "New Film Title",
      cover: items[0]?.cover || "",
      video_url: "",
      category: "Wedding",
    };
    setItems((prev) => [newFilm, ...prev]);
  };

  const handleRemoveFilm = (id: string) => {
    if (!confirm("Delete this film item?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetDefaults = async () => {
    if (!confirm("Reset films list to default items?")) return;
    setSaving(true);
    try {
      const r = await updateFilms({ data: { films: defaultFilmsList } });
      if (!r.ok) {
        alert("Failed to reset films: " + ("error" in r ? r.error : "Unknown error"));
        return;
      }
      await refresh();
      alert("Films list reset to defaults!");
    } catch (err: any) {
      alert("Error resetting films: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await updateFilms({ data: { films: items } });
      if (!r.ok) {
        alert("Failed to save films: " + ("error" in r ? r.error : "Unknown error"));
        return;
      }
      await refresh();
      alert("Films saved successfully!");
    } catch (err: any) {
      alert("Error saving films: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border p-6 rounded-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl">Films Page Management</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage all cinematic films, video URLs, categories, and cover images displayed on the Films page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            disabled={saving}
            className="border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-destructive hover:text-destructive transition-colors"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleAddFilm}
            className="border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] transition-colors"
          >
            + Add New Film
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[color:var(--gold)] text-black px-6 py-2 text-xs uppercase tracking-[0.22em] font-medium hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Films"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={item.id} className="border border-border bg-background p-4 rounded-sm flex flex-col justify-between">
            <div>
              <div className="relative aspect-video bg-black rounded-sm overflow-hidden mb-4 border border-border">
                {item.cover && <img src={item.cover} alt="" className="w-full h-full object-cover" />}
                <label className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1.5 text-[10px] uppercase tracking-wider rounded cursor-pointer hover:bg-[color:var(--gold)] hover:text-black transition-colors">
                  {uploadingIndex === index ? "Uploading…" : "Change Cover"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUploadCover(e.target.files[0], index);
                    }}
                  />
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Film Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleChange(item.id, "title", e.target.value)}
                    className="w-full bg-transparent border-b border-border py-1.5 text-sm focus:outline-none focus:border-[color:var(--gold)] font-display text-lg"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Video Link (YouTube / Vimeo / Direct URL)</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={item.video_url || ""}
                    onChange={(e) => handleChange(item.id, "video_url", e.target.value)}
                    className="w-full bg-transparent border-b border-border py-1.5 text-xs focus:outline-none focus:border-[color:var(--gold)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding, Commercial"
                      value={item.category || ""}
                      onChange={(e) => handleChange(item.id, "category", e.target.value)}
                      className="w-full bg-transparent border-b border-border py-1.5 text-xs focus:outline-none focus:border-[color:var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      value={item.cover}
                      onChange={(e) => handleChange(item.id, "cover", e.target.value)}
                      className="w-full bg-transparent border-b border-border py-1.5 text-xs focus:outline-none focus:border-[color:var(--gold)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-3 border-t border-border">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  className="px-2 py-1 border border-border text-xs rounded hover:border-[color:var(--gold)] disabled:opacity-30"
                  title="Move Up"
                >
                  ▲ Up
                </button>
                <button
                  onClick={() => handleMove(index, 1)}
                  disabled={index === items.length - 1}
                  className="px-2 py-1 border border-border text-xs rounded hover:border-[color:var(--gold)] disabled:opacity-30"
                  title="Move Down"
                >
                  ▼ Down
                </button>
              </div>

              <button
                onClick={() => handleRemoveFilm(item.id)}
                className="text-xs text-destructive hover:underline"
              >
                Delete Film
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
