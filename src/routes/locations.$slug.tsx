import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, MessageCircle, Send, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { locationBySlug, locations, type Location } from "@/data/locations";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/locations/$slug")({
  loader: ({ params }) => {
    const loc = locationBySlug(params.slug);
    if (!loc) throw notFound();
    return loc;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Kamal Studios` },
          { name: "description", content: `${loaderData.tagline} ${loaderData.intro.slice(0, 140)}` },
          { property: "og:title", content: `${loaderData.title} — Kamal Studios` },
          { property: "og:description", content: loaderData.tagline },
          { property: "og:image", content: loaderData.heroImage },
        ]
      : [],
  }),
  component: LocationPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="kbd-eyebrow text-[color:var(--gold)] mb-2">404</div>
        <h1 className="font-display text-4xl mb-4">Location not found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find the service area page you were looking for.</p>
        <Link to="/locations" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors">
          View all service areas
        </Link>
      </div>
    </div>
  ),
});

function LocationPage() {
  const initialLoc = Route.useLoaderData() as Location;
  const { settings, customLocations } = useSiteContent();
  const loc = (customLocations?.find((l) => l.slug.toLowerCase() === initialLoc.slug.toLowerCase()) || initialLoc) as Location;
  const allLocs = customLocations && customLocations.length > 0 ? customLocations : locations;
  const whatsappUrl = settings.whatsapp.startsWith("http")
    ? settings.whatsapp
    : `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`;

  const otherLocations = allLocs.filter((l) => l.slug !== loc.slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative min-h-[80svh] min-h-[620px] overflow-hidden flex flex-col justify-end">
        <img src={loc.heroImage} alt={loc.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95" />
        <div className="relative container-lux w-full h-full flex flex-col justify-end pb-16 pt-36 md:pt-44 text-white z-10">
          <nav className="text-xs uppercase tracking-[0.22em] text-white/60 flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>·</span>
            <Link to="/locations" className="hover:text-white">Service Areas</Link>
            <span>·</span>
            <span className="text-[color:var(--gold)]">{loc.name}</span>
          </nav>
          <div className="kbd-eyebrow text-[color:var(--gold)] mt-6 flex items-center gap-2">
            <MapPin className="size-4" /> {loc.region}
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.08] max-w-4xl">
            {loc.title}
          </h1>
          <p className="mt-4 text-white/85 max-w-2xl text-base md:text-lg leading-relaxed font-light">
            {loc.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[color:var(--gold)] text-black px-7 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-white transition-colors"
            >
              Enquire for {loc.name}
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 bg-black/30 backdrop-blur text-white px-6 py-4 text-xs uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-colors"
            >
              <MessageCircle className="size-4 text-emerald-400" /> WhatsApp Concierge
            </a>
          </div>
        </div>
      </section>

      {/* Intro & Highlights */}
      <section className="py-20 md:py-28">
        <div className="container-lux grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-6">
            <div className="kbd-eyebrow text-[color:var(--gold)]">About the Location</div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl leading-tight">
              Artistic Wedding Storytelling in {loc.name}.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-base md:text-lg">
              {loc.intro}
            </p>
          </div>

          <div className="md:col-span-6 bg-card border border-border p-8 md:p-10 rounded-sm">
            <h3 className="font-display text-xl mb-6 flex items-center gap-2">
              <Sparkles className="size-5 text-[color:var(--gold)]" /> Why Couples Choose Us in {loc.name}
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {loc.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 size-4 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] flex items-center justify-center shrink-0">
                    <Check className="size-3" />
                  </div>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      {loc.popularVenues && loc.popularVenues.length > 0 && (
        <section className="py-20 bg-muted/30 border-y border-border">
          <div className="container-lux">
            <div className="max-w-2xl">
              <div className="kbd-eyebrow text-[color:var(--gold)]">Venues & Estates</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Featured Venues in {loc.name}</h2>
              <p className="mt-3 text-muted-foreground text-sm">
                We have extensive hands-on experience capturing celebrations at these premier properties across {loc.name}.
              </p>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loc.popularVenues.map((v, i) => (
                <div key={i} className="bg-background border border-border p-6 rounded-sm flex flex-col justify-between hover:border-[color:var(--gold)]/50 transition-colors">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[color:var(--gold)] font-medium block mb-2">
                      {v.type}
                    </span>
                    <h3 className="font-display text-lg mb-2">{v.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 text-[11px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3 text-[color:var(--gold)]" /> Preferred Crew Coverage
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Offered in this location */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <div className="kbd-eyebrow text-[color:var(--gold)]">Custom Packages</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Services Tailored for {loc.name}</h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                Every celebration is unique. We customize team sizing, camera rigs, and lighting packages based on your specific venue and itinerary in {loc.name}.
              </p>
              <div className="mt-8">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors"
                >
                  Request Custom Quote
                </Link>
              </div>
            </div>

            <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
              {loc.servicesOffered.map((s, i) => (
                <div key={i} className="border border-border p-5 rounded-sm flex items-center gap-3 bg-card">
                  <div className="size-8 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] flex items-center justify-center font-display text-sm font-semibold shrink-0">
                    0{i + 1}
                  </div>
                  <span className="font-medium text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase / Gallery */}
      {loc.gallery && loc.gallery.length > 0 && (
        <section className="py-20 bg-[color:var(--ink)] text-white">
          <div className="container-lux">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="kbd-eyebrow text-[color:var(--gold)]">Portfolio Preview</div>
                <h2 className="mt-3 font-display text-3xl md:text-5xl">Visual Frames from {loc.name}</h2>
              </div>
              <Link to="/portfolio" className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold)] hover:underline flex items-center gap-2">
                Explore Full Portfolio
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {loc.gallery.map((g, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-sm group relative">
                  <img
                    src={g}
                    alt={`${loc.name} wedding photo ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {loc.faqs && loc.faqs.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-lux max-w-4xl">
            <div className="text-center mb-12">
              <div className="kbd-eyebrow text-[color:var(--gold)]">Questions & Answers</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">{loc.name} Wedding FAQs</h2>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {loc.faqs.map((f, i) => (
                <details key={i} className="group py-6 cursor-pointer">
                  <summary className="font-display text-lg flex items-center justify-between list-none font-medium">
                    <span>{f.q}</span>
                    <span className="ml-4 text-[color:var(--gold)] group-open:rotate-45 transition-transform text-xl">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-3xl">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Service Areas */}
      <section className="py-20 bg-muted/40 border-t border-border">
        <div className="container-lux">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="kbd-eyebrow text-[color:var(--gold)]">Explore More</div>
              <h2 className="mt-2 font-display text-2xl md:text-3xl">Other Service Areas</h2>
            </div>
            <Link to="/locations" className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold)] hover:underline">
              View all 12 locations →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {otherLocations.map((ol) => (
              <Link
                key={ol.slug}
                to="/locations/$slug"
                params={{ slug: ol.slug }}
                className="p-4 bg-background border border-border hover:border-[color:var(--gold)] text-center rounded-sm transition-all hover:-translate-y-0.5 group"
              >
                <MapPin className="size-4 text-[color:var(--gold)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-display text-sm font-medium block">{ol.name}</span>
                <span className="text-[10px] text-muted-foreground block mt-1">{ol.region}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[color:var(--ink)] text-white text-center">
        <div className="container-lux max-w-3xl">
          <div className="kbd-eyebrow text-[color:var(--gold)] mb-4">Book Your Dates</div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Planning a wedding in {loc.name}?
          </h2>
          <p className="mt-4 text-white/70 text-base md:text-lg max-w-xl mx-auto">
            Let's discuss your timeline, venue framing, and customized cinematography package.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[color:var(--gold)] text-black px-8 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-white transition-colors"
            >
              <Send className="size-4" /> Start Consultation
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
