import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { locations as defaultLocations } from "@/data/locations";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/locations/")({
  head: () => ({
    meta: [
      { title: "Service Areas & Destinations — Kamal Studios" },
      { name: "description", content: "Headquartered in Chandigarh, capturing luxury weddings & films across India and worldwide destinations." },
    ],
  }),
  component: LocationsIndex,
});

function LocationsIndex() {
  const { customLocations } = useSiteContent();
  const list = customLocations && customLocations.length > 0 ? customLocations : defaultLocations;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Header */}
      <section className="pt-40 pb-20 border-b border-border">
        <div className="container-lux">
          <div className="kbd-eyebrow text-[color:var(--gold)]">Service areas</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">A studio without borders.</h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
            Headquartered in Chandigarh, capturing landmark weddings and luxury events across India and internationally. Destination-ready with a self-contained production crew.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-20">
        <div className="container-lux">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((loc) => (
              <Link
                key={loc.slug}
                to="/locations/$slug"
                params={{ slug: loc.slug }}
                className="group block border border-border bg-card hover:border-[color:var(--gold)]/60 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-black">
                  <img
                    src={loc.heroImage}
                    alt={loc.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="kbd-eyebrow text-[color:var(--gold)] flex items-center gap-1.5 text-[11px]">
                      <MapPin className="size-3" /> {loc.region}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl group-hover:text-[color:var(--gold)] transition-colors">
                        {loc.name}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {loc.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>{loc.popularVenues?.length || 0} Featured Venues</span>
                    <span className="text-[color:var(--gold)] font-medium group-hover:underline">Explore Page</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
