import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Star } from "lucide-react";
import { IgIcon, YtIcon, FbIcon } from "./brand-icons";
import { useSiteContent } from "@/hooks/useSiteContent";
import { services } from "@/data/services";

export function SiteFooter() {
  const { settings } = useSiteContent();
  const cols = services.slice(0, 8);
  return (
    <footer className="bg-[color:var(--ink)] text-white">
      <div className="container-lux py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={settings.logoUrl} alt={settings.name} className="h-16 w-auto object-contain" />
          <div className="kbd-eyebrow text-[color:var(--gold)] mt-4">{settings.tagline}</div>
          <p className="mt-6 text-sm text-white/60 max-w-xs leading-relaxed">
            A photography and cinematography atelier serving India and the world for six decades.
          </p>
          <div className="flex gap-3 mt-6">
            <a href={settings.social.instagram} aria-label="Instagram" className="p-2 border border-white/10 hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition-colors">
              <IgIcon className="size-4" />
            </a>
            <a href={settings.social.youtube} aria-label="YouTube" className="p-2 border border-white/10 hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition-colors">
              <YtIcon className="size-4" />
            </a>
            <a href={settings.social.facebook} aria-label="Facebook" className="p-2 border border-white/10 hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition-colors">
              <FbIcon className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <div className="kbd-eyebrow text-[color:var(--gold)] mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/portfolio" className="hover:text-white">Portfolio</Link></li>
            <li><Link to="/films" className="hover:text-white">Films</Link></li>
            <li><Link to="/locations" className="hover:text-white">Service Areas</Link></li>
            <li><Link to="/reviews" className="hover:text-white">Reviews</Link></li>
            <li><Link to="/blog" className="hover:text-white">Journal</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="kbd-eyebrow text-[color:var(--gold)] mb-4">Services</div>
          <ul className="space-y-2 text-sm text-white/70">
            {cols.map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
            <li><Link to="/services" className="text-[color:var(--gold)] hover:underline">View all →</Link></li>
          </ul>
        </div>

        <div>
          <div className="kbd-eyebrow text-[color:var(--gold)] mb-4">Studio</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3"><MapPin className="size-4 shrink-0 mt-0.5 text-[color:var(--gold)]" /> {settings.address}</li>
            <li className="flex gap-3"><Phone className="size-4 shrink-0 mt-0.5 text-[color:var(--gold)]" /> <a href={`tel:${settings.phoneRaw}`}>{settings.phone}</a></li>
            <li className="flex gap-3"><Mail className="size-4 shrink-0 mt-0.5 text-[color:var(--gold)]" /> <a href={`mailto:${settings.email}`}>{settings.email}</a></li>
            <li className="flex gap-3"><Star className="size-4 shrink-0 mt-0.5 text-[color:var(--gold)]" /> {settings.stats.rating} ★ ({settings.stats.reviews} Google reviews)</li>
          </ul>
          <div className="text-xs text-white/50 mt-4">{settings.hours}</div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-lux py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>© {new Date().getFullYear()} {settings.name}. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <a href="/sitemap.xml" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
