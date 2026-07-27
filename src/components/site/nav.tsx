import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { grouped, type ServiceCategory } from "@/data/services";
import { useSiteContent } from "@/hooks/useSiteContent";

const SERVICE_CATS: ServiceCategory[] = ["Photography", "Videography", "Events", "Commercial"];

// Only the home page renders a full-bleed dark hero behind the navbar.
const DARK_HERO_ROUTES = new Set<string>(["/"]);

export function SiteNav() {
  const { settings } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [openCat, setOpenCat] = useState<ServiceCategory | null>(null);
  const [mobile, setMobile] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const overDarkHero = DARK_HERO_ROUTES.has(pathname);
  const solid = scrolled || openCat !== null || !overDarkHero;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const whatsappUrl = settings.whatsapp.startsWith("http")
    ? settings.whatsapp
    : `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const g = grouped();

  const hover = (cat: ServiceCategory) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenCat(cat);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenCat(null), 120);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "bg-background/95 backdrop-blur-lg border-b border-border text-foreground"
            : "bg-transparent text-white"
        }`}
        onMouseLeave={leave}
      >
        <div className="container-lux flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <div className="hidden sm:block leading-none">
              <div className="font-display text-lg tracking-wide">Kamal Studios</div>
              <div className="kbd-eyebrow text-[9px] opacity-70 mt-1">Since 1966</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[12px] font-medium tracking-wide">
            <NavLink to="/" label="Home" />
            <NavLink to="/about" label="About" />
            {SERVICE_CATS.map((cat) => (
              <div key={cat} className="relative" onMouseEnter={() => hover(cat)}>
                <button
                  className={`flex items-center gap-1 py-2 transition-colors ${openCat === cat ? "text-[color:var(--gold)]" : "hover:text-[color:var(--gold)]"}`}
                >
                  {cat}
                  <span className="text-[9px]">▾</span>
                </button>
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-opacity duration-200 ${
                    openCat === cat ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-[color:var(--ink)] text-white shadow-2xl min-w-[220px] py-2">
                    {(g[cat] ?? []).slice(0, 8).map((s) => (
                      <Link
                        key={s.slug}
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        onClick={() => setOpenCat(null)}
                        className="block px-5 py-2 text-[12px] text-white/80 hover:text-[color:var(--gold)] hover:bg-white/5 transition-colors"
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <NavLink to="/portfolio" label="Portfolio" />
            <NavLink to="/films" label="Films" />
            <NavLink to="/reviews" label="Reviews" />
            <NavLink to="/blog" label="Blog" />
            <NavLink to="/contact" label="Contact" />
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[color:var(--gold)] text-black px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)] transition-colors"
            >
              Book Now
            </Link>
          </div>

          <button
            className="lg:hidden p-2 -mr-2"
            aria-label="Open menu"
            onClick={() => setMobile(true)}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobile && (
        <div className="fixed inset-0 z-[60] bg-[color:var(--ink)] text-white overflow-y-auto">
          <div className="container-lux flex items-center justify-between h-16">
            <Link to="/" onClick={() => setMobile(false)} className="flex items-center gap-3">
              <BrandMark />
              <span className="font-display text-lg">Kamal Studios</span>
            </Link>
            <button aria-label="Close" onClick={() => setMobile(false)} className="p-2">
              <X className="size-6" />
            </button>
          </div>
          <div className="container-lux pb-24">
            <ul className="divide-y divide-white/10 mt-4">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/portfolio", label: "Portfolio" },
                { to: "/films", label: "Films" },
                { to: "/reviews", label: "Reviews" },
                { to: "/blog", label: "Blog" },
                { to: "/contact", label: "Contact" },
              ].map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setMobile(false)}
                    className="block py-4 text-2xl font-display"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <div className="kbd-eyebrow text-[color:var(--gold)] mb-3">Services</div>
              {SERVICE_CATS.map((cat) => (
                <details key={cat} className="border-t border-white/10 py-3 group">
                  <summary className="flex justify-between items-center cursor-pointer list-none text-white/90">
                    <span className="font-display text-lg">{cat}</span>
                    <span className="text-[color:var(--gold)] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <ul className="mt-2 pl-2 space-y-2">
                    {(g[cat] ?? []).map((s) => (
                      <li key={s.slug}>
                        <Link
                          to="/services/$slug"
                          params={{ slug: s.slug }}
                          onClick={() => setMobile(false)}
                          className="block py-1.5 text-sm text-white/70 hover:text-white"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <a href={`tel:${settings.phoneRaw}`} className="flex items-center justify-center gap-2 border border-white/20 py-3 text-sm">
                <Phone className="size-4" /> Call
              </a>
              <a href={whatsappUrl} className="flex items-center justify-center gap-2 bg-[color:var(--gold)] text-black py-3 text-sm font-medium">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      activeProps={{ className: "text-[color:var(--gold)]" }}
      className="py-2 hover:text-[color:var(--gold)] transition-colors"
    >
      {label}
    </Link>
  );
}

function BrandMark() {
  const { settings } = useSiteContent();
  return (
    <img
      src={settings.logoUrl}
      alt={settings.name}
      className="h-10 w-auto object-contain"
      loading="eager"
      decoding="async"
    />
  );
}

