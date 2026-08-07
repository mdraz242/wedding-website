import { createFileRoute, Link } from "@tanstack/react-router";
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

type Album = {
  id: string;
  slug: string;
  title: string;
  category: string;
  cover_url: string | null;
  description: string | null;
};

function Portfolio() {
  const { getPageSEO } = useSiteContent();
  const page = getPageSEO("portfolio");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    supabase
      .from("portfolio_albums")
      .select("id,slug,title,category,cover_url,description")
      .eq("published", true)
      .order("sort_order")
      .then(({ data }) => setAlbums((data as Album[]) ?? []));
  }, []);

  const shots = useMemo(() => {
    const cats: CategoryKey[] =
      cat === "All"
        ? (["Wedding", "Pre-Wedding", "Baby", "Maternity", "Fashion", "Commercial", "Corporate", "Events", "Products", "Real Estate"] as CategoryKey[])
        : [cat as CategoryKey];
    const out: { src: string; title: string }[] = [];
    const seen = new Set<string>();
    for (const c of cats) {
      for (const src of categoryImages[c]) {
        if (seen.has(src)) continue;
        seen.add(src);
        out.push({ src, title: c });
      }
    }
    return out;
  }, [cat]);

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

      {albums.length > 0 && (
        <section className="container-lux pb-16">
          <div className="kbd-eyebrow text-[color:var(--gold)] mb-6">Featured albums</div>
          <div className="grid gap-6 md:grid-cols-3">
            {albums.map((a) => (
              <Link
                key={a.id}
                to="/portfolio"
                className="group block border border-border bg-card hover:border-[color:var(--gold)] transition-colors rounded-sm overflow-hidden"
              >
                <div className="aspect-[4/5] overflow-hidden bg-black">
                  {a.cover_url && (
                    <img
                      src={a.cover_url}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs text-muted-foreground uppercase tracking-[0.22em]">{a.category}</div>
                  <div className="mt-2 font-display text-2xl group-hover:text-[color:var(--gold)] transition-colors">
                    {a.title}
                  </div>
                  {a.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
      <SiteFooter />
    </div>
  );
}
