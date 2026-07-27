import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { grouped } from "@/data/services";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Photography & Cinematography Services — Kamal Studios" },
      { name: "description", content: "Explore Kamal Studios' full range of photography, cinematography, event and commercial services." },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const g = grouped();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <section className="pt-40 pb-20 border-b border-border">
        <div className="container-lux">
          <div className="kbd-eyebrow text-[color:var(--gold)]">All services</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">Every service, one atelier.</h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            From cinematic weddings to campaign-grade product imagery — a single team, six decades of craft.
          </p>
        </div>
      </section>

      {(Object.keys(g) as (keyof typeof g)[]).map((cat) => (
        <section key={cat} className="py-20 border-b border-border">
          <div className="container-lux">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-display text-3xl md:text-4xl">{cat}</h2>
              <div className="kbd-eyebrow text-muted-foreground">{g[cat].length} services</div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {g[cat].map((s) => (
                <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-black">
                    <img src={s.hero} alt={s.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-display text-xl group-hover:text-[color:var(--gold)] transition-colors">{s.title}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{s.short}</div>
                    </div>
                    <ArrowUpRight className="size-4 text-[color:var(--gold)] mt-1 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <SiteFooter />
    </div>
  );
}
