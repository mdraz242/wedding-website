import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Play, Star, MapPin, Phone, MessageCircle, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { img, gallery } from "@/lib/site";
import { featured, services } from "@/data/services";
import { locations } from "@/data/locations";
import heroVideoNew from "@/assets/kamal-hero-v2.mp4.asset.json";
import heroVideoMain from "@/assets/kamal-hero.mp4.asset.json";
import heroVideo1 from "@/assets/hero-1.mp4.asset.json";
import heroVideo2 from "@/assets/hero-2.mp4.asset.json";
import heroVideoLocal from "@/assets/video.mp4";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kamal Studios — Luxury Wedding & Cinematic Photography Since 1966" },
      { name: "description", content: "Kamal Studios is India's heritage photography and cinematography atelier. Six decades of luxury wedding, portrait, fashion and commercial imagery." },
      { property: "og:title", content: "Kamal Studios — Luxury Wedding & Cinematic Photography Since 1966" },
      { property: "og:description", content: "Kamal Studios is India's heritage photography and cinematography atelier. Six decades of luxury wedding, portrait, fashion and commercial imagery." },
      { property: "og:image", content: img.heroWedding },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function HomePage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <LogoReveal />
      <SiteNav />
      <Hero />
      <StatsMarquee />
      <FeaturedServices />
      <PortfolioPreview />
      <FilmsSection />
      <WhyUs />
      <GoogleReviews />
      <Process />
      <ServiceAreas />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </div>
  );
}

