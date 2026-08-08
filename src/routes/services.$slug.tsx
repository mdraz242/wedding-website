import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Phone, Send, Star } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { serviceBySlug, services, type Service } from "@/data/services";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const svc = serviceBySlug(params.slug);
    if (!svc) throw notFound();
    return svc;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Kamal Studios` },
          { name: "description", content: `${loaderData.short} ${loaderData.intro.slice(0, 140)}` },
          { property: "og:title", content: `${loaderData.title} — Kamal Studios` },
          { property: "og:description", content: loaderData.short },
          { property: "og:image", content: loaderData.hero },
        ]
      : [],
  }),
  component: ServicePage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl">Service not found</h1>
        <Link to="/services" className="mt-4 inline-block text-[color:var(--gold)]">View all services</Link>
      </div>
    </div>
  ),
});

function ServicePage() {
  const initialSvc = Route.useLoaderData() as Service;
  const { settings, customServices } = useSiteContent();
  const s = (customServices?.find((x) => x.slug.toLowerCase() === initialSvc.slug.toLowerCase()) || initialSvc) as Service;
  const whatsappUrl = settings.whatsapp.startsWith("http")
    ? settings.whatsapp
    : `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`;
  const allServices = (customServices && customServices.length > 0 ? customServices : services) as Service[];
  const related: Service[] = (s.related ?? [])
    .map((r) => allServices.find((x) => x.slug === r))
    .filter((x): x is Service => !!x);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero */}
      <section className="relative min-h-[80svh] min-h-[620px] overflow-hidden flex flex-col justify-end">
        <img src={s.hero} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        <div className="relative container-lux w-full h-full flex flex-col justify-end pb-16 pt-36 md:pt-44 text-white z-10">
          <nav className="text-xs uppercase tracking-[0.22em] text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> · <Link to="/services" className="hover:text-white">Services</Link> · <span className="text-[color:var(--gold)]">{s.title}</span>
          </nav>
          <div className="kbd-eyebrow text-[color:var(--gold)] mt-6">{s.category}</div>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[1]">{s.title}</h1>
          <p className="mt-4 text-white/80 max-w-2xl">{s.short}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[color:var(--gold)] text-black px-6 py-3.5 text-xs uppercase tracking-[0.24em] font-medium hover:bg-white transition-colors">
              Book consultation
            </Link>
            <a href={whatsappUrl} className="inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-xs uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-colors">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24">
        <div className="container-lux grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <div className="kbd-eyebrow text-[color:var(--gold)]">Overview</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">A considered approach to {s.title.toLowerCase()}.</h2>
          </div>
          <div className="md:col-span-7 space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">{s.intro}</p>
            <ul className="grid sm:grid-cols-2 gap-3 pt-4">
              {s.features.map((f) => (
                <li key={f} className="flex gap-3 items-start">
                  <Check className="size-4 mt-1 text-[color:var(--gold)]" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-24">
        <div className="container-lux">
          <div className="kbd-eyebrow text-[color:var(--gold)]">Selected work</div>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">Recent {s.title.toLowerCase()}.</h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {s.gallery.map((g, i) => (
              <div key={g + i} className={`overflow-hidden bg-black ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-[4/5]" : "aspect-[4/5]"}`}>
                <img src={g} alt={`${s.title} sample ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      {s.process && (
        <section className="py-24 bg-secondary/50">
          <div className="container-lux">
            <div className="kbd-eyebrow text-[color:var(--gold)]">Process</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">From consult to delivery.</h2>
            <ol className="mt-12 grid md:grid-cols-5 gap-8">
              {s.process.map((p, i) => (
                <li key={p.step}>
                  <div className="size-9 rounded-full border border-[color:var(--gold)] text-[color:var(--gold)] flex items-center justify-center text-xs">{i + 1}</div>
                  <div className="mt-4 font-display text-xl">{p.step}</div>
                  <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Packages intentionally removed — every engagement is bespoke. */}

      {/* Testimonial */}
      <section className="py-24 bg-[color:var(--ink)] text-white">
        <div className="container-lux max-w-3xl text-center">
          <div className="flex justify-center text-[color:var(--gold)]">
            {Array.from({length:5}).map((_,i)=><Star key={i} className="size-4 fill-current"/>)}
          </div>
          <blockquote className="mt-6 font-display text-2xl md:text-3xl italic leading-snug">
            &ldquo;They didn't just document the day — they gave us a heirloom our grandchildren will hold.&rdquo;
          </blockquote>
          <div className="mt-6 text-sm text-white/60">— A recent Kamal Studios client</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container-lux grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="kbd-eyebrow text-[color:var(--gold)]">FAQ</div>
            <h2 className="mt-3 font-display text-4xl">Common questions.</h2>
          </div>
          <div className="md:col-span-8 divide-y divide-border">
            {s.faqs.map((f, i) => (
              <details key={i} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-display text-lg">{f.q}</span>
                  <span className="text-[color:var(--gold)] text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-24 bg-secondary/50">
          <div className="container-lux">
            <div className="kbd-eyebrow text-[color:var(--gold)]">Related</div>
            <h2 className="mt-3 font-display text-4xl">You might also love.</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} to="/services/$slug" params={{ slug: r.slug }} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-black">
                    <img src={r.hero} alt={r.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="font-display text-xl">{r.title}</div>
                      <div className="text-sm text-muted-foreground">{r.short}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-[color:var(--ink)] text-white">
        <div className="container-lux text-center">
          <h2 className="font-display text-4xl md:text-6xl">Ready when you are.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[color:var(--gold)] text-black px-6 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-white transition-colors"><Send className="size-4" /> Enquire now</Link>
            <a href={whatsappUrl} className="inline-flex items-center gap-2 border border-white/30 px-6 py-4 text-xs uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-colors"><MessageCircle className="size-4" /> WhatsApp</a>
            <a href={`tel:${settings.phoneRaw}`} className="inline-flex items-center gap-2 border border-white/30 px-6 py-4 text-xs uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-colors"><Phone className="size-4" /> Call</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
