import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { categoryImages, type CategoryKey } from "@/lib/site";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Kamal Studios" },
      { name: "description", content: "Selected photography and cinematography work from Kamal Studios." },
    ],
  }),
  component: Portfolio,
});

const CATS: readonly ("All" | CategoryKey)[] = [
  "All",
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
] as const;

type AlbumImage = {
  id: string;
  url: string;
  sort_order: number;
};

type Album = {
  id: string;
  slug: string;
  title: string;
  category: string;
  cover_url: string | null;
  description: string | null;
  portfolio_images?: AlbumImage[];
};

function Portfolio() {
  const { getPageSEO, categoryImages } = useSiteContent();
  const page = getPageSEO("portfolio");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);

  useEffect(() => {
    supabase
      .from("portfolio_albums")
      .select(`
        id,
        slug,
        title,
        category,
        cover_url,
        description,
        portfolio_images (
          id,
          url,
          sort_order
        )
      `)
      .eq("published", true)
      .order("sort_order")
      .then(({ data }) => setAlbums((data as unknown as Album[]) ?? []));
  }, []);

  const shots = useMemo(() => {
    const cats: CategoryKey[] =
      cat === "All"
        ? (["Wedding", "Pre-Wedding", "Baby", "Maternity", "Fashion", "Commercial", "Corporate", "Events", "Products", "Real Estate"] as CategoryKey[])
        : [cat as CategoryKey];
    const out: { src: string; title: string }[] = [];
    const seen = new Set<string>();
    for (const c of cats) {
      // Find all images uploaded to albums of this category
      const dbImages = albums
        .filter((a) => {
          // Normalize check to match both "Wedding" and "Weddings" etc.
          const norm = (s: string) => s.toLowerCase().trim().replace(/s$/, "");
          return norm(a.category) === norm(c) && a.portfolio_images;
        })
        .flatMap((a) => a.portfolio_images ?? [])
        .sort((x, y) => x.sort_order - y.sort_order);

      // Display database images first
      for (const img of dbImages) {
        if (seen.has(img.url)) continue;
        seen.add(img.url);
        out.push({ src: img.url, title: c });
      }

      // Append category images managed from admin / site content
      const catImgs = categoryImages[c] || [];
      for (const src of catImgs) {
        if (seen.has(src)) continue;
        seen.add(src);
        out.push({ src, title: c });
      }
    }
    return out;
  }, [cat, albums, categoryImages]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="pt-40 pb-16">
        <div className="container-lux">
          <div className="kbd-eyebrow text-[color:var(--gold)]">Portfolio</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">{page.heading || "A quiet portfolio."}</h1>
          <p className="mt-4 text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed">
            {page.subheading || "Curated moments of love, splendour, and emotional intimacy."}
          </p>
        </div>
      </section>



      <div className="container-lux flex flex-wrap gap-2 pb-10">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.22em] border transition-colors ${
              cat === c ? "bg-foreground text-background border-foreground font-semibold" : "border-border hover:border-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="container-lux pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {shots.map((s, i) => (
            <figure key={s.src + i} className="group relative overflow-hidden bg-black aspect-[4/5] rounded-sm">
              <img
                src={s.src}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-[10px] uppercase tracking-[0.28em] text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-black/70 to-transparent">
                {s.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {activeAlbum && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6">
          <div className="flex items-center justify-between w-full text-white">
            <div>
              <span className="kbd-eyebrow text-[color:var(--gold)] text-xs uppercase tracking-[0.22em]">{activeAlbum.category}</span>
              <h3 className="font-display text-xl sm:text-2xl mt-1">{activeAlbum.title}</h3>
            </div>
            <button
              onClick={() => setActiveAlbum(null)}
              className="p-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-full"
              aria-label="Close lightbox"
            >
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative my-4 overflow-hidden">
            {activeAlbum.portfolio_images && activeAlbum.portfolio_images.length > 0 ? (
              <AlbumLightboxGallery images={activeAlbum.portfolio_images} />
            ) : (
              <div className="text-white/60 text-sm">No images in this album.</div>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

function AlbumLightboxGallery({ images }: { images: AlbumImage[] }) {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setIdx((i) => (i < images.length - 1 ? i + 1 : 0));

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [images]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative flex-1 w-full max-h-[70vh] flex items-center justify-between gap-4">
        {images.length > 1 && (
          <button
            onClick={prev}
            className="p-3 bg-black/40 hover:bg-black/80 hover:text-[color:var(--gold)] text-white/70 hover:scale-105 transition-all rounded-full flex items-center justify-center shrink-0 border border-white/10"
            aria-label="Previous image"
          >
            ←
          </button>
        )}

        <div className="relative flex-1 h-full max-w-4xl flex items-center justify-center">
          <img
            src={images[idx].url}
            alt=""
            className="max-h-full max-w-full object-contain rounded-sm shadow-2xl transition-all duration-300"
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={next}
            className="p-3 bg-black/40 hover:bg-black/80 hover:text-[color:var(--gold)] text-white/70 hover:scale-105 transition-all rounded-full flex items-center justify-center shrink-0 border border-white/10"
            aria-label="Next image"
          >
            →
          </button>
        )}
      </div>

      <div className="text-white/60 text-xs mt-4 tracking-[0.2em] uppercase">
        {idx + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-4 max-w-full overflow-x-auto py-2 px-4 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIdx(i)}
              className={`w-12 h-12 shrink-0 border rounded-sm overflow-hidden bg-black transition-all ${
                i === idx ? "border-[color:var(--gold)] scale-105" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