/* ---------- Logo reveal (2s intro) ---------- */
function LogoReveal() {
  const { settings } = useSiteContent();
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);
  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("ks-intro")) {
      setHidden(true);
      return;
    }
    const t1 = setTimeout(() => setFade(true), 1700);
    const t2 = setTimeout(() => {
      setHidden(true);
      try { sessionStorage.setItem("ks-intro", "1"); } catch { /* noop */ }
    }, 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (hidden) return null;
  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500 ${fade ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      aria-hidden
    >
      <img
        src={settings.logoUrl}
        alt={settings.name}
        className="max-w-[78%] md:max-w-md w-auto h-auto animate-[logoIn_1.8s_cubic-bezier(.2,.7,.2,1)_both]"
      />
      <style>{`@keyframes logoIn { 0%{opacity:0;transform:scale(.92);filter:blur(6px)} 55%{opacity:1;filter:blur(0)} 100%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

/* ---------- Hero (editorial, minimal) ---------- */
function Hero() {
  const { settings } = useSiteContent();
  const [active, setActive] = useState(0);
  const videos = [heroVideoLocal, heroVideoNew.url, heroVideoMain.url, heroVideo1.url, heroVideo2.url];
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % videos.length), 8000);
    return () => clearInterval(id);
  }, [videos.length]);
  return (
    <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden">
      <div className="absolute inset-0">
        {videos.map((src, i) => (
          <video
            key={src}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={img.heroWedding}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ${active === i ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/85" />
      </div>

      <div className="relative z-10 h-full container-lux flex flex-col items-center justify-end pb-[18vh] text-center text-white">
        <div className="max-w-xl">
          <h1 className="font-display text-[clamp(1.6rem,3.4vw,2.75rem)] leading-[1.15] tracking-tight reveal">
            {settings.hero.title_part1}
            <br />
            <span className="italic text-[color:var(--gold)]">{settings.hero.title_part2}</span>
          </h1>
          <p className="mt-8 mx-auto max-w-sm text-white/70 text-[13px] sm:text-sm leading-relaxed reveal">
            {settings.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 reveal">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-[color:var(--gold)] text-black px-7 py-3.5 text-[11px] uppercase tracking-[0.28em] font-medium hover:bg-white transition-colors"
            >
              Book Now <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 border border-white/40 text-white px-7 py-3.5 text-[11px] uppercase tracking-[0.28em] font-medium hover:bg-white hover:text-black transition-colors"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Show clip ${i + 1}`}
            className={`h-0.5 transition-all ${active === i ? "w-10 bg-[color:var(--gold)]" : "w-6 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------- Moving statistics marquee ---------- */
function StatsMarquee() {
  const { settings } = useSiteContent();
  const items = [
    `${new Date().getFullYear() - settings.since}+ Years of craft`,
    `${settings.stats.projects} Weddings captured`,
    `${settings.stats.clients} Happy families`,
    `${settings.stats.cities} Cities served`,
    `${settings.stats.rating}★ Google rating`,
    `${settings.stats.reviews}+ Verified reviews`,
    `Since ${settings.since} · ${settings.address.split(",")[1]?.trim() || "Chandigarh"}`,
    "Worldwide · Destination ready",
  ];
  const loop = [...items, ...items];
  return (
    <section className="bg-[color:var(--ink)] text-white border-y border-white/10 overflow-hidden">
      <div className="relative flex whitespace-nowrap animate-[marquee_38s_linear_infinite]">
        {loop.map((t, i) => (
          <div key={i} className="flex items-center gap-6 px-8 py-6">
            <span className="font-display text-2xl md:text-3xl tracking-wide">{t}</span>
            <span className="text-[color:var(--gold)] text-xl">✦</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </section>
  );
}
/* ---------- Featured services ---------- */
function FeaturedServices() {
  return (
    <section className="py-24 md:py-32 bg-[color:var(--ink)] text-white">
      <div className="container-lux">
        <div className="flex flex-wrap items-end justify-between gap-6 reveal">
          <div>
            <div className="kbd-eyebrow text-[color:var(--gold)]">Signature services</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">Craft, across every occasion.</h2>
          </div>
          <Link to="/services" className="text-sm uppercase tracking-[0.22em] hover-gold flex items-center gap-2">
            View all services <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group relative block overflow-hidden reveal"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <img
                  src={s.hero}
                  alt={s.title}
                  className="h-full w-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-[10px] tracking-[0.28em] uppercase text-[color:var(--gold)]">{s.category}</div>
                <div className="mt-1 font-display text-2xl">{s.title}</div>
                <div className="text-white/70 text-sm mt-1">{s.short}</div>
                <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em]">
                  Explore <ArrowUpRight className="size-4 text-[color:var(--gold)]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why us ---------- */
function WhyUs() {
  const rows = [
    ["Experienced photographers", "Six decades of accumulated craft."],
    ["Cinematic post-production", "Colour-graded for cinema, not for feeds."],
    ["Fine-art heirloom albums", "Italian-bound, archival, hand-designed."],
    ["Certified drone operators", "DGCA-certified, cinema-grade rigs."],
    ["Destination-ready crew", "Airline-tested logistics, anywhere."],
    ["Fast, curated delivery", "Sneak peek in 72h, full gallery in 14 days."],
    ["A single point of contact", "One producer, from consult to delivery."],
    ["Latest cameras & optics", "Continuously refreshed, always insured."],
  ];
  return (
    <section className="py-28 md:py-36">
      <div className="container-lux grid gap-16 md:grid-cols-12 items-start">
        <div className="md:col-span-5 md:sticky md:top-32 reveal">
          <div className="kbd-eyebrow text-[color:var(--gold)]">Why Kamal Studios</div>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[1]">
            The atelier<br />behind the frame.
          </h2>
          <img src={img.studio} alt="Kamal Studios team on set" className="mt-10 aspect-[4/3] w-full object-cover" />
        </div>
        <ul className="md:col-span-7 divide-y divide-border reveal">
          {rows.map(([t, d], i) => (
            <li key={t} className="py-6 grid grid-cols-[auto_1fr] gap-6 items-baseline group">
              <span className="text-xs text-muted-foreground tabular-nums">0{i + 1}</span>
              <div>
                <h3 className="font-display text-2xl text-foreground group-hover:text-[color:var(--gold)] transition-colors">{t}</h3>
                <p className="text-muted-foreground mt-1">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Portfolio preview ---------- */
function PortfolioPreview() {
  const shots = gallery.slice(0, 8);
  return (
    <section className="py-24 md:py-32 bg-secondary/50">
      <div className="container-lux">
        <div className="flex flex-wrap items-end justify-between gap-6 reveal">
          <div>
            <div className="kbd-eyebrow text-[color:var(--gold)]">Selected work</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">A quiet portfolio.</h2>
          </div>
          <Link to="/portfolio" className="text-sm uppercase tracking-[0.22em] hover-gold flex items-center gap-2">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {shots.map((src, i) => (
            <div
              key={src + i}
              className={`overflow-hidden bg-black reveal ${i % 5 === 0 ? "row-span-2 aspect-[3/5]" : "aspect-[4/5]"}`}
            >
              <img src={src} alt="Portfolio work by Kamal Studios" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Films ---------- */
function FilmsSection() {
  const { settings } = useSiteContent();
  return (
    <section className="py-28 md:py-36">
      <div className="container-lux">
        <div className="flex flex-wrap items-end justify-between gap-6 reveal">
          <div>
            <div className="kbd-eyebrow text-[color:var(--gold)]">Cinematic films</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">Films that play like memory.</h2>
          </div>
          <a href={settings.social.youtube} target="_blank" rel="noreferrer" className="text-sm uppercase tracking-[0.22em] hover-gold flex items-center gap-2">
            YouTube channel <ArrowUpRight className="size-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[img.couple3, img.destination, img.music].map((src, i) => (
            <a
              key={src}
              href={settings.social.youtube}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-video overflow-hidden bg-black reveal"
            >
              <img src={src} alt={`Featured film ${i + 1}`} className="h-full w-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-16 rounded-full bg-[color:var(--gold)]/90 text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="size-6 ml-1 fill-current" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}



function GoogleReviews() {
  const reviews = [
    { n: "Rohan Mehta", d: "3 weeks ago", q: "From consultation to delivery, everything was flawless. The final film brought us to tears." },
    { n: "Nisha Rao", d: "2 months ago", q: "Our maternity shoot was intimate and beautifully lit. The team made me feel comfortable throughout." },
    { n: "Aarav Kapoor", d: "1 month ago", q: "The heirloom album is genuinely museum quality. Six generations will keep this." },
    { n: "Priya Sharma", d: "5 weeks ago", q: "Kamal Studios turned our destination wedding into a cinematic story. Every frame is art." },
    { n: "Devansh Gill", d: "2 weeks ago", q: "Calm crew, cinematic eye, ridiculously fast delivery. Booked them again already." },
    { n: "Ishita Bansal", d: "3 months ago", q: "Six decades of craft shows in every detail. The film plays like a Wes Anderson short." },
  ];
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  const { settings } = useSiteContent();
  return (
    <section className="py-24 md:py-32">
      <div className="container-lux">
        <div className="grid md:grid-cols-3 gap-10 items-end reveal">
          <div className="md:col-span-2">
            <div className="kbd-eyebrow text-[color:var(--gold)]">Google reviews</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl leading-[1]">
              {settings.stats.rating}<span className="text-[color:var(--gold)]"> ★</span> · loved by {settings.stats.reviews}+ families.
            </h2>
          </div>
          <div className="flex md:justify-end gap-2">
            <button onClick={() => scrollBy(-1)} aria-label="Previous review" className="p-3 border border-border hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition-colors">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={() => scrollBy(1)} aria-label="Next review" className="p-3 border border-border hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition-colors">
              <ChevronRight className="size-4" />
            </button>
            <a href={settings.social.google} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-2 border border-border px-5 py-3 text-xs uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition-colors">
              Read all <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-12 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden reveal"
        >
          {reviews.map((r) => (
            <figure key={r.n} className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[38%] lg:w-[32%] border border-border bg-card p-8">
              <div className="flex text-[color:var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-foreground leading-relaxed">&ldquo;{r.q}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-medium">{r.n.charAt(0)}</div>
                <div>
                  <div className="font-medium text-sm">{r.n}</div>
                  <div className="text-xs text-muted-foreground">{r.d} · Google</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Process ---------- */
function Process() {
  const steps = ["Consultation", "Planning", "Photography", "Editing", "Delivery", "Memories forever"];
  return (
    <section className="py-24 md:py-32 bg-secondary/50">
      <div className="container-lux">
        <div className="kbd-eyebrow text-[color:var(--gold)] reveal">Our process</div>
        <h2 className="mt-3 font-display text-4xl md:text-6xl reveal">Unhurried, considered, delivered.</h2>

        <ol className="mt-16 grid md:grid-cols-6 gap-y-10">
          {steps.map((s, i) => (
            <li key={s} className="relative reveal">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full border border-[color:var(--gold)] text-[color:var(--gold)] flex items-center justify-center text-xs font-medium">
                  {i + 1}
                </div>
                <div className="h-px flex-1 bg-border md:block hidden" />
              </div>
              <div className="mt-4 font-display text-xl">{s}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Service areas ---------- */
function ServiceAreas() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-lux grid md:grid-cols-12 gap-12 items-center reveal">
        <div className="md:col-span-5">
          <div className="kbd-eyebrow text-[color:var(--gold)]">Service areas</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">A studio without borders.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Headquartered in Chandigarh, working across India and the world.
            Destination-ready with a self-contained crew.
          </p>
          <div className="mt-6">
            <Link
              to="/locations"
              className="text-xs uppercase tracking-[0.22em] text-[color:var(--gold)] hover:underline inline-flex items-center gap-1.5 font-medium"
            >
              Explore all locations <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
        <ul className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
          {locations.map((loc) => (
            <li key={loc.slug}>
              <Link
                to="/locations/$slug"
                params={{ slug: loc.slug }}
                className="group flex items-center justify-between py-2.5 border-b border-border hover:border-[color:var(--gold)] text-foreground hover:text-[color:var(--gold)] transition-all duration-200"
              >
                <span className="flex items-center gap-2 font-medium">
                  <MapPin className="size-3.5 text-[color:var(--gold)] shrink-0 group-hover:scale-110 transition-transform" />
                  {loc.name}
                </span>
                <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-[color:var(--gold)] transition-all shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const faqs = [
    { q: "How far in advance should I book?", a: "For weddings, 6–9 months for peak dates. For portraits and commercial work, 3–4 weeks is comfortable." },
    { q: "Do you travel for destination weddings?", a: "Yes — we shoot destination weddings across India and internationally with a self-contained crew and producer." },
    { q: "When do we receive our photos and film?", a: "A sneak peek arrives in 72 hours, the full curated gallery in 14 days, and the highlight film within 4–6 weeks." },
    { q: "Can I customise a package?", a: "Absolutely — every engagement begins with a consultation to shape a package around your day." },
    { q: "Do you offer photo albums?", a: "Yes — hand-designed, Italian-bound, archival fine-art albums, printed on giclée papers." },
  ];
  return (
    <section className="py-24 md:py-32 bg-[color:var(--ink)] text-white">
      <div className="container-lux grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 reveal">
          <div className="kbd-eyebrow text-[color:var(--gold)]">FAQ</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Answers, before you ask.</h2>
        </div>
        <div className="md:col-span-8 divide-y divide-white/10 reveal">
          {faqs.map((f, i) => (
            <details key={i} className="group py-6">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-display text-xl">{f.q}</span>
                <span className="text-[color:var(--gold)] text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-white/70 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA() {
  const { settings } = useSiteContent();
  const whatsappUrl = settings.whatsapp.startsWith("http")
    ? settings.whatsapp
    : `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`;
  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      <img src={img.destination} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative container-lux text-center text-white reveal">
        <div className="kbd-eyebrow text-[color:var(--gold)]">Begin</div>
        <h2 className="mt-4 font-display text-4xl md:text-7xl leading-[1]">Book your shoot today.</h2>
        <p className="mt-6 max-w-xl mx-auto text-white/80">
          Every celebrated wedding, every heirloom portrait, every campaign — it starts with a conversation.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[color:var(--gold)] text-black px-6 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-white transition-colors">
            <Send className="size-4" /> Book consultation
          </Link>
          <a href={whatsappUrl} className="inline-flex items-center gap-2 border border-white/30 px-6 py-4 text-xs uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-colors">
            <MessageCircle className="size-4" /> WhatsApp
          </a>
          <a href={`tel:${settings.phoneRaw}`} className="inline-flex items-center gap-2 border border-white/30 px-6 py-4 text-xs uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-colors">
            <Phone className="size-4" /> {settings.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

// Keep references so tree-shake keeps them.
void services;
